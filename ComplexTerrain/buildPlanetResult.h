#pragma once

#include "noiseutils.h"

namespace noise
{
	namespace utils
	{
		class BuildPlanetResult
		{
		public:
			utils::NoiseMap elevationGridUnScaledTerrain;
			utils::NoiseMap elevationGridRivers;
			bool hasRivers;
		};
	}
}