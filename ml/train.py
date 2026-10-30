import numpy as np
import tensorflow as tf
from tensorflow.keras import layers, models

WINDOW_LEN = 50
CHANNELS = 22
NUM_CLASSES = 60

def build_model():
    inp = layers.Input(shape=(WINDOW_LEN, CHANNELS))
    x = layers.Conv1D(32, 5, activation="relu", padding="same")(inp)
    x = layers.MaxPooling1D(2)(x)
    x = layers.Conv1D(64, 5, activation="relu", padding="same")(x)
    x = layers.MaxPooling1D(2)(x)
    x = layers.Conv1D(64, 3, activation="relu", padding="same")(x)
    x = layers.GlobalAveragePooling1D()(x)
    x = layers.Dense(64, activation="relu")(x)
    x = layers.Dropout(0.3)(x)
    out = layers.Dense(NUM_CLASSES, activation="softmax")(x)
    model = models.Model(inp, out)
    model.compile(optimizer="adam", loss="sparse_categorical_crossentropy",
                  metrics=["accuracy"])
    return model

def load_dataset(path="dataset.npz"):
    data = np.load(path)
    return data["X"], data["y"]

if __name__ == "__main__":
    X, y = load_dataset()
    split = int(len(X) * 0.85)
    model = build_model()
    model.fit(X[:split], y[:split], validation_data=(X[split:], y[split:]),
              epochs=40, batch_size=32)
    model.save("official_model.keras")
    print("Saved official_model.keras")