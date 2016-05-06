#ifdef GL_ES
precision lowp float;
#endif

// highp for vertex positions,
// mediump for texture coordinates,
// lowp for colors.

// Attributes
attribute vec3 position;
attribute vec3 normal;
attribute vec2 uv;

// Uniforms
uniform vec2 waveData;
uniform mat4 windMatrix;
uniform mat4 world;
uniform mat4 worldViewProjection;

// Normal
varying vec3 vPositionW;
varying vec3 vNormalW;
varying vec4 vUV;
varying vec2 vBumpUV;

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

	// 2d position UV refer to XY but in 2d. XYZ are the letters use by 3d
	vUV = outPosition;

	// windMatrix (animated bump texture by time) transform in 2d using the texture coordinate (uv)
	vec2 bumpTexCoord = vec2(windMatrix * vec4(uv, 0.0, 1.0));

	// Vertex bump 2d divided by wave length which is a fix value
	vBumpUV = bumpTexCoord / waveData.x;
	//vBumpUV = bumpTexCoord / 0.1;
}