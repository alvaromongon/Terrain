// riverNode.h
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

#ifndef RIVERNODE_H
#define RIVERNODE_H

#include "coordinate.h"
#include "noise/latlon.h"

#include <noise/noise.h>

using namespace noise;

namespace noise
{

	namespace utils
	{
		class RiverNode
		{
		private:
			Coordinate _coordinate;
			double _x, _y, _z;
			double _altitude;
			float _river;
			float _floodingRate;
			float _cascadingRate;
		public:
			RiverNode() {}
			RiverNode(double lat, double lon, double floodingRate, double cascadingRate) : _coordinate(lat, lon) { 
				// -1: river, 1: no river
				_river = 1; //by default is no river
				_floodingRate = floodingRate;
				_cascadingRate = cascadingRate;
			}

			Coordinate RiverNode::GetCoordinate() const{
				return _coordinate;
			}

			double RiverNode::GetX() const{
				return _x;
			}

			double RiverNode::GetY() const{
				return _y;
			}

			double RiverNode::GetZ() const{
				return _z;
			}

			float RiverNode::GetFloodingRate() const{
				return _floodingRate;
			}

			void RiverNode::SetFloodingRate(float floodingRate) {
				_floodingRate = floodingRate;
			}

			float RiverNode::GetCascadingRate() const{
				return _cascadingRate;
			}

			void RiverNode::SetCascadingRate(float cascadingRate) {
				_cascadingRate = cascadingRate;
			}

			double RiverNode::GetAltitude() const{
				return _altitude;
			}

			float RiverNode::GetRiver() const{
				return _river;
			}

			void RiverNode::SetRiver(float river){
				_river = river;
			}

			inline bool operator==(const RiverNode &riverNode) const {
				return _coordinate.GetLatitude() == riverNode._coordinate.GetLatitude() && _coordinate.GetLongitude() == riverNode._coordinate.GetLongitude();
			}

			inline bool operator!=(const RiverNode &riverNode) const {
				return _coordinate.GetLatitude() != riverNode._coordinate.GetLatitude() || _coordinate.GetLongitude() != riverNode._coordinate.GetLongitude();
			}

			// Sort by altitude, upper --> lower
			bool operator < (const RiverNode& riverNode) const
			{
				return (_altitude < riverNode.GetAltitude());
			}

			double RiverNode::CalculateAltitude(const module::Module* sourceModule);
		};
	}

}

#endif
