// complexplanet.h

#pragma once

#include <string>
#include <sstream>

#include "noiseutils.h"
#include "buildPlanetResult.h"
#include "rivernoise.h"

namespace noise
{
	class ComplexPlanetBuilder
	{
	private:
		struct BuiltConfiguration
		{
			int CUR_SEED;

			double CONTINENT_FREQUENCY;

			double CONTINENT_LACUNARITY;
			double MOUNTAIN_LACUNARITY;
			double HILLS_LACUNARITY;
			double PLAINS_LACUNARITY;
			double BADLANDS_LACUNARITY;

			double MOUNTAINS_AMOUNT;
			double HILLS_AMOUNT;
			double BADLANDS_AMOUNT;

			int GENERATE_RIVERS;
			double RIVER_DEPTH;

			double CONTINENT_HEIGHT_SCALE;

			int DETAIL_LEVEL;
		};

		void PrepareHighDetailedNoise(BuiltConfiguration &buildConfiguration, module::Cache &continentDef, module::Cache &terrainTypeDef, module::Cache &scaledMountainousTerrain, module::Cache &scaledHillyTerrain, module::Cache &scaledBadlandsTerrain, module::Cache &scaledPlainsTerrain);

		void ApplyHighDetailedNoise(BuiltConfiguration &buildConfiguration, module::Cache &continentDef, module::Cache &baseContinentElev, module::Cache &scaledPlainsTerrain, module::Cache &scaledHillyTerrain, module::Cache &terrainTypeDef, module::Cache &scaledMountainousTerrain, module::Cache &scaledBadlandsTerrain, module::Cache &continentsWithBadlands);

		void PrepareRiverNoiseWorms(BuiltConfiguration &buildConfiguration, module::Cache &riverPositions, module::RidgedMulti &riverPositions_rm0, module::Curve &riverPositions_cu0, module::RidgedMulti &riverPositions_rm1, module::Curve &riverPositions_cu1, module::Min &riverPositions_mi, module::Turbulence &riverPositions_tu);

		void PrepareRiverNoiseAlgorithm(BuiltConfiguration &builtConfiguration, module::Cache &riverPositions, module::Cache &baseContinentElev, module::River &riverPositions_uncached);

		void ApplyRiverNoise(BuiltConfiguration &buildConfiguration, module::Cache &riverPositions, module::Cache &continentsWithRivers, module::Cache &continentsWithBadlands, module::Cache &baseContinentElev, module::ScaleBias &continentsWithRivers_sb, module::Add &continentsWithRivers_ad, module::Select &continentsWithRivers_se);

		void BuildElevGridRivers(BuiltConfiguration &buildConfiguration, utils::BuildPlanetResult &result, module::Cache &riverPositions, double southCoord, double northCoord, double westCoord, double eastCoord, int width, int height);

		void LoadBuiltConfiguration(const std::string &configFile, BuiltConfiguration &buildConfiguration);

	public:
		utils::BuildPlanetResult BuildPlanetNoises(double southCoord, double northCoord, double westCoord, double eastCoord, int width, int height);
	};

}