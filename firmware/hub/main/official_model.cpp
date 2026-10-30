#include "tensorflow/lite/micro/micro_interpreter.h"
#include "tensorflow/lite/micro/micro_mutable_op_resolver.h"
#include "tensorflow/lite/schema/schema_generated.h"
#include "official_model_data.h"
#include "official_model.h"

#include "esp_heap_caps.h"

#define TENSOR_ARENA_SIZE (60 * 1024)
static uint8_t *tensor_arena = NULL;
static tflite::MicroInterpreter *interpreter;
static TfLiteTensor *input_tensor;
static TfLiteTensor *output_tensor;

void official_model_init(void) {
    if (tensor_arena == NULL) {
        tensor_arena = (uint8_t *)heap_caps_malloc(TENSOR_ARENA_SIZE, MALLOC_CAP_SPIRAM);
    }
    const tflite::Model *model = tflite::GetModel(official_model_data);

    static tflite::MicroMutableOpResolver<8> resolver;
    resolver.AddConv2D(); resolver.AddMaxPool2D(); resolver.AddFullyConnected();
    resolver.AddSoftmax(); resolver.AddMean(); resolver.AddRelu();
    resolver.AddExpandDims(); resolver.AddReshape();

    static tflite::MicroInterpreter static_interpreter(
        model, resolver, tensor_arena, TENSOR_ARENA_SIZE);
    interpreter = &static_interpreter;
    interpreter->AllocateTensors();
    input_tensor = interpreter->input(0);
    output_tensor = interpreter->output(0);
}

void run_official_model(float window[WINDOW_LEN][CHANNELS], int *out_class, float *out_conf) {
    memcpy(input_tensor->data.f, window, sizeof(float) * WINDOW_LEN * CHANNELS);
    interpreter->Invoke();

    int best_idx = 0;
    float best_val = output_tensor->data.f[0];
    for (int i = 1; i < 60; i++) {
        if (output_tensor->data.f[i] > best_val) {
            best_val = output_tensor->data.f[i];
            best_idx = i;
        }
    }
    *out_class = best_idx;
    *out_conf = best_val;
}