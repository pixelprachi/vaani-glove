#ifndef SETTINGS_H
#define SETTINGS_H

const char *active_language(void);
void set_active_language(const char *lang);
const char *official_label_for(int class_id, const char *language);
const char *current_user_id(void);
void set_current_user_id(const char *id);

#endif