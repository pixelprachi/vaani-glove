#include <string.h>
#include "recording.h"
#include "tts_speak.h"
#include "backend_sync.h"
#include "esp_log.h"

static const char *TAG = "recording";
static bool active = false;
static char pending_sign_id[64] = "";
static char pending_text[64] = "";

void recording_start(const char *sign_id, const char *text_meaning) {
    if (active) return;
    strncpy(pending_sign_id, sign_id, sizeof(pending_sign_id) - 1);
    strncpy(pending_text, text_meaning, sizeof(pending_text) - 1);
    active = true;
    ESP_LOGI(TAG, "Recording armed for sign '%s' (id=%s)", pending_text, pending_sign_id);
    backend_sync_mark_armed(pending_sign_id);
    tts_speak("Ready to record. Perform the sign now.");
}

bool recording_mode_active(void) {
    return active;
}

void recording_capture_window(float window[WINDOW_LEN][CHANNELS]) {
    ESP_LOGI(TAG, "Captured window for sign '%s'", pending_text);
    backend_sync_queue_complete_recording(pending_sign_id, window);
    active = false;
    tts_speak("Sign recorded");
}
