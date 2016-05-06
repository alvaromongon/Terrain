#ifdef GL_ES
precision lowp float;
#endif

uniform vec3 vEyePosition;
uniform vec3 waterColor;

uniform vec3 vLimits;
uniform vec3 vLightPosition;

//Water
uniform sampler2D refractionSampler;
uniform sampler2D reflectionSampler;
uniform sampler2D bumpSampler;

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
	vec3 snow = vec3(1.0, 0.97, 1.0);
	vec3 rock = vec3(0.2, 0.2, 0.2);
	vec3 grass = vec3(0.13, 0.55, 0.13); 
	vec3 ground = vec3(0.8,0.,0.68);
	vec3 sand = vec3(0.125, 0.70, 0.67);
	vec2 uvOffset = vec2(1.0 / 512.0, 1.0 / 512.0);

	if (vType < 0.0) //Sea or river
	{
		// Wave
		vec3 bumpNormal = 2.0 * texture2D(bumpSampler, vBumpUV).rgb - 1.0;
		vec2 perturbation = 0.15 * bumpNormal.rg;

		// Refraction
		vec2 texCoords;
		texCoords.x = vUV.x / vUV.w / 2.0 + 0.5;
		texCoords.y = vUV.y / vUV.w / 2.0 + 0.5;

		vec3 refractionColor = texture2D(refractionSampler, texCoords + perturbation).rgb;

		// Reflection
		vec3 reflectionColor = texture2D(reflectionSampler, texCoords + perturbation).rgb;

		// Fresnel
		float fresnelTerm = dot(viewDirectionW, vNormalW);
		fresnelTerm = clamp((1.0 - fresnelTerm) * 1.0, 0., 1.);

		// Water color
		finalColor = (waterColor)* 0.2 + (0.8) * (reflectionColor * fresnelTerm * 0.6 + (1.0 - fresnelTerm) * refractionColor * 0.8);
	}
	else //Terrain
	{
		//Cold areas (Artic and Alpine)
		if (vType == 100.0 || vPositionW.y > vLimits.z)
		{
			finalColor = snow * ndl;
		}
		//Rocky areas (Tundra)
		else if (vType == 110.0 || (vPositionW.y > vLimits.y && vPositionW.y <= vLimits.z))
		{
			float lowLimit = vLimits.z - 1.;
			float gradient = clamp((vPositionW.y - lowLimit) / (vLimits.z - lowLimit), 0., 1.);

			finalColor = ndl * (rock * (1.0 - gradient)) + gradient *(ndl * snow);
		}
		//Terrain areas (savanna and desert), and not ander san limit or over rock limit
		else if ((vType == 310.0 || vType == 600.0) && (vPositionW.y > vLimits.x && vPositionW.y <= vLimits.y))
		{
			float lowLimit = vLimits.y - 2.;
			float gradient = clamp((vPositionW.y - lowLimit) / (vLimits.y - lowLimit), 0., 1.);

			vec3 currentColor = snow * 0.7 + 0.3  * grass;

			finalColor = ndl * (currentColor * (1.0 - gradient) + gradient * rock);
		}
		//Forests and depending of altitude
		else
		{
			if (vPositionW.y <= vLimits.x) //Sand
			{
				float lowLimit = vLimits.x - 2.;
				float gradient = clamp((vPositionW.y - lowLimit) / (vLimits.x - lowLimit), 0., 1.);

				finalColor = ndl * (sand * (1.0 - gradient) + gradient * grass);
			}
			else if (vPositionW.y > vLimits.x && vPositionW.y <= vLimits.y) //Ground & Grass
			{
				float lowLimit = vLimits.y - 2.;
				float gradient = clamp((vPositionW.y - lowLimit) / (vLimits.y - lowLimit), 0., 1.);

				vec3 currentColor = ground * 0.3 + 0.7  * grass;

				finalColor = ndl * (currentColor * (1.0 - gradient) + gradient * rock);
			}
		}
	}

	gl_FragColor = vec4(finalColor, 1.);
}