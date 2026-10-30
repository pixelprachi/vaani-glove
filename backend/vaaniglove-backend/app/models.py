import uuid, datetime
from sqlalchemy import (Column, String, Integer, Float, Boolean, ForeignKey,
                         DateTime, JSON, Text)
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from .database import Base

def uid():
    return str(uuid.uuid4())

# ---------- USER / DEVICE PROFILE STORE ----------
class User(Base):
    __tablename__ = "users"
    id = Column(UUID(as_uuid=False), primary_key=True, default=uid)
    email = Column(String, unique=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    display_name = Column(String, nullable=False)
    language = Column(String, default="en")
    role = Column(String, default="user")
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

class Device(Base):
    __tablename__ = "devices"
    id = Column(UUID(as_uuid=False), primary_key=True, default=uid)
    owner_id = Column(UUID(as_uuid=False), ForeignKey("users.id"), nullable=False)
    hub_ble_id = Column(String, unique=True, nullable=False)
    paired_at = Column(DateTime, default=datetime.datetime.utcnow)

class Calibration(Base):
    __tablename__ = "calibrations"
    id = Column(UUID(as_uuid=False), primary_key=True, default=uid)
    user_id = Column(UUID(as_uuid=False), ForeignKey("users.id"), nullable=False)
    hand = Column(String, nullable=False)
    fist_values = Column(JSON, nullable=False)
    open_values = Column(JSON, nullable=False)
    recorded_at = Column(DateTime, default=datetime.datetime.utcnow)

# ---------- OFFICIAL VOCABULARY STORE ----------
class OfficialSign(Base):
    __tablename__ = "official_signs"
    id = Column(Integer, primary_key=True)
    key = Column(String, unique=True, nullable=False)
    labels = Column(JSON, nullable=False)

# ---------- PERSONAL VOCABULARY STORE ----------
class PersonalSign(Base):
    __tablename__ = "personal_signs"
    id = Column(UUID(as_uuid=False), primary_key=True, default=uid)
    user_id = Column(UUID(as_uuid=False), ForeignKey("users.id"), nullable=False)
    text_meaning = Column(String, nullable=False)
    template_windows = Column(JSON, nullable=False)
    recording_status = Column(String, nullable=False, default="ready")
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

# ---------- INTERACTION / TRANSCRIPT LOG ----------
class TranscriptEntry(Base):
    __tablename__ = "transcript_entries"
    id = Column(UUID(as_uuid=False), primary_key=True, default=uid)
    user_id = Column(UUID(as_uuid=False), ForeignKey("users.id"), nullable=False)
    source = Column(String, nullable=False)
    text = Column(Text, nullable=False)
    confidence = Column(Float, nullable=False)
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)