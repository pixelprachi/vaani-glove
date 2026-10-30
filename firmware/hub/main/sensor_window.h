#ifndef SENSOR_WINDOW_H
#define SENSOR_WINDOW_H

#define WINDOW_LEN 50
#define CHANNELS   22

typedef enum { HAND_LEFT, HAND_RIGHT } hand_t;

void sensor_window_init(void);
void sensor_window_push(hand_t hand, const float hand_values[11]);

#endif