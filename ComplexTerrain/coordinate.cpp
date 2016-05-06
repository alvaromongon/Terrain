// coordinate.cpp
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

#include <algorithm>

#include "coordinate.h"

//////////////////////////////////////////////////////////////////////////////
// Miscellaneous functions

namespace noise
{
	namespace utils
	{
		double Coordinate::Distance(const Coordinate &cooordinate) const{
			return (std::abs(_lat - cooordinate._lat) + std::abs(_lon - cooordinate._lon));
		}
	}

}
