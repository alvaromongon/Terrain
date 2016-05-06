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

// Textures
uniform sampler2D groundSampler;
uniform sampler2D sandSampler;
uniform sampler2D rockSampler;
uniform sampler2D snowSampler;
uniform sampler2D grassSampler;
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
	//View vector over vertex position
	vec3 viewDirectionW = normalize(vEyePosition - vPositionW);

	// Light vector over vertex position
	vec3 lightVectorW = normalize(vLightPosition - vPositionW);

	// Phong: you must compute diffuse and specular part by using light direction and vertex’s normal	
	float ndl = max(0., dot(vNormalW, lightVectorW));  // diffuse texture (base color)	
	vec3 angleW = normalize(viewDirectionW + lightVectorW);
	float specComp = dot(normalize(vNormalW), angleW);
	specComp = pow(abs(specComp), 256.);  // Specular texture (light color)

	vec3 finalColor = vec3(0., 0., 0.);
	vec2 uvOffset = vec2(1.0 / 512.0, 1.0 / 512.0);

	if (vType < -100.0) //River
	{
		// Wave
		vec3 bumpNormal = 2.0 * texture2D(bumpSampler, vBumpUV).rgb - 1.0;
		vec2 perturbation = waveData.y * bumpNormal.rg;

		// Refraction & reflection
		vec2 texCoords;
		texCoords.x = vUV.x / vUV.w / 2.0 + 0.5;
		texCoords.y = vUV.y / vUV.w / 2.0 + 0.5;
		vec3 refractionColor = texture2D(refractionSampler, texCoords + perturbation).rgb;
		vec3 reflectionColor = texture2D(reflectionSampler, texCoords + perturbation).rgb;

		// Fresnel equations: predict the reflection of light
		float fresnelTerm = dot(viewDirectionW, vNormalW);
		fresnelTerm = clamp((1.0 - fresnelTerm) * vLevels.y, 0., 1.);

		// Water final color: (plain color * level) + ((reflection color * fresnel * level) + (refaction color * fresnel * levels)) + specular component (light)
		// If not refraction and reflection it should look like (pure phong equation): waterColor * ndl + vec3(specComp);
		finalColor = (waterColor * ndl) * vLevels.x + (1.0 - vLevels.x) * (reflectionColor * fresnelTerm * vLevels.z + (1.0 - fresnelTerm) * refractionColor * vLevels.w) + specComp;
	}	
	else if (vPositionW.y <= vLimits.x)
	{
		float lowLimit = vLimits.x - 2.;
		float gradient = clamp((vPositionW.y - lowLimit) / (vLimits.x - lowLimit), 0., 1.);

		float blend = texture2D(blendSampler, vGrassBlendUV.zw).r;
		vec3 groundColor = texture2D(groundSampler, vGroundSnowUV.xy).rgb * (1.0 - blend) + blend * texture2D(grassSampler, vGrassBlendUV.xy).rgb;

		finalColor = ndl * (texture2D(sandSampler, vRockSandUV.zw).rgb * (1.0 - gradient) + gradient * groundColor);
	}
	else if (vPositionW.y > vLimits.x && vPositionW.y <= vLimits.y)
	{
		float lowLimit = vLimits.y - 2.;
		float gradient = clamp((vPositionW.y - lowLimit) / (vLimits.y - lowLimit), 0., 1.);

		float blend = texture2D(blendSampler, vGrassBlendUV.zw).r;
		vec3 currentColor = texture2D(groundSampler, vGroundSnowUV.xy).rgb * (1.0 - blend) + blend  * texture2D(grassSampler, vGrassBlendUV.xy).rgb;

		finalColor = ndl * (currentColor * (1.0 - gradient) + gradient * texture2D(rockSampler, vRockSandUV.xy + uvOffset).rgb);
	}
	else if (vPositionW.y > vLimits.y && vPositionW.y <= vLimits.z)
	{
		float lowLimit = vLimits.z - 1.;
		float gradient = clamp((vPositionW.y - lowLimit) / (vLimits.z - lowLimit), 0., 1.);

		finalColor = ndl * (texture2D(rockSampler, vRockSandUV.xy + uvOffset).rgb * (1.0 - gradient)) + gradient *(ndl * texture2D(snowSampler, vGroundSnowUV.zw).rgb);
	}
	else
	{
		finalColor = texture2D(snowSampler, vGroundSnowUV.zw).rgb * ndl;
	}

	gl_FragColor = vec4(finalColor, 1.);

	//if (vType < -100.0) //River
	//{				
	//}
	//else if (vType < 0.0){ //Under sea
	//	finalColor = texture2D(grassSampler, vGrassBlendUV.xy).rgb * ndl; //texture2D(grassSampler, uUV2d).rgb * ndl + vec3(specComp);
	//}
	//else
	//{
	//	float subBiome = mod(vType, 10.0);
	//	
	//	if (subBiome == 1.0){ //Slope
	//		if (vType < 300.0){ //Cold areas
	//			finalColor = texture2D(rockSampler, vBumpUV).rgb;
	//		}
	//		else{
	//			finalColor = texture2D(rockSampler, vBumpUV).rgb;
	//		}			
	//	}
	//	else if (vType < 110.0){ //Artic Alpine
	//		finalColor = texture2D(sandSampler, vBumpUV).rgb;
	//	}
	//	else if (vType < 200.0){ //Tundra
	//		finalColor = texture2D(sandSampler, vBumpUV).rgb;
	//	}
	//	else if (vType < 300.0){ //Taiga
	//		finalColor = texture2D(sandSampler, vBumpUV).rgb;
	//	}
	//	else if (vType < 310.0){ //Woodland
	//		finalColor = texture2D(sandSampler, vBumpUV).rgb;
	//	}
	//	else if (vType < 320.0){ //Savanna
	//		finalColor = texture2D(sandSampler, vBumpUV).rgb;
	//	}
	//	else if (vType < 400.0){ //Thom forest
	//		finalColor = texture2D(sandSampler, vBumpUV).rgb;
	//	}
	//	else if (vType < 410.0){ //Temperate decidious forest
	//		finalColor = texture2D(sandSampler, vBumpUV).rgb;
	//	}
	//	else if (vType < 500.0){ //Tropical montane forest
	//		finalColor = texture2D(sandSampler, vBumpUV).rgb;
	//	}
	//	else if (vType < 510.0){ //Dry forest
	//		finalColor = texture2D(sandSampler, vBumpUV).rgb;
	//	}
	//	else if (vType < 600.0){ //Tropical rain forest
	//		finalColor = texture2D(tropicalRainSampler, vBumpUV).rgb;
	//	}
	//	else { //Dessert
	//		finalColor = texture2D(sandSampler, vBumpUV).rgb;
	//	}
	//}

	gl_FragColor = vec4(finalColor, 1.);
}