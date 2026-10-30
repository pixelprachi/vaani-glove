idf_component_register(
    SRCS
        "vaaniglove_hub.c"
        "ble_central.c"
        "sensor_window.c"
        "recording.c"
        "recognition.c"
        "official_model.cpp"
        "dtw_match.c"
        "settings.c"
        "tts_speak.c"
        "backend_sync.c"
        "wifi_init.c"
    INCLUDE_DIRS "."
    REQUIRES espeak-ng bt esp_wifi esp_http_client driver nvs_flash esp_event esp-tflite-micro json spiffs
)