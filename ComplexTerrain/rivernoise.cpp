// rivernois.cpp
//
// This library is free software; you can redistribute it and/or modify it
// under the terms of the GNU Lesser General Public License as published by
// the Free Software Foundation; either version 2.1 of the License, or (at
// your option) any later version.
//
// This library is distributed in the hope that it will be useful, but WITHOUT
// ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or
// FITNESS FOR A PARTICULAR PURPOSE.  See the GNU Lesser General Public
// License (COPYING.txt) for more details.
//
// You should have received a copy of the GNU Lesser General Public License
// along with this library; if not, write to the Free Software Foundation,
// Inc., 59 Temple Place, Suite 330, Boston, MA  02111-1307  USA

#include <vector>
#include <fstream>
#include <algorithm>

#include <noise/interp.h>
#include <noise/mathconsts.h>

#include "rivernoise.h"
#include "logging.h"

using namespace logging;
using namespace noise;
using namespace noise::model;
using namespace noise::module;

//////////////////////////////////////////////////////////////////////////////
// Miscellaneous functions

namespace noise
{

	namespace module
	{
		static std::vector<utils::Coordinate> springs;

		River::River() :
			module::Module(GetSourceModuleCount())
		{
		}

		double River::GetValue(double x, double y, double z) const
		{
			utils::RiverNode *riverNode = new utils::RiverNode(m_lat, m_lon, FLOODING_RATE, CASCADING_RATE);
			riverNode->CalculateAltitude(m_pSourceModule[0]);
			std::vector<utils::Coordinate> sources;

			CalculateRiver(*riverNode);

			return riverNode->GetRiver();
		}

		void River::CalculateRiver(utils::RiverNode& riverNode) const
		{
			assert(m_pSourceModule[0] != NULL);

			//map key:
			utils::Coordinate key = riverNode.GetCoordinate();
			double terrainAltitude = riverNode.GetAltitude();

			// Ignore any terrain under the sea level
			if (terrainAltitude < 0.0){
				riverNode.SetRiver(NOT_RIVER);
				return;
			}

			std::unordered_map<utils::Coordinate, float>::const_iterator searchResult = processed.find(key);

			if (searchResult != processed.end()){
				riverNode.SetRiver(searchResult->second); //already calculated
			}
			else {			
				if (terrainAltitude < MAX_ALTITUDE_SPRING_RANGE){

					double lat = riverNode.GetCoordinate().GetLatitude();
					double lon = riverNode.GetCoordinate().GetLongitude();

					std::vector<utils::RiverNode> riverNodes;
					River::BuildSurroundersRiverNodes(lat, lon, riverNode.GetFloodingRate(), riverNode.GetCascadingRate(), riverNodes);

					// Sort by altitude, lower -> upper
					std::sort(riverNodes.begin(), riverNodes.end());

					double maxAltitude = River::CalculateMaxAltitudeInSurroundersRiverNodes(riverNodes);

					if (terrainAltitude > maxAltitude){ // Higher than surronders

						if (terrainAltitude > MIN_ALTITUDE_SPRING_RANGE){ //Altitude in range

							double minDistance = 1000;
							for (std::vector<utils::Coordinate>::iterator it = springs.begin(); it != springs.end(); ++it){
								minDistance = std::min(minDistance, (*it).Distance(key));
							}

							if (minDistance > MIN_DISTANCE_BETWEEN_SPRINGS){ // Distance bigger than minimum set
								springs.push_back(key);
								riverNode.SetRiver(RIVER_SPRING); // spring
							}
						}
					}
					else { // Check from where the water could come in a deterministic way						
						River::AlgorithmBeta(terrainAltitude, riverNode, riverNodes);
					}
				}

				processed[key] = riverNode.GetRiver();
			}
		}

		void River::AlgorithmAlpha(double terrainAltitude, utils::RiverNode& riverNode, std::vector<utils::RiverNode>& riverNodes) const
		{
			//const float MIN_ALTITUDE_SPRING_RANGE = 0.38;
			//const float MAX_ALTITUDE_SPRING_RANGE = 0.90;
			//const float MIN_DISTANCE_BETWEEN_SPRINGS = 0.05;

			//const int16 MIN_SURRONDER_RIVER_THAT_ALLOW_FLOODING = 1;
			//const float FLOODING_RATE = 0.1;
			//const float MULTIPLIER_TO_DECREASE_FLOODING_RATE = 1.0;

			//const int16 MIN_SURRONDER_RIVER_THAT_ALLOW_CASCADING = 1;
			//const float CASCADING_RATE = 1.0;
			//const float MULTIPLIER_TO_DECREASE_CASCADING_RATE = 1.0;

			//const int MAX_CALL_DEEP = 2000;

			uint16 numberOfsurroderRivers = 0;
			for (std::vector<utils::RiverNode>::iterator it = riverNodes.begin(); it != riverNodes.end(); ++it){
				float cascadingRate = it->GetCascadingRate();
				if (it->GetAltitude() * cascadingRate > terrainAltitude) { //Only check higher altitudes

					std::vector<utils::Coordinate>::iterator itCoordinates = std::find(commingFrom.begin(), commingFrom.end(), it->GetCoordinate());
					if (itCoordinates == commingFrom.end() && commingFrom.size() < MAX_CALL_DEEP) { //If the coordinate was not found and the deeper of calls in not over max

						// Before star processing, add the origins
						commingFrom.push_back(riverNode.GetCoordinate());

						it->SetCascadingRate(it->GetCascadingRate() * MULTIPLIER_TO_DECREASE_CASCADING_RATE);
						CalculateRiver(*it);

						//After finished, remove from origins
						itCoordinates = std::find(commingFrom.begin(), commingFrom.end(), riverNode.GetCoordinate());
						if (itCoordinates != commingFrom.end()){
							commingFrom.erase(itCoordinates);
						}

						if (it->GetRiver() != NOT_RIVER)
						{
							if (it->GetRiver() == RIVER_SPRING){
								numberOfsurroderRivers = MIN_SURRONDER_RIVER_THAT_ALLOW_CASCADING;
							}

							++numberOfsurroderRivers;
						}

						/*if (it->GetRiver() != NOT_RIVER && ++numberOfsurroderRivers >= MIN_SURRONDER_RIVER_THAT_ALLOW_CASCADING)
						{
						riverNode.SetRiver(RIVER_CASCADING);
						break;
						}*/
					}
				}
			}

			if (numberOfsurroderRivers >= MIN_SURRONDER_RIVER_THAT_ALLOW_CASCADING)
			{
				riverNode.SetRiver(RIVER_CASCADING);
			}

			if (numberOfsurroderRivers == 0){// && terrainAltitude < MIN_ALTITUDE_SPRING_RANGE){ //flooding now allowed on springs allow altitudes
				for (std::vector<utils::RiverNode>::iterator it = riverNodes.begin(); it != riverNodes.end(); ++it){
					double itAltitude = it->GetAltitude();
					float floodingRate = it->GetFloodingRate();
					if (itAltitude <= terrainAltitude && terrainAltitude - itAltitude <= floodingRate) { //Only check lower altitudes

						std::vector<utils::Coordinate>::iterator itCoordinates = std::find(commingFrom.begin(), commingFrom.end(), it->GetCoordinate());
						if (itCoordinates == commingFrom.end() && commingFrom.size() < MAX_CALL_DEEP) { //If the coordinate was not found and the deeper of calls in not over max

							// Before star processing, add the origins
							commingFrom.push_back(riverNode.GetCoordinate());

							it->SetFloodingRate(it->GetFloodingRate() * MULTIPLIER_TO_DECREASE_FLOODING_RATE);
							CalculateRiver(*it);

							//After finished, remove from origins
							itCoordinates = std::find(commingFrom.begin(), commingFrom.end(), riverNode.GetCoordinate());
							if (itCoordinates != commingFrom.end()){
								commingFrom.erase(itCoordinates);
							}

							if (it->GetRiver() != NOT_RIVER)
							{
								++numberOfsurroderRivers;
							}
						}
					}
				}

				if (numberOfsurroderRivers >= MIN_SURRONDER_RIVER_THAT_ALLOW_FLOODING){
					riverNode.SetRiver(RIVER_FLOODING);
				}
			}
		}

		void River::AlgorithmBeta(double terrainAltitude, utils::RiverNode& riverNode, std::vector<utils::RiverNode>& riverNodes) const
		{
			//const float MIN_ALTITUDE_SPRING_RANGE = 0.20; //0.38;
			//const float MAX_ALTITUDE_SPRING_RANGE = 0.80;
			//const float MIN_DISTANCE_BETWEEN_SPRINGS = 0.1; // 0.075; //0.05;		

			//const int16 MIN_SURRONDER_RIVER_THAT_ALLOW_FLOODING = 1;
			//const float FLOODING_RATE = 0.01; // 0.01 sounds good, but maybe is too much
			//const float MULTIPLIER_TO_DECREASE_FLOODING_RATE = 1.0;

			//const int16 MIN_SURRONDER_RIVER_THAT_ALLOW_CASCADING = 1;
			//const float CASCADING_RATE = 1.0;
			//const float MULTIPLIER_TO_DECREASE_CASCADING_RATE = 0.999;//0.9999;// 1.0;

			// Before star processing, add the origins
			commingFrom.push_back(riverNode.GetCoordinate());
			std::vector<utils::Coordinate>::iterator iterator;

			uint16 numberOfsurroderRiversByCascading = 0;
			uint16 numberOfsurroderRiversByFlooding = 0;
			for (std::vector<utils::RiverNode>::iterator it = riverNodes.begin(); it != riverNodes.end(); ++it){

				float floodingRate = it->GetFloodingRate();
				float cascadingRate = it->GetCascadingRate();
				double nodeCascadingRate = it->GetAltitude() * cascadingRate;
				double nodeFloodingRate = terrainAltitude - it->GetAltitude();

				if (nodeCascadingRate > terrainAltitude || (it->GetAltitude() <= terrainAltitude && nodeFloodingRate <= floodingRate)) {

					iterator = std::find(commingFrom.begin(), commingFrom.end(), it->GetCoordinate());
					//If the coordinate was not found and the deeper of calls in not over max
					if (iterator == commingFrom.end() && commingFrom.size() < MAX_CALL_DEEP) {

						if (nodeCascadingRate > terrainAltitude){
							it->SetCascadingRate(it->GetCascadingRate() * MULTIPLIER_TO_DECREASE_CASCADING_RATE);
							it->SetFloodingRate(FLOODING_RATE);
						}
						else {
							it->SetFloodingRate(it->GetFloodingRate() * MULTIPLIER_TO_DECREASE_FLOODING_RATE);
							it->SetCascadingRate(CASCADING_RATE);
						}

						CalculateRiver(*it);

						if (it->GetRiver() == RIVER_SPRING){ //If the water is coming from a spring, ignore minimum surronders for cascading
							numberOfsurroderRiversByCascading = MIN_SURRONDER_RIVER_THAT_ALLOW_CASCADING;
						}
						else if (it->GetRiver() != NOT_RIVER)
						{
							if (nodeCascadingRate > terrainAltitude){								
								++numberOfsurroderRiversByCascading;
							}
							else {
								++numberOfsurroderRiversByFlooding;
							}
						}
					}
				}
			}

			//After finished, remove from origins
			iterator = std::find(commingFrom.begin(), commingFrom.end(), riverNode.GetCoordinate());
			if (iterator != commingFrom.end()){
				commingFrom.erase(iterator);
			}

			if (numberOfsurroderRiversByCascading >= MIN_SURRONDER_RIVER_THAT_ALLOW_CASCADING)
			{
				riverNode.SetRiver(RIVER_CASCADING);
			}
			else if (numberOfsurroderRiversByFlooding >= MIN_SURRONDER_RIVER_THAT_ALLOW_FLOODING)
			{
				riverNode.SetRiver(RIVER_FLOODING);
			}
		}

		void River::BuildSurroundersRiverNodes(double lat, double lon, float floodingRate, float cascadeRate, std::vector<utils::RiverNode>& riverNodes) const
		{
			utils::RiverNode *upperLeft = new utils::RiverNode(lat + m_latDelta, lon - m_lonDelta, floodingRate, cascadeRate);
			utils::RiverNode *upper = new utils::RiverNode(lat + m_latDelta, lon, floodingRate, cascadeRate);
			utils::RiverNode *upperRight = new utils::RiverNode(lat + m_latDelta, lon + m_lonDelta, floodingRate, cascadeRate);
			utils::RiverNode *left = new utils::RiverNode(lat, lon - m_lonDelta, floodingRate, cascadeRate);
			utils::RiverNode *right = new utils::RiverNode(lat, lon + m_lonDelta, floodingRate, cascadeRate);
			utils::RiverNode *lowerLeft = new utils::RiverNode(lat - m_latDelta, lon - m_lonDelta, floodingRate, cascadeRate);
			utils::RiverNode *lower = new utils::RiverNode(lat - m_latDelta, lon, floodingRate, cascadeRate);
			utils::RiverNode *lowerRight = new utils::RiverNode(lat - m_latDelta, lon + m_lonDelta, floodingRate, cascadeRate);

			upperLeft->CalculateAltitude(m_pSourceModule[0]);
			upper->CalculateAltitude(m_pSourceModule[0]);
			upperRight->CalculateAltitude(m_pSourceModule[0]);
			left->CalculateAltitude(m_pSourceModule[0]);
			right->CalculateAltitude(m_pSourceModule[0]);
			lowerLeft->CalculateAltitude(m_pSourceModule[0]);
			lower->CalculateAltitude(m_pSourceModule[0]);
			lowerRight->CalculateAltitude(m_pSourceModule[0]);

			riverNodes.push_back(*upperLeft);
			riverNodes.push_back(*upper);
			riverNodes.push_back(*upperRight);
			riverNodes.push_back(*left);
			riverNodes.push_back(*right);
			riverNodes.push_back(*lowerLeft);
			riverNodes.push_back(*lower);
			riverNodes.push_back(*lowerRight);			
		}

		double River::CalculateMaxAltitudeInSurroundersRiverNodes(std::vector<utils::RiverNode>& riverNodes) const 
		{
			std::vector<double> altitudes;
			for (std::vector<utils::RiverNode>::iterator it = riverNodes.begin(); it != riverNodes.end(); ++it){
				altitudes.push_back((*it).GetAltitude());
			}

			return *std::max_element(altitudes.begin(), altitudes.end());
		}
	}
}
