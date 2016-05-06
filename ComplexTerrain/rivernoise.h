// rivernoise.h
//
// Copyright (C) 2003-2005 Jason Bevins
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
//
// The developer's email is jlbezigvins@gmzigail.com (for great email, take
// off every 'zig'.)
//

#ifndef RIVERNOISE_H
#define RIVERNOISE_H

#include <stdlib.h>
#include <string.h>
#include <unordered_map> 
#include <string>

#include <noise/noise.h>

#include "coordinate.h"
#include "riverNode.h"

using namespace noise;

namespace noise
{
	namespace module
	{

		/// @mainpage rivernoise
		///
		/// @section intro Introduction
		///
		/// This library contains a useful class for creating a river noise
		/// from a base noise that has the role of the base map terrain
		/// This noise module requires one source module.
		class River : public module::Module
		{

		public:

			/// Constructor.
			River();

			virtual int GetSourceModuleCount() const
			{
				return 1;
			}			

			virtual double GetValue(double x, double y, double z) const;

			virtual void River::CalculateRiver(utils::RiverNode& riverNode) const;

			virtual void River::BuildSurroundersRiverNodes(double lat, double lon, float floodingRate, float cascadeRate, std::vector<utils::RiverNode>& riverNodes) const;

			virtual double River::CalculateMaxAltitudeInSurroundersRiverNodes(std::vector<utils::RiverNode>& riverNodes) const;

			virtual void SetSourceModule(int index, const module::Module& sourceModule)
			{
				module::Module::SetSourceModule(index, sourceModule);
			}

			virtual void SetLatLonAndDelta(double lat, double lon, double latDelta, double lonDelta) const
			{
				m_lat = lat;
				m_lon = lon;
				m_latDelta = latDelta;
				m_lonDelta = lonDelta;
			}
			
		private:

			void AlgorithmAlpha(double terrainAltitude, utils::RiverNode& riverNode, std::vector<utils::RiverNode>& riverNodes) const;

			void AlgorithmBeta(double terrainAltitude, utils::RiverNode& riverNode, std::vector<utils::RiverNode>& riverNodes) const;

			mutable double m_lat;

			mutable double m_lon;

			mutable double m_latDelta;

			mutable double m_lonDelta;

			mutable std::vector<utils::Coordinate> commingFrom;
			mutable std::unordered_map<utils::Coordinate, float> processed;

			const float MIN_ALTITUDE_SPRING_RANGE = 0.20; // 0.20; //0.38;
			const float MAX_ALTITUDE_SPRING_RANGE = 0.80;
			const float MIN_DISTANCE_BETWEEN_SPRINGS = 0.15; //0.1; // 0.075; //0.05;		
			
			const int16 MIN_SURRONDER_RIVER_THAT_ALLOW_FLOODING = 1;
			const float FLOODING_RATE = 0.01; // 0.01 sounds good, but maybe is too much
			const float MULTIPLIER_TO_DECREASE_FLOODING_RATE = 1.0;
			
			const int16 MIN_SURRONDER_RIVER_THAT_ALLOW_CASCADING = 1;
			const float CASCADING_RATE = 1.0;
			const float MULTIPLIER_TO_DECREASE_CASCADING_RATE = 1.0; //0.999;//0.9999;// 1.0;
			 
			const int MAX_CALL_DEEP = 2000;

			const float RIVER_SPRING = -2.0;
			const float RIVER_CASCADING = -1.3;			
			const float RIVER_FLOODING = -1.1;
			const float NOT_RIVER = 1;
		};

		/// @}

		/// @}

		/// @}

	}
}

#endif
