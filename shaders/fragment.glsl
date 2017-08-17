
uniform sampler2D uTexture;
varying vec2 vTexCoord0;
#pragma include "colorSpace.glsl"

void main() {
    vec4 color = texture2D(uTexture,vTexCoord0);
    gl_FragColor = color;
}
