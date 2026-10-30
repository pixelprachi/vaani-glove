#ifndef OFFICIAL_MODEL_H
#define OFFICIAL_MODEL_H

#include "sensor_window.h"

#ifdef __cplusplus
extern "C" {
#endif

void official_model_init(void);
void run_official_model(float window[WINDOW_LEN][CHANNELS], int *out_class, float *out_conf);

#ifdef __cplusplus
}
#endif

#endif