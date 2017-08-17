attribute vec3 Vertex;
attribute vec2 TexCoord0;

uniform mat4 uModelViewMatrix;
uniform mat4 uModelMatrix;
uniform mat4 uViewMatrix;
uniform mat4 uProjectionMatrix;


varying vec2 vTexCoord0;

void main(void) {

    vTexCoord0 = TexCoord0;
    
    vec4 pos = uModelMatrix*vec4(Vertex,1.0);
    
    vec3 planeCenter = vec3(0.0,0.0,-562.0);
    
    if(pos.z<planeCenter.z)
    {
     	vec3 v = vec3(0.0,0.0,-440.0)-pos.xyz;
     	vec3 vp = vec3(0.0,0.0,1.0);
     	
     	float t = dot((planeCenter-pos.xyz),vp)/dot(vp,v);
    	pos.xyz = t*v+pos.xyz;
    }
    
   
    
    gl_Position = uProjectionMatrix * uViewMatrix * pos;
}
