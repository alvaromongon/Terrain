#ifdef GL_ES
precision mediump float;
#endif

uniform vec3 vEyePosition;
uniform vec4 vLevels;
uniform vec3 waterColor;
uniform vec2 waveData;

uniform vec3 vLimits;
uniform vec3 vLightPosition;

// UVs
varying vec4 vGroundSnowUV;
varying vec4 vGrassBlendUV;
varying vec4 vRockSandUV;

//Water
uniform sampler2D refractionSampler;
uniform sampler2D reflectionSampler;
uniform sampler2D bumpSampler;

// Ground
uniform sampler2D groundSampler;

// Sand
uniform sampler2D sandSampler;

// Rock
uniform sampler2D rockSampler;

// Snow
uniform sampler2D snowSampler;

// Snow
uniform sampler2D grassSampler;

// Snow
uniform sampler2D blendSampler;

// Lights
varying vec3 vPositionW;
varying vec3 vNormalW;

// Refs
varying vec2 vBumpUV;
varying vec4 vUV;
varying float vType;

#ifdef CLIPPLANE
varying float fClipDistance;
#endif

void main(void) {
	// Clip plane
#ifdef CLIPPLANE
	if (fClipDistance > 0.0)
		discard;
#endif

	vec3 viewDirectionW = normalize(vEyePosition - vPositionW);

	// Light
	vec3 lightVectorW = normalize(vLightPosition - vPositionW);	

	// diffuse
	float ndl = max(0., dot(vNormalW, lightVectorW));

	// Final composition
	vec3 finalColor = vec3(0., 0., 0.);
	vec2 uvOffset = vec2(1.0 / 512.0, 1.0 / 512.0);

	if (vPositionW.y < 0.0) //Under see terrain
	{
		float lowLimit = vLimits.x - 2.;
		float gradient = clamp((vPositionW.y - lowLimit) / (vLimits.x - lowLimit), 0., 1.);

		float blend = texture2D(blendSampler, vGrassBlendUV.zw).r;
		vec3 groundColor = texture2D(groundSampler, vGroundSnowUV.xy).rgb * (1.0 - blend) + blend * texture2D(grassSampler, vGrassBlendUV.xy).rgb;

		finalColor = ndl * (texture2D(sandSampler, vRockSandUV.zw).rgb * (1.0 - gradient) + gradient * groundColor);
	}

	if (vType < 0.0) //River
	{
		// Wave
		vec3 bumpNormal = 2.0 * texture2D(bumpSampler, vBumpUV).rgb - 1.0;
		vec2 perturbation = waveData.y * bumpNormal.rg;

		// Specular
		vec3 angleW = normalize(viewDirectionW + lightVectorW);
		float specComp = dot(normalize(vNormalW), angleW);
		specComp = pow(abs(specComp), 256.);

		// Refraction
		vec2 texCoords;
		texCoords.x = vUV.x / vUV.w / 2.0 + 0.5;
		texCoords.y = vUV.y / vUV.w / 2.0 + 0.5;

		vec3 refractionColor = texture2D(refractionSampler, texCoords + perturbation).rgb;

		// Reflection
		vec3 reflectionColor = texture2D(reflectionSampler, texCoords + perturbation).rgb;

		// Fresnel
		float fresnelTerm = dot(viewDirectionW, vNormalW);
		fresnelTerm = clamp((1.0 - fresnelTerm) * vLevels.y, 0., 1.);

		// Water color
		finalColor = (waterColor * ndl) * vLevels.x + (1.0 - vLevels.x) * (reflectionColor * fresnelTerm * vLevels.z + (1.0 - fresnelTerm) * refractionColor * vLevels.w) + specComp;
	}

	// Over see terrain and NO river
	//Cold areas (Artic and Alpine)
	if (vType < 110.0 || vPositionW.y > vLimits.z) // [100.0,110.0)
	{
		finalColor = texture2D(snowSampler, vGroundSnowUV.zw).rgb * ndl;
	}
	//Rocky areas (Tundra)
	else if ((vType >= 110.0 && vType < 200.0) || (vPositionW.y > vLimits.y && vPositionW.y <= vLimits.z)) //[110.0,200.0)
	{
		float lowLimit = vLimits.z - 1.;
		float gradient = clamp((vPositionW.y - lowLimit) / (vLimits.z - lowLimit), 0., 1.);

		finalColor = ndl * (texture2D(rockSampler, vRockSandUV.xy + uvOffset).rgb * (1.0 - gradient)) + gradient *(ndl * texture2D(snowSampler, vGroundSnowUV.zw).rgb);
	}
	//Terrain areas (savanna and desert), and not under sun limit or over rock limit
	else if (((vType >= 310.0 && vType < 320.0) || vType >= 600.0) && (vPositionW.y > vLimits.x && vPositionW.y <= vLimits.y)) //[310.0,320.0) - [600.0,...]
	{
		float lowLimit = vLimits.y - 2.;
		float gradient = clamp((vPositionW.y - lowLimit) / (vLimits.y - lowLimit), 0., 1.);

		//float blend = texture2D(blendSampler, vGrassBlendUV.zw).r;
		//vec3 currentColor = texture2D(groundSampler, vGroundSnowUV.xy).rgb * (1.0 - blend) + blend  * texture2D(grassSampler, vGrassBlendUV.xy).rgb;
		vec3 currentColor = texture2D(groundSampler, vGroundSnowUV.xy).rgb * 0.7 + 0.3  * texture2D(grassSampler, vGrassBlendUV.xy).rgb;

		finalColor = ndl * (currentColor * (1.0 - gradient) + gradient * texture2D(rockSampler, vRockSandUV.xy + uvOffset).rgb);
	}
	//Forests and depending of altitude and subBiome
	else
	{
		float subBiome = mod(vType, 10.0);

		if (vPositionW.y <= vLimits.x || subBiome == 1.0) //Sand & sloped terrain
		{
			float lowLimit = vLimits.x - 2.;
			float gradient = clamp((vPositionW.y - lowLimit) / (vLimits.x - lowLimit), 0., 1.);

			//float blend = texture2D(blendSampler, vGrassBlendUV.zw).r;
			//vec3 groundColor = texture2D(groundSampler, vGroundSnowUV.xy).rgb * (1.0 - blend) + blend * texture2D(grassSampler, vGrassBlendUV.xy).rgb;
			vec3 groundColor = texture2D(groundSampler, vGroundSnowUV.xy).rgb * 0.5 + 0.5 * texture2D(grassSampler, vGrassBlendUV.xy).rgb;

			finalColor = ndl * (texture2D(sandSampler, vRockSandUV.zw).rgb * (1.0 - gradient) + gradient * groundColor);
		}
		else if (vPositionW.y > vLimits.x && vPositionW.y <= vLimits.y) //Ground & Grass
		{
			float lowLimit = vLimits.y - 2.;
			float gradient = clamp((vPositionW.y - lowLimit) / (vLimits.y - lowLimit), 0., 1.);

			//float blend = texture2D(blendSampler, vGrassBlendUV.zw).r;
			//vec3 currentColor = texture2D(groundSampler, vGroundSnowUV.xy).rgb * (1.0 - blend) + blend  * texture2D(grassSampler, vGrassBlendUV.xy).rgb;
			vec3 currentColor = texture2D(groundSampler, vGroundSnowUV.xy).rgb * 0.4 + 0.6  * texture2D(grassSampler, vGrassBlendUV.xy).rgb;

			if (vType >= 500.0){
				gradient = gradient - 0.1;
			}
			else if (vType >= 400.0) {
				gradient = gradient + 0.1;
			}
			else {
				gradient = gradient + 0.2;
			}

			finalColor = ndl * (currentColor * (1.0 - gradient) + gradient * texture2D(rockSampler, vRockSandUV.xy + uvOffset).rgb);
		}
	}
	
	gl_FragColor = vec4(finalColor, 1.);
}