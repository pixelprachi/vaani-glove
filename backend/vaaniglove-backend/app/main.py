from pydantic import BaseModel
from fastapi import FastAPI, Depends, HTTPException, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy import func
from . import models, auth
from .database import get_db, engine, Base

Base.metadata.create_all(bind=engine)
app = FastAPI(title="Vaani Glove Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

active_sockets: dict[str, list[WebSocket]] = {}

# ---- Auth ----
@app.post("/auth/register")
def register(email: str, password: str, display_name: str, db: Session = Depends(get_db)):
    if db.query(models.User).filter_by(email=email).first():
        raise HTTPException(400, "Email already registered")
    user = models.User(email=email, hashed_password=auth.hash_password(password),
                        display_name=display_name)
    db.add(user); db.commit(); db.refresh(user)
    return {"token": auth.create_token(user.id)}

@app.post("/auth/login")
def login(email: str, password: str, db: Session = Depends(get_db)):
    user = db.query(models.User).filter_by(email=email).first()
    if not user or not auth.verify_password(password, user.hashed_password):
        raise HTTPException(401, "Invalid credentials")
    return {"token": auth.create_token(user.id)}

# ---- Device pairing ----
@app.post("/devices/pair")
def pair_device(user_id: str, hub_ble_id: str, db: Session = Depends(get_db)):
    device = models.Device(owner_id=user_id, hub_ble_id=hub_ble_id)
    db.add(device); db.commit()
    return {"paired": True, "device_id": device.id}

# ---- Calibration ----
@app.post("/calibration")
def save_calibration(user_id: str, hand: str, fist_values: list, open_values: list,
                      db: Session = Depends(get_db)):
    cal = models.Calibration(user_id=user_id, hand=hand,
                              fist_values=fist_values, open_values=open_values)
    db.add(cal); db.commit()
    return {"saved": True}

# ---- Official vocabulary (read-only) ----
@app.get("/vocabulary/official")
def get_official_vocab(language: str = "en", db: Session = Depends(get_db)):
    signs = db.query(models.OfficialSign).order_by(models.OfficialSign.id).all()
    return [{"id": s.id, "key": s.key, "label": s.labels.get(language, s.labels["en"])} for s in signs]

# ---- Personal vocabulary (record-a-sign) ----
class PersonalSignCreate(BaseModel):
    user_id: str
    text_meaning: str
    template_windows: list = []

@app.post("/vocabulary/personal")
def add_personal_sign(payload: PersonalSignCreate, db: Session = Depends(get_db)):
    sign = models.PersonalSign(user_id=payload.user_id, text_meaning=payload.text_meaning,
                                template_windows=payload.template_windows)
    db.add(sign); db.commit()
    return {"id": sign.id}



@app.get("/vocabulary/personal")
def list_personal_signs(user_id: str, db: Session = Depends(get_db)):
    signs = db.query(models.PersonalSign).filter_by(user_id=user_id, recording_status="ready").all()
    return [{"id": s.id, "text": s.text_meaning, "template": s.template_windows} for s in signs]

class PersonalSignRecordRequest(BaseModel):
    user_id: str
    text_meaning: str

@app.post("/vocabulary/personal/record")
def start_recording_sign(payload: PersonalSignRecordRequest, db: Session = Depends(get_db)):
    sign = models.PersonalSign(user_id=payload.user_id, text_meaning=payload.text_meaning,
                                template_windows=[], recording_status="pending")
    db.add(sign); db.commit()
    return {"id": sign.id, "status": sign.recording_status}

@app.get("/vocabulary/personal/pending")
def list_pending_signs(user_id: str, db: Session = Depends(get_db)):
    signs = db.query(models.PersonalSign).filter_by(user_id=user_id, recording_status="pending").order_by(models.PersonalSign.created_at.asc()).all()
    return [{"id": s.id, "text": s.text_meaning} for s in signs]

@app.get("/vocabulary/personal/{sign_id}/status")
def get_sign_status(sign_id: str, db: Session = Depends(get_db)):
    sign = db.query(models.PersonalSign).filter_by(id=sign_id).first()
    if not sign:
        raise HTTPException(404, "Sign not found")
    return {"id": sign.id, "text": sign.text_meaning, "status": sign.recording_status}

class PersonalSignCompleteRequest(BaseModel):
    template_windows: list

@app.post("/vocabulary/personal/{sign_id}/complete")
def complete_recording_sign(sign_id: str, payload: PersonalSignCompleteRequest, db: Session = Depends(get_db)):
    sign = db.query(models.PersonalSign).filter_by(id=sign_id).first()
    if not sign:
        raise HTTPException(404, "Sign not found")
    sign.template_windows = payload.template_windows
    sign.recording_status = "ready"
    db.commit()
    return {"id": sign.id, "status": sign.recording_status}

@app.delete("/vocabulary/personal/{sign_id}")
def delete_personal_sign(sign_id: str, db: Session = Depends(get_db)):
    sign = db.query(models.PersonalSign).filter_by(id=sign_id).first()
    if not sign:
        raise HTTPException(404, "Sign not found")
    db.delete(sign)
    db.commit()
    return {"deleted": True}
# ---- Language setting ----
@app.get("/users/{user_id}/language")
def get_language(user_id: str, db: Session = Depends(get_db)):
    user = db.query(models.User).get(user_id)
    if not user:
        raise HTTPException(404, "User not found")
    return {"language": user.language or "en"}

@app.post("/users/{user_id}/language")
def set_language(user_id: str, language: str, db: Session = Depends(get_db)):
    user = db.query(models.User).get(user_id)
    user.language = language; db.commit()
    return {"language": user.language}

# ---- Transcript ingestion + live push ----
@app.post("/transcript")
async def add_transcript(user_id: str, source: str, text: str, confidence: float,
                          db: Session = Depends(get_db)):
    entry = models.TranscriptEntry(user_id=user_id, source=source, text=text,
                                    confidence=confidence)
    db.add(entry); db.commit()
    for ws in active_sockets.get(user_id, []):
        await ws.send_json({"text": text, "source": source, "confidence": confidence})
    return {"logged": True}

@app.websocket("/ws/transcript/{user_id}")
async def transcript_socket(websocket: WebSocket, user_id: str):
    await websocket.accept()
    active_sockets.setdefault(user_id, []).append(websocket)
    try:
        while True:
            await websocket.receive_text()
    except WebSocketDisconnect:
        active_sockets[user_id].remove(websocket)

# ---- Admin dashboard (anonymized aggregates only) ----
@app.get("/admin/stats")
def admin_stats(db: Session = Depends(get_db)):
    total = db.query(func.count(models.TranscriptEntry.id)).scalar()
    low_conf = db.query(func.count(models.TranscriptEntry.id)) \
                 .filter(models.TranscriptEntry.confidence < 0.6).scalar()
    top_signs = db.query(models.TranscriptEntry.text, func.count(models.TranscriptEntry.id)) \
                  .group_by(models.TranscriptEntry.text) \
                  .order_by(func.count(models.TranscriptEntry.id).desc()).limit(10).all()
    return {
        "total_recognitions": total,
        "low_confidence_rate": (low_conf / total) if total else 0,
        "top_signs": [{"text": t, "count": c} for t, c in top_signs],
    }
@app.post("/vocabulary/personal/{sign_id}/arm")
def arm_recording_sign(sign_id: str, db: Session = Depends(get_db)):
    sign = db.query(models.PersonalSign).filter_by(id=sign_id).first()
    if not sign:
        raise HTTPException(404, "Sign not found")
    sign.recording_status = "armed"
    db.commit()
    return {"id": sign.id, "status": sign.recording_status}

_hub_status = {"connected": False}

@app.post("/hub/status")
def update_hub_status(payload: dict):
    _hub_status["connected"] = bool(payload.get("connected", False))
    return _hub_status

@app.get("/hub/status")
def get_hub_status():
    return _hub_status
