#ifndef RECORDING_H
#define RECORDING_H

#include "sensor_window.h"
#include <stdbool.h>

void recording_start(const char *sign_id, const char *text_meaning);
bool recording_mode_active(void);
void recording_capture_window(float window[WINDOW_LEN][CHANNELS]);

#endif
