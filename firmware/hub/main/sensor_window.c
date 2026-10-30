#include <string.h>
#include <stdbool.h>
#include "esp_log.h"
#include "esp_heap_caps.h"
#include "freertos/FreeRTOS.h"
#include "freertos/task.h"
#include "freertos/queue.h"
#include "sensor_window.h"
#include "recognition.h"
#include "recording.h"

// Flip to 1 once the left glove exists and is reporting data — a window
// will then only complete once both hands report for that row, as
// originally designed. While 0, the window advances on right-hand data
// alone (left channels stay zero-filled), so recognition/recording can be
// built and tested with only the right glove.
#define REQUIRE_BOTH_HANDS 0

// recognition_run() / recording_capture_window() both call tts_speak(),
// which pulls in a very deep SPIFFS/flash/IPC call chain. sensor_window_push()
// runs directly on the NimBLE host task (called from the BLE notify
// callback), and that chain repeatedly overflowed its stack even after
// bumping CONFIG_BT_NIMBLE_TASK_STACK_SIZE -- it's simply too deep to share
// a stack with BLE's own processing. It also meant the hub couldn't process
// any BLE events while speaking. So a completed window is now handed off
// through a queue to a dedicated task with its own generously-sized stack,
// instead of being processed inline here.
typedef struct {
    float window[WINDOW_LEN][CHANNELS];
    bool recording_mode;
} window_ready_msg_t;

#define WINDOW_PROCESSING_TASK_STACK_SIZE 8192

static const char *WTAG = "sensor_window";

static float window_buf[WINDOW_LEN][CHANNELS];
static int write_pos = 0;
static bool left_seen = false, right_seen = false;

static QueueHandle_t window_ready_queue;

// This task's own stack lives in PSRAM (see sensor_window_init below).
// That's only safe because this task never does a raw flash read with
// caches disabled (recording_capture_window()/recognition_run() only do
// queue-sends and pure DTW/model math now that TTS moved to its own task) --
// unlike tts_speak.c's task, which touches SPIFFS/flash directly and must
// stay on an internal-RAM stack.
static void window_processing_task(void *arg) {
    static window_ready_msg_t msg;
    while (1) {
        if (xQueueReceive(window_ready_queue, &msg, portMAX_DELAY) == pdTRUE) {
            if (msg.recording_mode) {
                recording_capture_window(msg.window);
            } else {
                recognition_run(msg.window);
            }
        }
    }
}

// TCB must be internal RAM (it's tiny, a few hundred bytes -- fine as a
// static). The stack buffer itself is the big one (8KB) and goes to PSRAM,
// which is why this uses xTaskCreateStatic instead of plain xTaskCreate.
static StaticTask_t window_task_tcb;

void sensor_window_init(void) {
    window_ready_queue = xQueueCreate(1, sizeof(window_ready_msg_t));

    StackType_t *stack_mem = (StackType_t *)heap_caps_malloc(
        WINDOW_PROCESSING_TASK_STACK_SIZE, MALLOC_CAP_SPIRAM);
    if (stack_mem == NULL) {
        ESP_LOGE(WTAG, "Failed to allocate window_proc stack in PSRAM, falling back to internal RAM");
        xTaskCreate(window_processing_task, "window_proc", WINDOW_PROCESSING_TASK_STACK_SIZE, NULL, 5, NULL);
        return;
    }
    TaskHandle_t handle = xTaskCreateStatic(
        window_processing_task, "window_proc",
        WINDOW_PROCESSING_TASK_STACK_SIZE / sizeof(StackType_t),
        NULL, 5, stack_mem, &window_task_tcb);
    if (handle == NULL) {
        ESP_LOGE(WTAG, "xTaskCreateStatic for window_proc failed");
    }
}

static void run_window(void) {
    write_pos = (write_pos + 1) % WINDOW_LEN;
    left_seen = right_seen = false;
    if (write_pos == 0) {
        static window_ready_msg_t out;
        memcpy(out.window, window_buf, sizeof(out.window));
        out.recording_mode = recording_mode_active();
        if (xQueueSend(window_ready_queue, &out, 0) != pdTRUE) {
            ESP_LOGW(WTAG, "window_ready_queue full, dropping a completed window");
        }
    }
}

void sensor_window_push(hand_t hand, const float hand_values[11]) {
    int offset = (hand == HAND_LEFT) ? 0 : 11;
    memcpy(&window_buf[write_pos][offset], hand_values, 11 * sizeof(float));
    if (hand == HAND_LEFT) left_seen = true; else right_seen = true;

    if (recording_mode_active()) {
        ESP_LOGI(WTAG, "push hand=%d write_pos=%d", hand, write_pos);
    }

#if REQUIRE_BOTH_HANDS
    if (left_seen && right_seen) {
        run_window();
    }
#else
    if (right_seen) {
        run_window();
    }
#endif
}