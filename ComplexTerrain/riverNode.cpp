// riverNode.cpp
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

#include "riverNode.h"

//////////////////////////////////////////////////////////////////////////////
// Miscellaneous functions

namespace noise
{
	namespace utils
	{
		double RiverNode::CalculateAltitude(const module::Module* sourceModule) {
			LatLonToXYZ(_coordinate.GetLatitude(), _coordinate.GetLongitude(), _x, _y, _z);
			_altitude = sourceModule->GetValue(_x, _y, _z);

			return _altitude;
		}
	}

}
