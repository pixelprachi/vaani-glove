import tensorflow as tf
model = tf.keras.models.load_model("official_model.keras")
converter = tf.lite.TFLiteConverter.from_keras_model(model)
tflite_model = converter.convert()
with open("official_model.tflite", "wb") as f:
    f.write(tflite_model)
print("Wrote official_model.tflite:", len(tflite_model), "bytes")