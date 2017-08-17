attribute vec3 Vertex;
attribute vec2 TexCoord0;


varying vec2 vTexCoord0;



void main(void) {

    vTexCoord0 = TexCoord0;
    gl_Position = vec4(Vertex,1.0);
}
