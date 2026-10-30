#include "esp_heap_caps.h"
#include <math.h>
#include <string.h>
#include "dtw_match.h"

#define PERSONAL_DISTANCE_SCALE 60.0f
#define PERSONAL_CONFIDENCE_THRESHOLD 0.10f

static personal_sign_t *personal_signs = NULL;
static int personal_sign_count = 0;
static bool profile_loaded = false;

bool active_profile_loaded(void) { return profile_loaded; }

void dtw_match_load_signs(personal_sign_t *signs, int count) {
    memcpy(personal_signs, signs, sizeof(personal_sign_t) * count);
    personal_sign_count = count;
    profile_loaded = count > 0;
}

void dtw_match_init(void) {
    if (personal_signs == NULL) {
        personal_signs = heap_caps_malloc(sizeof(personal_sign_t) * MAX_PERSONAL_SIGNS, MALLOC_CAP_SPIRAM);
    }
    profile_loaded = false;
}

static float dtw_distance(float a[WINDOW_LEN][CHANNELS], float b[WINDOW_LEN][CHANNELS]) {
    static float cost[WINDOW_LEN + 1][WINDOW_LEN + 1];
    for (int i = 0; i <= WINDOW_LEN; i++)
        for (int j = 0; j <= WINDOW_LEN; j++)
            cost[i][j] = INFINITY;
    cost[0][0] = 0.0f;

    for (int i = 1; i <= WINDOW_LEN; i++) {
        for (int j = 1; j <= WINDOW_LEN; j++) {
            float d = 0;
            for (int c = 0; c < CHANNELS; c++) {
                float diff = a[i - 1][c] - b[j - 1][c];
                d += diff * diff;
            }
            d = sqrtf(d);
            float best_prev = fminf(cost[i - 1][j], fminf(cost[i][j - 1], cost[i - 1][j - 1]));
            cost[i][j] = d + best_prev;
        }
    }
    return cost[WINDOW_LEN][WINDOW_LEN] / (2.0f * WINDOW_LEN);
}

void dtw_match_personal(float window[WINDOW_LEN][CHANNELS], char *out_text, float *out_conf) {
    float best_dist = INFINITY; const char *best_text = NULL;
    for (int i = 0; i < personal_sign_count; i++) {
        for (int t = 0; t < personal_signs[i].template_count; t++) {
            float dist = dtw_distance(window, personal_signs[i].templates[t]);
            if (dist < best_dist) { best_dist = dist; best_text = personal_signs[i].text; }
        }
    }
    float conf = best_text ? fmaxf(0.0f, 1.0f - (best_dist / PERSONAL_DISTANCE_SCALE)) : 0.0f;
    if (best_text != NULL && conf >= PERSONAL_CONFIDENCE_THRESHOLD) {
        strncpy(out_text, best_text, 63);
        *out_conf = conf;
    } else {
        out_text[0] = '\0';
        *out_conf = conf;
    }
}