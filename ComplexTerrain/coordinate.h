// coordinate.h
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

#ifndef COORDINATE_H
#define COORDINATE_H

namespace noise
{
	namespace utils
	{
		class Coordinate
		{
		private:
			double _lat, _lon;
		public:
			Coordinate() : _lat(0), _lon(0) {}
			Coordinate(double lat, double lon) : _lat(lat), _lon(lon) {}

			double GetLatitude() const {
				return _lat;
			}

			double GetLongitude() const {
				return _lon;
			}

			bool operator==(const Coordinate& coordinate) const {
				return _lat == coordinate.GetLatitude() && _lon == coordinate.GetLongitude();
			}

			bool operator!=(const Coordinate &coordinate) const {
				return _lat != coordinate.GetLatitude() || _lon != coordinate.GetLongitude();
			}

			double Coordinate::Distance(const Coordinate &cooordinate) const;
		};		
	}
}

#include <functional>

using namespace noise;

template <>
struct std::hash <utils::Coordinate>
{
	size_t operator()(const utils::Coordinate& k) const
	{
		// Compute individual hash values for two data members and combine them using XOR and bit shifting
		return ((std::hash<double>()(k.GetLatitude()) ^ (hash<double>()(k.GetLongitude()) << 1)) >> 1);
	}
};

#endif
