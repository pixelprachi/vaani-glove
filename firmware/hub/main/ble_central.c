#include "backend_sync.h"
#include "esp_log.h"
#include "host/ble_gap.h"
#include "host/ble_gatt.h"
#include "host/ble_hs.h"
#include "nimble/nimble_port.h"
#include "nimble/nimble_port_freertos.h"
#include "sensor_window.h"

#define GLOVE_LEFT_NAME "Vaani-Left"
#define GLOVE_RIGHT_NAME "Vaani-Right"
#define SENSOR_SVC_UUID BLE_UUID16_DECLARE(0xFEE0)
#define SENSOR_CHR_UUID BLE_UUID16_DECLARE(0xFEE1)
#define CCCD_UUID BLE_UUID16_DECLARE(0x2902)

static const char *TAG = "ble_central";

typedef struct {
  const char *name;
  hand_t hand;
  bool connected;
  uint16_t conn_handle;
  uint16_t chr_val_handle;
  uint16_t cccd_handle;
  uint8_t dsc_retry_count;
} peer_t;

static peer_t peers[2] = {
    {.name = GLOVE_LEFT_NAME, .hand = HAND_LEFT, .connected = false},
    {.name = GLOVE_RIGHT_NAME, .hand = HAND_RIGHT, .connected = false},
};

static int gap_event_handler(struct ble_gap_event *event, void *arg);

static peer_t *match_adv_name(struct ble_hs_adv_fields *fields) {
  if (fields->name == NULL)
    return NULL;
  for (int i = 0; i < 2; i++) {
    if (fields->name_len == strlen(peers[i].name) &&
        memcmp(fields->name, peers[i].name, fields->name_len) == 0) {
      return &peers[i];
    }
  }
  return NULL;
}

static void start_scan(void) {
  ESP_LOGI(TAG, "Starting BLE scan...");
  struct ble_gap_disc_params disc_params = {.passive = 0,
                                            .filter_duplicates = 0};
  int rc = ble_gap_disc(BLE_OWN_ADDR_PUBLIC, BLE_HS_FOREVER, &disc_params,
                        gap_event_handler, NULL);
  if (rc != 0) {
    ESP_LOGE(TAG, "ble_gap_disc failed, rc=%d", rc);
  }
}

static void handle_disc(struct ble_gap_event *event) {
  struct ble_hs_adv_fields fields;
  if (ble_hs_adv_parse_fields(&fields, event->disc.data,
                              event->disc.length_data) != 0)
    return;

  if (fields.name != NULL && fields.name_len > 0) {
    ESP_LOGI(TAG, "Adv seen: name='%.*s' rssi=%d", fields.name_len, fields.name,
             event->disc.rssi);
  } else {
    ESP_LOGI(TAG, "Adv seen: (no name) rssi=%d", event->disc.rssi);
  }

  peer_t *peer = match_adv_name(&fields);
  if (peer == NULL || peer->connected)
    return;

  ESP_LOGI(TAG, "Found %s, connecting...", peer->name);
  ble_gap_disc_cancel();
  ble_gap_connect(BLE_OWN_ADDR_PUBLIC, &event->disc.addr, 5000, NULL,
                  gap_event_handler, peer);
}

static int on_cccd_write(uint16_t conn_handle,
                         const struct ble_gatt_error *error,
                         struct ble_gatt_attr *attr, void *arg) {
  if (error->status == 0) {
    ESP_LOGI(TAG, "CCCD write OK (conn=%d, handle=%d)", conn_handle,
             attr->handle);
  } else {
    ESP_LOGE(TAG, "CCCD write FAILED, status=%d (conn=%d)", error->status,
             conn_handle);
  }
  return 0;
}

static int on_dsc_disc(uint16_t conn_handle, const struct ble_gatt_error *error,
                       uint16_t chr_val_handle, const struct ble_gatt_dsc *dsc,
                       void *arg) {
  peer_t *peer = (peer_t *)arg;
  if (error->status == 0 && dsc != NULL) {
    if (ble_uuid_cmp(&dsc->uuid.u, CCCD_UUID) == 0) {
      peer->cccd_handle = dsc->handle;
      ESP_LOGI(TAG, "Found CCCD handle=%d for %s", dsc->handle, peer->name);
    }
  } else if (error->status == BLE_HS_EDONE) {
    if (peer->cccd_handle != 0) {
      uint8_t cccd_val[2] = {0x01, 0x00};
      int rc = ble_gattc_write_flat(conn_handle, peer->cccd_handle, cccd_val,
                                    sizeof(cccd_val), on_cccd_write, peer);
      if (rc != 0) {
        ESP_LOGE(TAG, "ble_gattc_write_flat call failed immediately, rc=%d",
                 rc);
      }
    } else {
      ESP_LOGE(TAG, "No CCCD descriptor found for %s (val_handle=%d)",
               peer->name, peer->chr_val_handle);
    }
    peer->connected = true;
    ESP_LOGI(TAG, "%s ready", peer->name);
    ESP_LOGI(TAG, "Single-glove mode: not resuming scan");
    backend_sync_queue_connection_status(true);
  } else {
    // Transient failure (e.g. controller ran out of HCI buffers while
    // WiFi was also mid-init) -- previously this was silently dropped,
    // leaving the peer connected with no CCCD subscription forever.
    // Retry a few times instead of giving up on the first glitch.
    if (peer->dsc_retry_count < 3) {
      peer->dsc_retry_count++;
      ESP_LOGW(TAG, "Descriptor discovery error status=%d for %s, retry %d/3",
               error->status, peer->name, peer->dsc_retry_count);
      int rc = ble_gattc_disc_all_dscs(conn_handle, peer->chr_val_handle + 1,
                                       0xffff, on_dsc_disc, peer);
      if (rc != 0) {
        ESP_LOGE(TAG, "Retry of ble_gattc_disc_all_dscs failed, rc=%d", rc);
      }
    } else {
      ESP_LOGE(TAG,
               "Descriptor discovery failed for %s after 3 retries, giving up",
               peer->name);
      peer->connected = true;
      backend_sync_queue_connection_status(true);
    }
  }
  return 0;
}

static int on_chr_disc(uint16_t conn_handle, const struct ble_gatt_error *error,
                       const struct ble_gatt_chr *chr, void *arg) {
  peer_t *peer = (peer_t *)arg;
  if (error->status == 0 && chr != NULL) {
    peer->chr_val_handle = chr->val_handle;
    ESP_LOGI(TAG, "Discovered characteristic val_handle=%d for %s",
             chr->val_handle, peer->name);
  } else if (error->status == BLE_HS_EDONE) {
    ESP_LOGI(TAG, "Characteristic discovery done for %s, discovering CCCD...",
             peer->name);
    int rc = ble_gattc_disc_all_dscs(conn_handle, peer->chr_val_handle + 1,
                                     0xffff, on_dsc_disc, peer);
    if (rc != 0) {
      ESP_LOGE(TAG, "ble_gattc_disc_all_dscs failed, rc=%d", rc);
    }
  }
  return 0;
}

static void unpack_sensor_packet(const uint8_t *raw, float out[11]) {
    uint16_t flex[5];
    memcpy(flex, raw, sizeof(flex));
    for (int i = 0; i < 5; i++) out[i] = (float)flex[i];
    // Glove only sends 20 bytes (5 flex sensor readings) -- there is no IMU
    // data in this packet. The old code reinterpreted unrelated/padding bytes
    // as 6 "IMU floats", injecting effectively random noise into every DTW
    // distance calculation, which is very likely why personal_conf never
    // rose above 0. Zeroing these until the glove firmware actually sends IMU data.
    for (int i = 5; i < 11; i++) out[i] = 0.0f;
}

static int handle_notify(struct ble_gap_event *event) {
  // Logging every single notification (20-40+/sec) was adding formatted
  // UART output inside the BLE host task on every packet -- real CPU/time
  // pressure that competes with the WiFi/BLE coexistence scheduler on the
  // shared radio. Suspected cause of the WiFi AP disconnects (reason 205)
  // seen during heavy notify traffic. Removed; data path below is unaffected.
  for (int i = 0; i < 2; i++) {
    if (peers[i].connected &&
        event->notify_rx.conn_handle == peers[i].conn_handle) {
      uint8_t raw[34] = {0};
      uint16_t len = OS_MBUF_PKTLEN(event->notify_rx.om);
      static bool logged_once = false;
      if (!logged_once) {
        ESP_LOGI(TAG, "First notify packet len=%d bytes (expected 34)", len);
        logged_once = true;
      }
      os_mbuf_copydata(event->notify_rx.om, 0, len, raw);
      float hand_values[11];
      unpack_sensor_packet(raw, hand_values);
      sensor_window_push(peers[i].hand, hand_values);
    }
  }
  return 0;
}

static int gap_event_handler(struct ble_gap_event *event, void *arg) {
  switch (event->type) {
  case BLE_GAP_EVENT_DISC:
    handle_disc(event);
    return 0;
  case BLE_GAP_EVENT_CONNECT: {
    peer_t *peer = (peer_t *)arg;
    if (event->connect.status == 0) {
      ESP_LOGI(TAG, "Connected to %s", peer->name);
      peer->conn_handle = event->connect.conn_handle;
      // Mark connected immediately (not just once GATT/CCCD discovery
      // finishes ~1-1.5s later). Otherwise a stray advertising report
      // that slips through before ble_gap_disc_cancel() fully takes
      // effect at the radio level can still match this peer while
      // peer->connected is still false, triggering a second
      // ble_gap_connect() on the same peer mid-setup and corrupting
      // NimBLE's connection state (Guru Meditation in
      // ble_hs_hci_evt_le_meta).
      peer->connected = true;
      ble_gattc_disc_chrs_by_uuid(peer->conn_handle, 0x0001, 0xffff,
                                  SENSOR_CHR_UUID, on_chr_disc, peer);
    } else {
      ESP_LOGE(TAG, "Connect failed to %s, status=%d", peer->name,
               event->connect.status);
      start_scan();
    }
    return 0;
  }
  case BLE_GAP_EVENT_DISCONNECT:
    ESP_LOGI(TAG, "Disconnected, reason=%d", event->disconnect.reason);
    for (int i = 0; i < 2; i++) {
      if (peers[i].conn_handle == event->disconnect.conn.conn_handle) {
        peers[i].connected = false;
        peers[i].cccd_handle = 0;
      }
    }
    backend_sync_queue_connection_status(false);
    start_scan();
    return 0;
  case BLE_GAP_EVENT_NOTIFY_RX:
    return handle_notify(event);
  default:
    return 0;
  }
}

static void on_sync(void) {
  ESP_LOGI(TAG, "NimBLE host synced, starting scan");
  start_scan();
}

static void host_task(void *param) {
  nimble_port_run();
  nimble_port_freertos_deinit();
}

void ble_central_start(void) {
  ble_hs_cfg.sync_cb = on_sync;
  nimble_port_freertos_init(host_task);
}