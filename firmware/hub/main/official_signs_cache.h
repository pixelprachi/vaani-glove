#ifndef OFFICIAL_SIGNS_CACHE_H
#define OFFICIAL_SIGNS_CACHE_H

// Placeholder table — replace with your real 60 signs in Part 13.6.
// Add one row per sign, in the same order as your model's output classes.
typedef struct {
    int id;
    const char *en;
    const char *hi;
} official_sign_row_t;

static const official_sign_row_t OFFICIAL_SIGNS_TABLE[] = {
    { 0, "Hello", "Namaste" },
    { 1, "Thank you", "Dhanyavaad" },
    // ... add the rest of your 60 signs here in Part 13.6
};
#define OFFICIAL_SIGNS_TABLE_COUNT (sizeof(OFFICIAL_SIGNS_TABLE) / sizeof(OFFICIAL_SIGNS_TABLE[0]))

static inline const char *official_signs_cache_lookup(int class_id, const char *language) {
    for (unsigned i = 0; i < OFFICIAL_SIGNS_TABLE_COUNT; i++) {
        if (OFFICIAL_SIGNS_TABLE[i].id == class_id) {
            if (language && language[0] == 'h') return OFFICIAL_SIGNS_TABLE[i].hi;
            return OFFICIAL_SIGNS_TABLE[i].en;
        }
    }
    return "unknown";
}

#endif