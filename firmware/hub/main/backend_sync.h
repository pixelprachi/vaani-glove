#ifndef BACKEND_SYNC_H
#define BACKEND_SYNC_H

#include "sensor_window.h"
#include <stdbool.h>

void backend_sync_init(void);
void backend_sync_queue_transcript(const char *source, const char *text,
                                   float conf);
void backend_sync_mark_armed(const char *sign_id);
void backend_sync_queue_complete_recording(const char *sign_id,
                                           float window[WINDOW_LEN][CHANNELS]);
void backend_sync_queue_connection_status(bool connected);
void backend_sync_task(void *arg);

#endif