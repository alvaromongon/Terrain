// system.h
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

#ifndef SYSTEM_H
#define SYSTEM_H

#include <string>
#include "noiseutils.h"

extern std::string BASE_DIRECTORY;

extern std::string CONFIGURATION_FILE;

// Specifies the planet's sea level.  This value must be between -1.0
// (minimum planet elevation) and +1.0 (maximum planet elevation.)
extern double SEA_LEVEL;

// Specifies the level on the planet in which continental shelves appear.
// This value must be between -1.0 (minimum planet elevation) and +1.0
// (maximum planet elevation), and must be less than SEA_LEVEL.
extern double SHELF_LEVEL;

// Minimum elevation on the planet, in meters.  This value is approximate.
extern double MIN_ELEV;

// Maximum elevation on the planet, in meters.  This value is approximate.
extern double MAX_ELEV;


#endif
