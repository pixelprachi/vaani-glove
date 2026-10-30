#include <stddef.h>
#include "sensor_window.h"
#include "freertos/FreeRTOS.h"
#include "freertos/task.h"
#include "nvs_flash.h"
#include "esp_spiffs.h"
#include "esp_log.h"
#include "esp_heap_caps.h"
#include "recognition.h"
#include "tts_speak.h"
#include "dtw_match.h"
#include "settings.h"
#include "backend_sync.h"
#include "official_model.h"

extern void ble_central_start(void);
extern void wifi_init_sta(void);
extern void nimble_port_init(void);

static const char *TAG = "vaaniglove_hub";

static void mount_espeak_data(void) {
    esp_vfs_spiffs_conf_t conf = {
        .base_path = "/espeak-ng-data",
        .partition_label = "espeak",
        .max_files = 5,
        .format_if_mount_failed = false
    };
    esp_err_t ret = esp_vfs_spiffs_register(&conf);
    if (ret != ESP_OK) {
        ESP_LOGE(TAG, "Failed to mount espeak-ng data partition (%s)", esp_err_to_name(ret));
    } else {
        ESP_LOGI(TAG, "espeak-ng data partition mounted at /espeak-data");
    }
}

void app_main(void) {
    nvs_flash_init();
    backend_sync_init();
    sensor_window_init();
    set_current_user_id("faabdba2-035e-4a11-a8ba-8e05c572ac29");
    nimble_port_init();
    ESP_LOGI(TAG, "Free internal heap after BLE init: %lu bytes (largest block %lu bytes)",
             (unsigned long)heap_caps_get_free_size(MALLOC_CAP_INTERNAL),
             (unsigned long)heap_caps_get_largest_free_block(MALLOC_CAP_INTERNAL));

    ble_central_start();

    wifi_init_sta();
    official_model_init();
    mount_espeak_data();
    tts_init();
    dtw_match_init();

    ESP_LOGI(TAG, "Free internal heap before sync task: %lu bytes (largest block %lu bytes)",
             (unsigned long)heap_caps_get_free_size(MALLOC_CAP_INTERNAL),
             (unsigned long)heap_caps_get_largest_free_block(MALLOC_CAP_INTERNAL));

    static StaticTask_t backend_sync_tcb;
    StackType_t *backend_sync_stack = (StackType_t *)heap_caps_malloc(6144, MALLOC_CAP_SPIRAM);
    TaskHandle_t backend_sync_handle = NULL;
    if (backend_sync_stack != NULL) {
        backend_sync_handle = xTaskCreateStatic(backend_sync_task, "sync",
            6144 / sizeof(StackType_t), NULL, 5, backend_sync_stack, &backend_sync_tcb);
    }
    if (backend_sync_handle == NULL) {
        ESP_LOGE(TAG, "FATAL: backend_sync_task creation failed!");
    } else {
        ESP_LOGI(TAG, "backend_sync_task created successfully (stack in PSRAM)");
    }
}
