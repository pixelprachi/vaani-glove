#include "recognition.h"
#include "backend_sync.h"
#include "dtw_match.h"
#include "esp_log.h"
#include "official_model.h"
#include "settings.h"
#include "tts_speak.h"
#include <string.h>

#define OFFICIAL_CONFIDENCE_THRESHOLD 0.70f

static const char *TAG = "recognition";

void recognition_run(float window[WINDOW_LEN][CHANNELS]) {
  float official_conf = 0;
  int official_class = -1;
  run_official_model(window, &official_class, &official_conf);

  char personal_text[64] = {0};
  float personal_conf = 0;
  if (active_profile_loaded()) {
    dtw_match_personal(window, personal_text, &personal_conf);
  }

  ESP_LOGI(TAG,
           "profile_loaded=%d official_conf=%.3f personal_conf=%.3f "
           "personal_text='%s'",
           active_profile_loaded(), official_conf, personal_conf,
           personal_text);

  bool have_official = (official_class >= 0 &&
                      official_conf >= OFFICIAL_CONFIDENCE_THRESHOLD);
  bool have_personal = personal_text[0] != '\0';

  if (!have_official && !have_personal) {
    ESP_LOGI(TAG, "No match above threshold");
    return;
  }

  const char *text;
  float conf;
  const char *source;
  if (have_official && (!have_personal || official_conf >= personal_conf)) {
    text = official_label_for(official_class, active_language());
    conf = official_conf;
    source = "official";
  } else {
    text = personal_text;
    conf = personal_conf;
    source = "personal";
  }

  ESP_LOGI(TAG,
  "profile_loaded=%d official_conf=%.3f personal_conf=%.3f "
  "personal_text='%s'",
  active_profile_loaded(), official_conf, personal_conf,
           personal_text);  tts_speak(text);
  backend_sync_queue_transcript(source, text, conf);
}