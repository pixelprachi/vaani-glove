#include <string.h>
#include "settings.h"
#include "official_signs_cache.h"

static char current_language[8] = "en";
static char current_user_id_buf[64] = "";

const char *active_language(void) { return current_language; }

void set_active_language(const char *lang) {
    strncpy(current_language, lang, sizeof(current_language) - 1);
}

const char *official_label_for(int class_id, const char *language) {
    return official_signs_cache_lookup(class_id, language);
}

const char *current_user_id(void) { return current_user_id_buf; }

void set_current_user_id(const char *id) {
    strncpy(current_user_id_buf, id, sizeof(current_user_id_buf) - 1);
}