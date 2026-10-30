file(GLOB ESPEAK_CORE_SRCS "${CMAKE_CURRENT_SOURCE_DIR}/src/libespeak-ng/*.c")
file(GLOB UCD_SRCS "${CMAKE_CURRENT_SOURCE_DIR}/src/ucd-tools/src/*.c")

list(REMOVE_ITEM ESPEAK_CORE_SRCS
    "${CMAKE_CURRENT_SOURCE_DIR}/src/libespeak-ng/compilembrola.c"
    "${CMAKE_CURRENT_SOURCE_DIR}/src/libespeak-ng/mbrowrap.c"
    "${CMAKE_CURRENT_SOURCE_DIR}/src/libespeak-ng/sPlayer.c"
)

idf_component_register(
    SRCS ${ESPEAK_CORE_SRCS} ${UCD_SRCS}
    INCLUDE_DIRS
        "src/include"
        "src/include/espeak-ng"
        "android/jni/include"
        "src/ucd-tools/src/include"
    PRIV_INCLUDE_DIRS "src/libespeak-ng"
)

target_compile_options(${COMPONENT_LIB} PRIVATE
    -Wno-error=char-subscripts
    -Wno-error=format-truncation
    -Wno-error=format-overflow
    -Wno-error=maybe-uninitialized
)