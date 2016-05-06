// buildPlanetFiles.cpp

#include <math.h>
#include <algorithm>

#include <string>
#include <sstream>
#include <iomanip>      // std::setprecision

#include <stdlib.h>
#include <time.h>

#include <comdef.h>
#include <comutil.h>

#include "buildPlanetFiles.h"
#include "complexplanet.h"
#include "system.h"
#include "logging.h"

using namespace logging;
using namespace noise;

extern "C" __declspec(dllexport) void SetBaseDirectory(char* absolutePathDirectory)
{
	BASE_DIRECTORY = absolutePathDirectory;
}

extern "C" __declspec(dllexport) int BuildDataPlanetFiles(float northCoord, float westCoord, int widthTileSize, int heightTileSize, float deltaNorthCoord, float deltaWestCoord, int width, int height, char* destinyDirectory)
{
	return BuildPlanetFilesInternal(northCoord, westCoord, widthTileSize, heightTileSize, deltaNorthCoord, deltaWestCoord, width, height, destinyDirectory, DATA);
}

extern "C" __declspec(dllexport) int BuildImagePlanetFiles(float northCoord, float westCoord, int widthTileSize, int heightTileSize, float deltaNorthCoord, float deltaWestCoord, int width, int height, char* destinyDirectory)
{
	return BuildPlanetFilesInternal(northCoord, westCoord, widthTileSize, heightTileSize, deltaNorthCoord, deltaWestCoord, width, height, destinyDirectory, IMAGE);
}

extern "C" __declspec(dllexport) int BuildPlanetFiles(float northCoord, float westCoord, int widthTileSize, int heightTileSize, float deltaNorthCoord, float deltaWestCoord, int width, int height, char* destinyDirectory)
{	
	return BuildPlanetFilesInternal(northCoord, westCoord, widthTileSize, heightTileSize, deltaNorthCoord, deltaWestCoord, width, height, destinyDirectory, IMAGE_AND_DATA);
}

int BuildPlanetFilesInternal(float northCoord, float westCoord, int widthTileSize, int heightTileSize, float deltaNorthCoord, float deltaWestCoord, int width, int height, char* destinyDirectory, short whatToBuild)
{
	BasicLogging::Write("Starting BuildPlanetFiles.BuildPlanetFilesInternal: northCoord(" + std::to_string(static_cast<long double>(northCoord)) + ")/westCoord(" + std::to_string(static_cast<long double>(westCoord)) + ")/widthTileSize(" + std::to_string(static_cast<long int>(widthTileSize)) + ")/heightTileSize(" + std::to_string(static_cast<long int>(heightTileSize)) + ")/deltaNorthCoord(" + std::to_string(static_cast<long float>(deltaNorthCoord)) + ")/deltaWestCoord(" + std::to_string(static_cast<long float>(deltaWestCoord)) + ")/width(" + std::to_string(static_cast<long int>(width)) + ")" + ")/height(" + std::to_string(static_cast<long int>(height)) + ")");
	
	// Build the whole requested grids
	ComplexPlanetBuilder complexPlanetBuilder;
	utils::BuildPlanetResult grids = complexPlanetBuilder.BuildPlanetNoises(northCoord - (heightTileSize * deltaNorthCoord), northCoord, westCoord, westCoord + (widthTileSize * deltaWestCoord), width * widthTileSize, height * heightTileSize);	

	// Load configuration from file
	TerrainConfiguration terrainConfiguration;
	LoadTerrainConfiguration(BASE_DIRECTORY + CONFIGURATION_FILE, terrainConfiguration);

	float maxSouth = northCoord - ((heightTileSize-1) * deltaNorthCoord);

	for (int northSouthCounter = 0; northSouthCounter < heightTileSize; northSouthCounter++){		
		
		float north = maxSouth + (northSouthCounter * deltaNorthCoord);
		float south = north - deltaNorthCoord;

		int initialHeightPosition = northSouthCounter * height;
		
		for (int westEastCounter = 0; westEastCounter < widthTileSize; westEastCounter++){
			
			float west = westCoord + (westEastCounter * deltaWestCoord);
			float east = westCoord + ((westEastCounter + 1) * deltaWestCoord);

			int initialWidthPosition = westEastCounter * width;			
			std::string imageFilePath;

			if (whatToBuild == IMAGE_AND_DATA || whatToBuild == IMAGE){
				// Prepare image renderer
				utils::Image image;
				utils::RendererImage renderer;
				PrepareImageRenderer(grids, image, renderer);

				// Build image file - GS{0}_TS{1}_NL{2}_WL{3}.bmp
				imageFilePath = BuildFilePath(width, height, deltaNorthCoord, deltaWestCoord, north, west, destinyDirectory, ".bmp");

				renderer.RenderPortion(initialWidthPosition, initialHeightPosition, width, height);

				BasicLogging::Write("Image to write: " + imageFilePath);

				utils::WriterBMP writer;
				writer.SetSourceImage(image);
				writer.SetDestFilename(imageFilePath);
				writer.WriteDestFile();
			}			

			if (whatToBuild != IMAGE){
				// Buils json file - GS{0}_TS{1}_NL{2}_WL{3}.json
				// This is building a TileInformation json object

				//Set biomes values to values from configuration
				// TODO: refactor this
				BIOMES[0].value = terrainConfiguration.ARTIC_ALPINE_TERRAIN_TYPE;
				BIOMES[1].value = terrainConfiguration.TUNDRA_TERRAIN_TYPE;
				BIOMES[2].value = terrainConfiguration.TAIGA_TERRAIN_TYPE;
				BIOMES[3].value = terrainConfiguration.WOODLAND_TERRAIN_TYPE;
				BIOMES[4].value = terrainConfiguration.SAVANNA_TERRAIN_TYPE;
				BIOMES[5].value = terrainConfiguration.THOM_FOREST_TERRAIN_TYPE;
				BIOMES[6].value = terrainConfiguration.TEMPERATE_DECIDUOUS_FOREST_TERRAIN_TYPE;
				BIOMES[7].value = terrainConfiguration.TROPICAL_MONTANE_FOREST_TERRAIN_TYPE;
				BIOMES[8].value = terrainConfiguration.DRY_FOREST_TERRAIN_TYPE;
				BIOMES[9].value = terrainConfiguration.TROPICAL_RAIN_FOREST_TERRAIN_TYPE;
				BIOMES[10].value = terrainConfiguration.DESERT_TERRAIN_TYPE;

				std::string jsonFilePath = BuildFilePath(width, height, deltaNorthCoord, deltaWestCoord, north, west, destinyDirectory, ".json");

				float deltaLatitude = (north - south) / height;
				float emptyArray = -2.0;
				float altitude;
				
				//Json container
				std::stringstream json;
				json << "{\"Grid\":[";

				for (int y = height-1; y >= 0; y--) {
					int yPlusInitial = y + initialHeightPosition;

					const float* pSourceRiverPrevious = NULL;
					const float* pSourceRiver = NULL;
					const float* pSourceRiverNext = NULL;
					if (grids.hasRivers){
						pSourceRiverPrevious = y < height - 1 ? grids.elevationGridRivers.GetConstSlabPtr(yPlusInitial + 1) : &emptyArray;
						pSourceRiver = grids.elevationGridRivers.GetConstSlabPtr(yPlusInitial);
						pSourceRiverNext = y > 0 ? grids.elevationGridUnScaledTerrain.GetConstSlabPtr(yPlusInitial - 1) : &emptyArray;
						for (int x = 0; x < initialWidthPosition; x++) {
							if (*pSourceRiverPrevious != -2.0)
								++pSourceRiverPrevious;
							++pSourceRiver;
							if (*pSourceRiverNext != -2.0)
								++pSourceRiverNext;
						}
					}

					const float* pSourcePrevious = y < height - 1 ? grids.elevationGridUnScaledTerrain.GetConstSlabPtr(yPlusInitial + 1) : &emptyArray;
					const float* pSource = grids.elevationGridUnScaledTerrain.GetConstSlabPtr(yPlusInitial);
					const float* pSourceNext = y > 0 ? grids.elevationGridUnScaledTerrain.GetConstSlabPtr(yPlusInitial - 1) : &emptyArray;
					for (int x = 0; x < initialWidthPosition; x++) {
						if (*pSourcePrevious != -2.0)
							++pSourcePrevious;
						++pSource;
						if (*pSourceNext != -2.0)
							++pSourceNext;
					}

					for (int x = 0; x < width; x++) {

						float slope = CalculateSlope(pSourcePrevious, pSource, pSourceNext, x, width);
						int biome = -1, content;
						altitude = *pSource;						

						//Calculate the point metadata
						if (*pSource < 0.0)
						{
							biome = terrainConfiguration.UNDER_SEA_TERRAIN_TYPE;
						}
						else if (pSourceRiver != NULL)
						{
							if (slope <= terrainConfiguration.SLOPE_IDENTIFICATOR){
								if (*pSourceRiver < 0){
									biome = terrainConfiguration.RIVER_TERRAIN_TYPE;
								}

								if (NumberOfSurrounderRivers(pSourceRiverPrevious, pSourceRiver, pSourceRiverNext, x, width) > terrainConfiguration.MIN_SURROUNDER_RIVERS_FOR_FLOODING){
									biome = terrainConfiguration.RIVER_BY_FLOODING_TERRAIN_TYPE;
									float result = MinTerrainAltitudeOfSurrounderRivers(pSourceRiverPrevious, pSourceRiver, pSourceRiverNext, pSourcePrevious, pSource, pSourceNext, x, width);
									altitude = result != -2.0 ? result : altitude;
								}
							}							
						}

						if (biome < 0) //Not yet set
						{
							float scaledAltitude = MAX_ELEV * *pSource;
							float exactLatitude = north + (deltaLatitude * y);

							float temperature = CalculateTemperature(exactLatitude, scaledAltitude);
							float precipitation = CalculatePrecipitation(exactLatitude, scaledAltitude);

							float precipitationRate = (float)precipitation / 500;
							float precipitationRateTransform = (1 - precipitationRate) * -2.0;							

							biome = CalculateBiomeCode(terrainConfiguration, temperature, precipitation, slope);
							content = CalculateVegetationCode(terrainConfiguration, biome, precipitationRate, *pSource);
						}

						// cell in json format
						std::stringstream cell;						
						if (y != height - 1 || x != 0)
						{
							cell << ",";
						}
						
						cell << "{\"a\":" << altitude << ",\"t\":" << biome << ",\"c\":" << content << "}";
						
						json << cell.str();

						// Go to the next point.
						if (*pSourcePrevious != -2.0)
							++pSourcePrevious;
						++pSource;
						if (*pSourceNext != -2.0)
							++pSourceNext;

						if (pSourceRiver != NULL) {
							if (*pSourceRiverPrevious != -2.0)
								++pSourceRiverPrevious;
							++pSourceRiver;
							if (*pSourceRiverNext != -2.0)
								++pSourceRiverNext;
						}
					}
				}

				json << "],\"GridSize\":" << width << ",\"ResolutionInMeters\":0,\"IsNorthAdjusted\":false,\"IsWestAdjusted\":false,\"IsSouthAdjusted\":false,\"IsEastAdjusted\":false}";

				BasicLogging::Write("Json to write: " + jsonFilePath);

				// Write result to file
				std::ofstream out(jsonFilePath);
				out << json.str();
				out.close();
			}			
		}
	}

	return 0;
}

extern "C" __declspec(dllexport)  float CalculateTemperature(float latitude, float altitude)
{
	return (27 + (abs(latitude) * -0.27)) + ((altitude / 100) * -0.65);
}

extern "C" __declspec(dllexport)  float CalculatePrecipitation(float latitude, float altitude)
{
	float absLatitude = abs(latitude);

	if (absLatitude <= 30){
		return 400 + (absLatitude * -13.33333);
	}
	else if (absLatitude > 30 && absLatitude <= 55){
		return  200 + ((55 - absLatitude) * -8);
	}
	else {
		return abs(5 + ((90 - absLatitude) * -5.43));
	}
}

extern "C" __declspec(dllexport)  int CalculateBiomeCode(TerrainConfiguration &terrainConfiguration, float temperature, float precipitation, float slope)
{
	int x = 0, tempDistance, prectDistance, biome;
	int distances[NUMBER_OF_BIOMES];	

	int indexSelected = 0;
	Biome selected = BIOMES[indexSelected];

	for (x = 0; x < NUMBER_OF_BIOMES; x++) {
		if (temperature > BIOMES[x].temperatureMin && temperature < BIOMES[x].temperatureMax){
			tempDistance = 0;
		}
		else {
			tempDistance = temperature - BIOMES[x].temperatureMid;
		}

		if (precipitation > BIOMES[x].PrecipitationMin && precipitation < BIOMES[x].PrecipitationMax){
			prectDistance = 0;
		}
		else {
			prectDistance = precipitation - BIOMES[x].PrecipitationMid;
		}

		if (tempDistance == 0 && prectDistance == 0){
			return BIOMES[x].value;
		}

		distances[x] = abs(tempDistance) + abs(prectDistance);

		if (x > 0 && distances[x] < distances[indexSelected]){
			indexSelected = x;
			selected = BIOMES[indexSelected];
		}
	}

	biome = selected.value;

	if (slope > terrainConfiguration.SLOPE_IDENTIFICATOR){
		biome += 1;
	}

	return biome;
}

extern "C" __declspec(dllexport)  int CalculateVegetationCode(TerrainConfiguration &terrainConfiguration, int biome, float precipitationRate, float unScaledAltitude)
{	
	// No trees in: near to sea level, too high terrain, slope terrain
	if (unScaledAltitude > terrainConfiguration.ALTITUDE_VEGETATION_MIN_LINE 
		&& unScaledAltitude < terrainConfiguration.ALTITUDE_VEGETATION_MAX_LINE 
		&& biome % 10 != 1){

		//Probability increase when the altitude increse, until a point when it start decreasing.
		float vegetationProbability = precipitationRate * terrainConfiguration.VEGETATION_PROBABILITY;
		float amplitudGrowing = terrainConfiguration.ALTITUDE_VEGETATION_TREND_CHANGE_LINE - terrainConfiguration.ALTITUDE_VEGETATION_MIN_LINE;
		float amplitudDecreasing = terrainConfiguration.ALTITUDE_VEGETATION_MAX_LINE - terrainConfiguration.ALTITUDE_VEGETATION_TREND_CHANGE_LINE;

		if (unScaledAltitude < terrainConfiguration.ALTITUDE_VEGETATION_TREND_CHANGE_LINE){
			vegetationProbability *= (unScaledAltitude - terrainConfiguration.ALTITUDE_VEGETATION_MIN_LINE) / amplitudGrowing;
		}
		else {
			vegetationProbability *= 1 - ((unScaledAltitude - terrainConfiguration.ALTITUDE_VEGETATION_TREND_CHANGE_LINE) / amplitudDecreasing);
		}

		int random = rand() % 100;

		if (random < vegetationProbability * 100){
			return  biome;
		}
	}

	return 0; //Assuming 0 means empty
}

std::string BuildFilePath(int width, int height, float deltaNorthCoord, float deltaWestCoord, double northCoord, double westCoord, char* destinyDirectory, std::string extension)
{
	double north, west;
	if (northCoord > -0.0000001 && northCoord < 0.0000001){
		north = 0.0;
	}
	else {
		north = northCoord;
	}
	if (westCoord > -0.0000001 && westCoord < 0.0000001){
		west = 0.0;
	}
	else {
		west = westCoord;
	}

	double pi = 3.14159265359;
	std::stringstream stream;
	stream << std::fixed << std::setprecision(1);
	stream << "GS" << width << "-" << height << "_TSN" << deltaNorthCoord << "_NL" << north << "_TSW" << deltaWestCoord << "_WL" << west << extension;
	std::string file = stream.str();

	const char* temp = file.c_str();
	char path[1000];
	strcpy_s(path, destinyDirectory);
	strcat_s(path, temp);

	std::string result(path);

	return result;
}

void PrepareImageRenderer(utils::BuildPlanetResult &grids, utils::Image &image, utils::RendererImage &renderer)
{
	renderer.SetDestImage(image);

	renderer.SetSourceNoiseMap(grids.elevationGridUnScaledTerrain);

	if (grids.hasRivers){
		renderer.SetSourceRiverNoiseMap(grids.elevationGridRivers);
	}

	renderer.ClearGradient();

	renderer.AddGradientPoint(-1.0 + SEA_LEVEL, utils::Color(3, 29, 63, 255));
	renderer.AddGradientPoint(SHELF_LEVEL + SEA_LEVEL, utils::Color(3, 29, 63, 255));
	renderer.AddGradientPoint(-0.0001 + SEA_LEVEL, utils::Color(7, 106, 127, 255));
	renderer.AddGradientPoint(0.0 + SEA_LEVEL, utils::Color(62, 86, 30, 255));
	renderer.AddGradientPoint(0.125 + SEA_LEVEL, utils::Color(84, 96, 50, 255));
	renderer.AddGradientPoint(0.25 + SEA_LEVEL, utils::Color(130, 127, 97, 255));
	renderer.AddGradientPoint(0.375 + SEA_LEVEL, utils::Color(184, 163, 141, 255));
	renderer.AddGradientPoint(0.5 + SEA_LEVEL, utils::Color(255, 255, 255, 255));
	renderer.AddGradientPoint(0.75 + SEA_LEVEL, utils::Color(128, 255, 255, 255));
	renderer.AddGradientPoint(1.0 + SEA_LEVEL, utils::Color(0, 0, 255, 255));
	renderer.EnableLight(false);
}

void LoadTerrainConfiguration(const std::string &configFile, TerrainConfiguration &terrainConfiguration)
{
	BasicLogging::Write("Reading terrain configuration from " + configFile + "file");

	std::ifstream fin(configFile);
	std::string line;
	std::istringstream sin;

	while (std::getline(fin, line)) {
		if (line.find("//") == std::string::npos){
			sin.str(line.substr(line.find("=") + 1));
			if (line.find("SLOPE_IDENTIFICATOR") != std::string::npos) {
				//std::cout << "CUR_SEED" << sin.str() << std::endl;
				sin >> terrainConfiguration.SLOPE_IDENTIFICATOR;
			}			
			else if (line.find("VEGETATION_PROBABILITY") != std::string::npos) {
				sin >> terrainConfiguration.VEGETATION_PROBABILITY;
			}
			else if (line.find("ALTITUDE_VEGETATION_MAX_LINE") != std::string::npos) {
				sin >> terrainConfiguration.ALTITUDE_VEGETATION_MAX_LINE;
			}
			else if (line.find("ALTITUDE_VEGETATION_MIN_LINE") != std::string::npos) {
				sin >> terrainConfiguration.ALTITUDE_VEGETATION_MIN_LINE;
			}
			else if (line.find("ALTITUDE_VEGETATION_TREND_CHANGE_LINE") != std::string::npos) {
				sin >> terrainConfiguration.ALTITUDE_VEGETATION_TREND_CHANGE_LINE;
			}		
			else if (line.find("MIN_SURROUNDER_RIVERS_FOR_FLOODING") != std::string::npos) {
				sin >> terrainConfiguration.MIN_SURROUNDER_RIVERS_FOR_FLOODING;
			}
			else if (line.find("UNDER_SEA_TERRAIN_TYPE") != std::string::npos) {
				sin >> terrainConfiguration.UNDER_SEA_TERRAIN_TYPE;
			}
			else if (line.find("RIVER_TERRAIN_TYPE") != std::string::npos) {
				sin >> terrainConfiguration.RIVER_TERRAIN_TYPE;
			}
			else if (line.find("RIVER_BY_FLOODING_TERRAIN_TYPE") != std::string::npos) {
				sin >> terrainConfiguration.RIVER_BY_FLOODING_TERRAIN_TYPE;
			}
			else if (line.find("ARTIC_ALPINE_TERRAIN_TYPE") != std::string::npos) {
				sin >> terrainConfiguration.ARTIC_ALPINE_TERRAIN_TYPE;
			}
			else if (line.find("TUNDRA_TERRAIN_TYPE") != std::string::npos) {
				sin >> terrainConfiguration.TUNDRA_TERRAIN_TYPE;
			}
			else if (line.find("TAIGA_TERRAIN_TYPE") != std::string::npos) {
				sin >> terrainConfiguration.TAIGA_TERRAIN_TYPE;
			}
			else if (line.find("WOODLAND_TERRAIN_TYPE") != std::string::npos) {
				sin >> terrainConfiguration.WOODLAND_TERRAIN_TYPE;
			}
			else if (line.find("SAVANNA_TERRAIN_TYPE") != std::string::npos) {
				sin >> terrainConfiguration.SAVANNA_TERRAIN_TYPE;
			}
			else if (line.find("THOM_FOREST_TERRAIN_TYPE") != std::string::npos) {
				sin >> terrainConfiguration.THOM_FOREST_TERRAIN_TYPE;
			}
			else if (line.find("TEMPERATE_DECIDUOUS_FOREST_TERRAIN_TYPE") != std::string::npos) {
				sin >> terrainConfiguration.TEMPERATE_DECIDUOUS_FOREST_TERRAIN_TYPE;
			}
			else if (line.find("TROPICAL_MONTANE_FOREST_TERRAIN_TYPE") != std::string::npos) {
				sin >> terrainConfiguration.TROPICAL_MONTANE_FOREST_TERRAIN_TYPE;
			}
			else if (line.find("DRY_FOREST_TERRAIN_TYPE") != std::string::npos) {
				sin >> terrainConfiguration.DRY_FOREST_TERRAIN_TYPE;
			}
			else if (line.find("TROPICAL_RAIN_FOREST_TERRAIN_TYPE") != std::string::npos) {
				sin >> terrainConfiguration.TROPICAL_RAIN_FOREST_TERRAIN_TYPE;
			}
			else if (line.find("DESERT_TERRAIN_TYPE") != std::string::npos) {
				sin >> terrainConfiguration.DESERT_TERRAIN_TYPE;
			}
		}
		sin.clear();
	}

	BasicLogging::Write("Finished reading terrain configuration file");
}

extern "C" __declspec(dllexport)  int NumberOfSurrounderRivers(const float* elevationPreviousLine, const float* elevationCurrentLine, const float* elevationNextLine, int columnCounter, int columnNumber)
{
	std::vector<float> altitudes;
	GetSurroundersAltitudes(elevationPreviousLine, elevationCurrentLine, elevationNextLine, columnCounter, columnNumber, altitudes);

	int surrounderRivers = 0;

	for each (float altitude in altitudes)
	{
		if (altitude < 0){
			surrounderRivers++;
		}
	}

	return surrounderRivers;
}

extern "C" __declspec(dllexport) float MinTerrainAltitudeOfSurrounderRivers(const float* elevationRiverPreviousLine, const float* elevationRiverCurrentLine, const float* elevationRiverNextLine, const float* elevationPreviousLine, const float* elevationCurrentLine, const float* elevationNextLine, int columnCounter, int columnNumber)
{
	std::vector<float> terrainAltitudes;
	GetSurroundersAltitudes(elevationPreviousLine, elevationCurrentLine, elevationNextLine, columnCounter, columnNumber, terrainAltitudes);

	std::vector<float> riverAltitudes;
	GetSurroundersAltitudes(elevationRiverPreviousLine, elevationRiverCurrentLine, elevationRiverNextLine, columnCounter, columnNumber, riverAltitudes);

	if (terrainAltitudes.size() != riverAltitudes.size()){
		BasicLogging::Write("Starting BuildPlanetFiles.MinTerrainAltitudeOfSurrounderRivers, different size between terrain altitdes array (" + std::to_string(static_cast<long int>(terrainAltitudes.size())) + ") and river altitudes array (" + std::to_string(static_cast<long int>(riverAltitudes.size())) + ")");
		
		return -2.0;
	}

	std::vector<float> terrainAltitudesfiltered;

	for (uint i = 0; i < terrainAltitudes.size(); i++)
	{
		if (riverAltitudes[i] < 0){
			terrainAltitudesfiltered.push_back(terrainAltitudes[i]);
		}
	}

	if (terrainAltitudesfiltered.size() == 1){
		return terrainAltitudesfiltered[0];
	}
	else {
		return *std::min_element(terrainAltitudesfiltered.begin(), terrainAltitudesfiltered.end());
	}	
}

extern "C" __declspec(dllexport) float CalculateSlope(const float* elevationPreviousLine, const float* elevationCurrentLine, const float* elevationNextLine, int columnCounter, int columnNumber)
{	
	std::vector<float> altitudes;
	GetSurroundersAltitudes(elevationPreviousLine, elevationCurrentLine, elevationNextLine, columnCounter, columnNumber, altitudes);

	float unscaledAltitude = *(elevationCurrentLine);
	float minAltitude = *std::min_element(altitudes.begin(), altitudes.end());
	float maxAltitude = *std::max_element(altitudes.begin(), altitudes.end());

	float difference1 = abs(unscaledAltitude - minAltitude);
	float difference2 = abs(unscaledAltitude - maxAltitude);
	return max(difference1, difference2) / unscaledAltitude;
}

extern "C" __declspec(dllexport) void GetSurroundersAltitudes(const float* elevationPreviousLine, const float* elevationCurrentLine, const float* elevationNextLine, int columnCounter, int columnNumber, std::vector<float> &altitudes)
{
	if (*elevationPreviousLine != -2.0){
		altitudes.push_back(*(elevationPreviousLine)); //upper

		if (columnCounter > 0){
			altitudes.push_back(*(elevationPreviousLine - 1)); //upper left
		}

		if (columnCounter < columnNumber){
			altitudes.push_back(*(elevationPreviousLine + 1)); //upper right
		}
	}

	if (columnCounter > 0){
		altitudes.push_back(*(elevationCurrentLine - 1)); //left
	}

	if (columnCounter < columnNumber){
		altitudes.push_back(*(elevationCurrentLine + 1)); //right
	}

	if (*elevationNextLine != -2.0){
		altitudes.push_back(*(elevationNextLine)); //botton

		if (columnCounter > 0){
			altitudes.push_back(*(elevationNextLine - 1)); //botton left
		}

		if (columnCounter < columnNumber){
			altitudes.push_back(*(elevationNextLine + 1)); //botton right
		}
	}
}



