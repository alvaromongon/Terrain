/*
-- Whittaker biomes --
Types of Biomes/terrain (sorted by temperature):
- -100 - Under sea
- -200 - River
- -210 - River by flooding
- 100 - Artic/Alpine				Temp (-20,-10) - Precpt (0,100)
- 110 - Tundra						Temp (-15,-7) - Precpt (0,100)
- 200 - Taiga (Boreal forest)		Temp (-7,4) - Precpt (50,200)
- 300 - Woodland/Shrubland			Temp (-1,16) - Precpt (30,120)
- 310 - Savanna						Temp (15,23) - Precpt (60,130)
- 320 - Thom forest					Temp (22,28) - Precpt (60,130)
- 400 - Temperate deciduous forest	Temp (4,18) - Precpt (100,240)
- 410 - Tropical montane forest		Temp (5,20) - Precpt (200,340)
- 500 - Dry forest					Temp (18,29) - Precpt (130,250)
- 510 - Tropical rain forest		Temp (19,29) - Precpt (250,500)
- 600 - Desert						Temp (-5,30) - Precpt (0,50)

-- Sub-biomes --
Defined adding a number to the last digit of a biome.
- 1 - Sloped terrain. This terrain doesn't allow vegetation content. Example: 501: Dry forest, sloped terrain.

Parameters to determine the biome type:
- Average temperature (centigrades): -20 --> 30
- Average precipitation (cms): 0 --> 500
NOTE: Get biome, if exist, apply, otherwise, get two closers and apply according with distance, eg: biome1 (distance 60), biome2 (distance 40). apply random by percentage

Paramteres to determine average temperature and precipitation:
Temperature:
- Latitude
- (la temperatura media a nivel del mal varia a razon de 0.27 ºC por cada grado de latitud partiendo de una temperatura de 27 ºC en el ecuador): t = 27 + (Abs(latitude) * -0.27)
- Altitude
- (la temperatura varía con la altitud a razón de 0,65 ºC por 100m partiendo de una temperatura de 15 ºC a nivel del mar): t = 15 + (altitude(m) / 100m * -0.65)
- Distance to sea or river
- TBD

Final ecuation: t = (27 + (Math.Abs(latitude) * -0.27)) + ((altitude(m) / 100m) * -0.65))

Precipitaton:
- Latitude
- (In the area near to the equador and the pole, it is most likely to find a climate perturbation): 0: 400 / 30: 0 / 55: 200 / 90: 5
0 --> -30/30		p = 400 + (Math.Abs(latitude) * -13.4)
-30/30 --> -55/55   p = 200 + (55 - (Math.Abs(latitude)) * -8)
-55/55 --> -90/90	p = Math.Abs(5 + (90 - (Math.Abs(latitude))) * -5.43)
- Distance sea
- TBD
- Distance river
- TBD
*/

#ifndef COMPLEXPLANET_H
#define COMPLEXPLANET_H

#include <vector>

#include "noiseutils.h"
#include "buildPlanetResult.h"

using namespace noise;

struct TerrainConfiguration
{	
	float SLOPE_IDENTIFICATOR;
	float VEGETATION_PROBABILITY;
	float ALTITUDE_VEGETATION_MAX_LINE;
	float ALTITUDE_VEGETATION_MIN_LINE;
	float ALTITUDE_VEGETATION_TREND_CHANGE_LINE;
	int MIN_SURROUNDER_RIVERS_FOR_FLOODING;

	int UNDER_SEA_TERRAIN_TYPE;
	int RIVER_TERRAIN_TYPE;
	int RIVER_BY_FLOODING_TERRAIN_TYPE;
	int ARTIC_ALPINE_TERRAIN_TYPE;
	int TUNDRA_TERRAIN_TYPE;
	int TAIGA_TERRAIN_TYPE;
	int WOODLAND_TERRAIN_TYPE;
	int SAVANNA_TERRAIN_TYPE;
	int THOM_FOREST_TERRAIN_TYPE;
	int TEMPERATE_DECIDUOUS_FOREST_TERRAIN_TYPE;
	int TROPICAL_MONTANE_FOREST_TERRAIN_TYPE;
	int DRY_FOREST_TERRAIN_TYPE;
	int TROPICAL_RAIN_FOREST_TERRAIN_TYPE;
	int DESERT_TERRAIN_TYPE;
};

struct CellStruct
{
    float a;
    int t;
};

struct Biome{
	int temperatureMin;
	int temperatureMax;
	float temperatureMid;
	int PrecipitationMin;
	int PrecipitationMax;
	float PrecipitationMid;

	int value;
};

// Build file configurations
const short IMAGE_AND_DATA = 1;
const short IMAGE = 2;
const short DATA = 3;

const int NUMBER_OF_BIOMES = 11;
Biome BIOMES[11] = { 
  { -20, -10, -15, 0, 100, 50, 100 }
, { -15, -7, -11, 0, 100, 50, 110 }
, { -7, 4, -1.5, 50, 200, 125, 200 }
, { -1, 16, 7.5, 30, 120, 75, 300 }
, { 15, 23, 19, 60, 130, 95, 310 }
, { 22, 28, 25, 60, 130, 95, 320 }
, { 4, 18, 11, 100, 240, 160, 400 }
, { 5, 20, 12.5, 200, 340, 270, 410 }
, { 18, 29, 23.5, 130, 250, 190, 500 }
, { 19, 29, 24, 250, 500, 375, 510 }
, { -5, 30, 22.5, 0, 50, 25, 600 } };

int BuildPlanetFilesInternal(float northCoord, float westCoord, int widthTileSize, int heightTileSize, float deltaNorthCoord, float deltaWestCoord, int width, int height, char* destinyDirectory, short whatToBuild);

extern "C" __declspec(dllexport) float CalculateTemperature(float latitude, float altitude);

extern "C" __declspec(dllexport) float CalculatePrecipitation(float latitude, float altitude);

extern "C" __declspec(dllexport) int CalculateBiomeCode(TerrainConfiguration &terrainConfiguration, float temperature, float precipitation, float slope);

extern "C" __declspec(dllexport) int CalculateVegetationCode(TerrainConfiguration &terrainConfiguration, int biome, float precipitationRate, float unScaledAltitude);

std::string BuildFilePath(int width, int height, float deltaNorthCoord, float deltaWestCoord, double northCoord, double westCoord, char* destinyDirectory, std::string extension);

void PrepareImageRenderer(utils::BuildPlanetResult &grids, utils::Image &image, utils::RendererImage &renderer);

void LoadTerrainConfiguration(const std::string &configFile, TerrainConfiguration &terrainConfiguration);

extern "C" __declspec(dllexport) int NumberOfSurrounderRivers(const float* elevationPreviousLine, const float* elevationCurrentLine, const float* elevationNextLine, int columnCounter, int columnNumber);

extern "C" __declspec(dllexport) float MinTerrainAltitudeOfSurrounderRivers(const float* elevationRiverPreviousLine, const float* elevationRiverCurrentLine, const float* elevationRiverNextLine, const float* elevationPreviousLine, const float* elevationCurrentLine, const float* elevationNextLine, int columnCounter, int columnNumber);

extern "C" __declspec(dllexport) float CalculateSlope(const float* elevationPreviousLine, const float* elevationCurrentLine, const float* elevationNextLine, int columnCounter, int columnNumber);

extern "C" __declspec(dllexport) void GetSurroundersAltitudes(const float* elevationPreviousLine, const float* elevationCurrentLine, const float* elevationNextLine, int columnCounter, int columnNumber, std::vector<float> &altitudes);

#endif