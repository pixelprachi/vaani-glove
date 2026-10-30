#ifndef DTW_MATCH_H
#define DTW_MATCH_H

#include <stdbool.h>
#include "sensor_window.h"

#define MAX_PERSONAL_SIGNS 30
#define MAX_TEMPLATES_PER_SIGN 3

typedef struct {
    char text[64];
    int template_count;
    float templates[MAX_TEMPLATES_PER_SIGN][WINDOW_LEN][CHANNELS];
} personal_sign_t;

void dtw_match_init(void);
bool active_profile_loaded(void);
void dtw_match_load_signs(personal_sign_t *signs, int count);
void dtw_match_personal(float window[WINDOW_LEN][CHANNELS], char *out_text, float *out_conf);

#endif