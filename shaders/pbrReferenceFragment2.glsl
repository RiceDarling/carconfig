#define PI 3.1415926535897932384626433832795
#define PI_2 (2.0*3.1415926535897932384626433832795)
#define INV_PI 1.0/PI
#define INV_LOG2 1.4426950408889634073599246810019

uniform mat4 uEnvironmentTransform;

#ifdef CUBEMAP_LOD
uniform samplerCube uEnvironmentCube;
#extension GL_EXT_shader_texture_lod : enable
#endif

#ifdef PANORAMA
uniform sampler2D uEnvironment;
#endif

uniform vec2 uEnvironmentSize;
uniform vec2 uEnvironmentLodRange;
uniform float uLod;

uniform float uBrightness;

uniform sampler2D uIntegrateBRDF; // ue4

uniform vec3 uEnvironmentSphericalHarmonics[9];

varying vec3 vViewVertex;
varying vec3 vViewNormal;
varying vec2 vTexCoord0;
varying vec3 vViewTangent;
varying vec4 vPrjVertex;
varying vec3 vLight;

mat3 environmentTransform;

uniform sampler2D albedoMap;
uniform sampler2D metallicRoughnessMap;
uniform sampler2D normalMap;
uniform sampler2D specularMap;
uniform sampler2D aoMap;
uniform sampler2D diffuseMap;
uniform int uNormalAA;
uniform int uSpecularPeak;
uniform int uOcclusionHorizon;

#pragma include "sphericalHarmonics.glsl"
#pragma include "colorSpace.glsl"


// From Sebastien Lagarde Moving Frostbite to PBR page 69
// We have a better approximation of the off specular peak
// but due to the other approximations we found this one performs better.
// N is the normal direction
// R is the mirror vector
// This approximation works fine for G smith correlated and uncorrelated
vec3 getSpecularDominantDir(const in vec3 N, const in vec3 R, const in float realRoughness)
{
    vec3 dominant;
    if ( uSpecularPeak == 1 ) {
        float smoothness = 1.0 - realRoughness;
        float lerpFactor = smoothness * (sqrt(smoothness) + realRoughness);
        // The result is not normalized as we fetch in a cubemap
        dominant = mix(N, R, lerpFactor);
    } else {
        dominant = R;
    }
    return dominant;
}


float occlusionHorizon( const in vec3 R, const in vec3 normal)
{
    if ( uOcclusionHorizon == 0)
        return 1.0;

    // http://marmosetco.tumblr.com/post/81245981087
    // marmoset uses 1.3, we force it to 1.0
    float factor = clamp( 1.0 + dot(R, normal), 0.0, 1.0 );
    return factor * factor;
}


vec3 evaluateDiffuseSphericalHarmonics( const in vec3 N,
                                        const in vec3 V ) {
    return sphericalHarmonics( uEnvironmentSphericalHarmonics, environmentTransform * N );
}


#ifdef CUBEMAP_LOD
#pragma include "cubemapSampler.glsl"
#endif


#ifdef PANORAMA
#pragma include "panoramaSampler.glsl"
#endif

#pragma include "pbr_ue4.glsl"


mat3 getEnvironmentTransfrom( mat4 transform ) {
    vec3 x = vec3(transform[0][0], transform[1][0], transform[2][0]);
    vec3 y = vec3(transform[0][1], transform[1][1], transform[2][1]);
    vec3 z = vec3(transform[0][2], transform[1][2], transform[2][2]);
    mat3 m = mat3(x,y,z);
    return m;
}

vec3 computeNormalFromTangentSpaceNormalMap(const in vec4 tangent, const in vec3 normal, const in vec3 texnormal)
{
    vec3 tang = vec3(0.0,1.0,0.0);
    if (length(tangent.xyz) != 0.0) {
        tang = normalize(tangent.xyz);
    }
    vec3 B = tangent.w * cross(normal, tang);
    vec3 outnormal = texnormal.x*tang + texnormal.y*B + texnormal.z*normal;
    return normalize(outnormal);
}

vec3 textureNormal(const in vec3 rgb) {
    vec3 n = normalize((rgb-vec3(0.5)));
    return n;
}

float adjustRoughness( const in float roughness, const in vec3 normal ) {
    // Based on The Order : 1886 SIGGRAPH course notes implementation (page 21 notes)
    float normalLen = length(normal*2.0-1.0);
    if ( normalLen < 1.0) {
        float normalLen2 = normalLen * normalLen;
        float kappa = ( 3.0 * normalLen -  normalLen2 * normalLen )/( 1.0 - normalLen2 );
        // http://www.frostbite.com/2014/11/moving-frostbite-to-pbr/
        // page 91 : they use 0.5/kappa instead
        return min(1.0, sqrt( roughness * roughness + 1.0/kappa ));
    }
    return roughness;
}
const vec3 dielectricColor = vec3(0.04);

vec3 IBL(vec3 eye,vec3 albedo,float metallic,float roughness,vec3 normal)
{
vec3 specular;
#ifdef SPECULAR
    specular = sRGBToLinear( texture2D( specularMap, vTexCoord0 ), DefaultGamma ).rgb;
#else 
    vec3 albedoReduced = albedo * (1.0 - metallic);
    specular = mix( dielectricColor, albedo, metallic);
    albedo = albedoReduced;
#endif
	return computeIBL_UE4( normal, -eye, albedo, roughness, specular );
}

void main(void) {


    vec3 normal = normalize(vViewNormal);
    vec3 eye = normalize(vViewVertex);
    vec4 tangent = vec4(vViewTangent,0.0);
    vec2 uv = vTexCoord0.xy;

    environmentTransform = getEnvironmentTransfrom( uEnvironmentTransform );

    float minRoughness = 1.e-4;
    vec4 diffuseColor = texture2D( diffuseMap, uv );
    vec4 albedoSource = diffuseColor;
#ifdef ALBEDO
    albedoSource = albedoSource*texture2D( albedoMap, uv ).rgba;
#endif

  	//float di = max(0.0,dot(normal,normalize(vLight)))*0.4+0.7;
	
	// albedoSource.rgb= di*albedo;
	
    vec3 albedo = sRGBToLinear( albedoSource.rgb, DefaultGamma );
    
    
 

vec3 coatNormal = normal;
bool isCoatNormal = false;

#ifdef NORMAL



#ifdef ALBEDO

	vec2 nPrjVexter = vPrjVertex.xy/10.0;
	vec3 normalTexel = texture2D( normalMap,uv*100.0).rgb;
	normalTexel.rg = normalTexel.rg*2.0 - 1.0;
	if ( length(normalTexel) > 0.0001 ) {
        vec3 realNormal = normalize(normalTexel);
        coatNormal = computeNormalFromTangentSpaceNormalMap( tangent, normal, realNormal );
    }
    isCoatNormal = true;
#else
	vec3 normalTexel = texture2D( normalMap, uv).rgb;
	if ( length(normalTexel) > 0.0001 ) {
        vec3 realNormal = textureNormal( normalTexel );
        normal = computeNormalFromTangentSpaceNormalMap( tangent, normal, realNormal );
    }
#endif
   
  
#endif

#ifdef SPECULAR_GLOSSINESS
    float roughness = texture2D( metallicRoughnessMap, uv ).a;
    roughness = 1.0 - roughness;
#else
    float roughness = texture2D( metallicRoughnessMap, uv ).g;
#endif

    roughness = max( minRoughness , roughness );
    float ao = 1.0;
    
   
	float coatRoughness = 0.193;
#ifdef NORMAL
	
    if(isCoatNormal)
    {
    	if ( uNormalAA == 1 ) {
        	coatRoughness = adjustRoughness( coatRoughness, normalTexel);
    	}
    }else
    {
    	if ( uNormalAA == 1 ) {
        	roughness = adjustRoughness( roughness, normalTexel);
    	}
    }
    
#endif

#ifdef AO
    ao = texture2D( aoMap, uv ).r;
#endif

    vec3 resultIBL ;
    if(isCoatNormal)
    {
    	vec3 metallicColor = IBL(eye,albedo,0.16,coatRoughness,coatNormal);
    	float metallic = texture2D( metallicRoughnessMap, uv ).r;
    	
    	float fresnel = (dot(reflect(-eye, normal),-eye))*0.2;
    	
    	vec3 youColor =  IBL(eye,vec3(0.5,0.5,0.5),metallic,roughness,normal);
        resultIBL = youColor*fresnel;
    
    }else
    {
    	float metallic = texture2D( metallicRoughnessMap, uv ).r;
    	resultIBL = IBL(eye,albedo,metallic,roughness,normal);
    }
    
    vec4 result = vec4( resultIBL, albedoSource.a );

	result = linearTosRGB(result, DefaultGamma );
#ifdef TRANSPARENT
	float fresnel =  (dot(reflect(-eye, normal),-eye)*0.2+0.8);
	diffuseColor.a = fresnel*diffuseColor.a;
    result.a = diffuseColor.a;
    result.xyz  = result.xyz*diffuseColor.a;
#endif
	gl_FragColor = result;
	
}
