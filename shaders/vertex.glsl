attribute vec3 Vertex;
attribute vec2 TexCoord0;

uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;


varying vec2 vTexCoord0;



void main(void) {

    vTexCoord0 = TexCoord0;
    gl_Position = uProjectionMatrix * uModelViewMatrix * vec4(Vertex,1.0);
}
