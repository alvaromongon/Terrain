#ifdef GL_ES
precision mediump float;
#endif

// Attributes
attribute vec3 position;
attribute vec3 normal;
attribute vec2 uv;
attribute float type;

// Uniforms
//Water
uniform vec2 waveData;
uniform mat4 windMatrix;

// Ground
uniform mat4 groundMatrix;

// Snow
uniform mat4 snowMatrix;

// Rock
uniform mat4 rockMatrix;

// Sand
uniform mat4 sandMatrix;

// Grass
uniform mat4 grassMatrix;

// Blend
uniform mat4 blendMatrix;

uniform mat4 world;
uniform mat4 worldViewProjection;

// UVs
varying vec4 vGroundSnowUV;
varying vec4 vGrassBlendUV;
varying vec4 vRockSandUV;

// Normal
varying vec3 vPositionW;
varying vec3 vNormalW;
varying vec4 vUV;
varying vec2 vBumpUV;
varying float vType;

#ifdef CLIPPLANE
uniform vec4 vClipPlane;
varying float fClipDistance;
#endif

void main(void) {
	// Space transformation from the word space (position) to the projection space.
	// Multiply the transformation matrix with the position. Since the matrix a 4x4 we need a 1 at the end of the vector3
	vec4 outPosition = worldViewProjection * vec4(position, 1.0);

	// open gl, set the position of the current vertex
	gl_Position = outPosition;
	
	// Vertex position in world space
	vPositionW = vec3(world * vec4(position, 1.0));

	// Vertex Normal in world space
	vNormalW = normalize(vec3(world * vec4(normal, 0.0)));

	// vertex data type of terrain
	vType = type;
	
	// 2d position UV refer to XY but in 2d. XYZ are the letters use by 3d
	vUV = outPosition;

	vec2 bumpTexCoord = vec2(windMatrix * vec4(uv, 0.0, 1.0));
	vBumpUV = bumpTexCoord / waveData.x;

	// ground (xy) and snow (zw) 2d positions
	vGroundSnowUV.xy = vec2(groundMatrix * vec4(uv, 1.0, 0.0));
	vGroundSnowUV.zw = vec2(snowMatrix * vec4(uv, 1.0, 0.0));

	// rock (xy) and sans (zw) 2d positions
	vRockSandUV.xy = vec2(rockMatrix * vec4(uv, 1.0, 0.0));
	vRockSandUV.zw = vec2(sandMatrix * vec4(uv, 1.0, 0.0));
	
	// grass (xy) and blend (zw) 2d positions
	vGrassBlendUV.xy = vec2(grassMatrix * vec4(uv, 1.0, 0.0));
	vGrassBlendUV.zw = vec2(blendMatrix * vec4(uv, 1.0, 0.0));

	// Clip plane
#ifdef CLIPPLANE
	fClipDistance = dot(worldPos, vClipPlane);
#endif
}