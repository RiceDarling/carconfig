
attribute vec3 Vertex;
attribute vec3 Normal;
attribute vec2 TexCoord0;
attribute vec4 Tangent;

uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;
uniform mat3 uModelViewNormalMatrix;
uniform mat4 uViewMatrix;
varying vec3 vViewVertex;
varying vec3 vViewNormal;
varying vec3 vViewTangent;
varying vec2 vTexCoord0;
varying vec4 vPrjVertex;
varying vec3 vLight;

void main(void) {

    vViewVertex = vec3(uModelViewMatrix * vec4(Vertex, 1.0));
    vLight = vec3(uViewMatrix*vec4(0.0,0.0,1.0,0.0));
    vViewNormal = uModelViewNormalMatrix * Normal;
    vViewTangent = (uModelViewMatrix * vec4(Tangent.xyz,0.0)).xyz;
    vTexCoord0 = TexCoord0;

    
    vPrjVertex = uProjectionMatrix * uModelViewMatrix * vec4(Vertex,1.0);
    gl_Position = vPrjVertex;
}
