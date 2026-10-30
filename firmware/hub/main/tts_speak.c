#include "driver/i2s_std.h"
#include "esp_log.h"
#include "espeak-ng/speak_lib.h"
#include "freertos/FreeRTOS.h"
#include "freertos/queue.h"
#include "freertos/task.h"
#include "settings.h"
#include <string.h>

#define I2S_LRC_GPIO  5
#define I2S_BCLK_GPIO 6
#define I2S_DOUT_GPIO 7

static i2s_chan_handle_t tx_chan;
static const char *TAG = "tts_speak";

#define TTS_TEXT_MAX 128
#define TTS_TASK_STACK_SIZE 24576
#define TTS_QUEUE_DEPTH 8

typedef struct {
  char text[TTS_TEXT_MAX];
} tts_msg_t;

static QueueHandle_t tts_queue;

static int synth_callback(short *wav, int numsamples, espeak_EVENT *events) {
  if (wav == NULL || numsamples <= 0) {
    return 0;
  }
  size_t bytes_written = 0;
  esp_err_t err = i2s_channel_write(tx_chan, wav, numsamples * sizeof(short),
                                     &bytes_written, pdMS_TO_TICKS(500));
  if (err != ESP_OK) {
    ESP_LOGW(TAG, "i2s_channel_write failed: %s (wrote %u/%u bytes)",
             esp_err_to_name(err), (unsigned)bytes_written,
             (unsigned)(numsamples * sizeof(short)));
  }
  return 0;
}

static void tts_task(void *arg) {
  static tts_msg_t msg;
  while (1) {
    if (xQueueReceive(tts_queue, &msg, portMAX_DELAY) == pdTRUE) {
      ESP_LOGI(TAG, "tts_task: dequeued '%s'", msg.text);
      espeak_SetVoiceByName(active_language());
      espeak_Synth(msg.text, strlen(msg.text) + 1, 0, POS_CHARACTER, 0,
                   espeakCHARS_UTF8, NULL, NULL);
      ESP_LOGI(
          TAG, "tts_task stack headroom: %u bytes",
          (unsigned)(uxTaskGetStackHighWaterMark(NULL) * sizeof(StackType_t)));
    }
  }
}

void tts_init(void) {
  int sample_rate = espeak_Initialize(AUDIO_OUTPUT_RETRIEVAL, 0, NULL, 0);
  espeak_SetVoiceByName(active_language());
  espeak_SetSynthCallback(synth_callback);

  i2s_chan_config_t chan_cfg =
      I2S_CHANNEL_DEFAULT_CONFIG(I2S_NUM_0, I2S_ROLE_MASTER);
  esp_err_t err = i2s_new_channel(&chan_cfg, &tx_chan, NULL);
  ESP_LOGI(TAG, "i2s_new_channel: %s", esp_err_to_name(err));

  i2s_std_config_t std_cfg = {
      .clk_cfg = I2S_STD_CLK_DEFAULT_CONFIG(sample_rate),
      .slot_cfg = I2S_STD_PHILIPS_SLOT_DEFAULT_CONFIG(I2S_DATA_BIT_WIDTH_16BIT,
                                                       I2S_SLOT_MODE_MONO),
      .gpio_cfg = {
          .mclk = I2S_GPIO_UNUSED,
          .bclk = I2S_BCLK_GPIO,
          .ws = I2S_LRC_GPIO,
          .dout = I2S_DOUT_GPIO,
          .din = I2S_GPIO_UNUSED,
          .invert_flags = { .mclk_inv = false, .bclk_inv = false, .ws_inv = false },
      },
  };
  std_cfg.slot_cfg.slot_mask = I2S_STD_SLOT_BOTH;

  err = i2s_channel_init_std_mode(tx_chan, &std_cfg);
  ESP_LOGI(TAG, "i2s_channel_init_std_mode: %s", esp_err_to_name(err));

  err = i2s_channel_enable(tx_chan);
  ESP_LOGI(TAG, "i2s_channel_enable: %s", esp_err_to_name(err));

  ESP_LOGI(TAG, "I2S speaker init done, sample_rate=%d", sample_rate);

  tts_queue = xQueueCreate(TTS_QUEUE_DEPTH, sizeof(tts_msg_t));

  // This task calls into espeak-ng, which reads voice files from SPIFFS on
  // flash -- flash reads briefly disable the cache, and ESP-IDF requires the
  // calling task's stack to be in internal RAM during that window (a PSRAM
  // stack becomes unreachable and crashes). So: plain internal-RAM task,
  // created right after BLE (in app_main) before WiFi eats the internal heap.
  BaseType_t ok = xTaskCreate(tts_task, "tts", TTS_TASK_STACK_SIZE, NULL, 5, NULL);
  if (ok != pdPASS) {
    ESP_LOGE(TAG, "FAILED to create tts_task (internal heap too low) -- speech will never play!");
  } else {
    ESP_LOGI(TAG, "tts_task created successfully (internal RAM stack)");
  }
}

void tts_speak(const char *text) {
  if (tts_queue == NULL) {
    ESP_LOGW(TAG, "tts_speak called before tts_init, dropping: %s", text);
    return;
  }
  tts_msg_t msg;
  strncpy(msg.text, text, sizeof(msg.text) - 1);
  msg.text[sizeof(msg.text) - 1] = '\0';
  if (xQueueSend(tts_queue, &msg, 0) != pdTRUE) {
    ESP_LOGW(TAG, "tts_queue full, dropping utterance: %s", text);
  }
}
