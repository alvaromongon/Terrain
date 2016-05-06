var Terrain;
(function (Terrain) {
    var Tiles;
    (function (Tiles) {
        var CoordinateSystemHelps = (function () {
            function CoordinateSystemHelps() {
            }
            CoordinateSystemHelps.SetOrigin = function (northlatValue, westLonValue, tileSize, gridSize) {
                CoordinateSystemHelps.northOrigin = 0;
                CoordinateSystemHelps.westOrigin = 0;
                CoordinateSystemHelps.northOrigin = CoordinateSystemHelps.CalculateNorthSouthOffSet(northlatValue, tileSize, gridSize);
                CoordinateSystemHelps.westOrigin = CoordinateSystemHelps.CalculateWestEastOffSet(westLonValue, tileSize, gridSize);
            };
            CoordinateSystemHelps.CalculateWestEastOffSet = function (westLonValue, tileSize, gridSize) {
                var halfGridSize = (gridSize / 2) | 0;
                var xAmplitud = 360 * gridSize * 1 / tileSize;
                var xPosition = westLonValue + 180;
                var result = ((xPosition * xAmplitud) / 360) + halfGridSize;
                //var result = (westLonValue / tileSize) * (halfGridSize) + ((westLonValue + tileSize) / tileSize) * (halfGridSize);
                return CoordinateSystemHelps.ReferToWestOrigin(Math.round(result));
            };
            CoordinateSystemHelps.CalculateNorthSouthOffSet = function (northlatValue, tileSize, gridSize) {
                var halfGridSize = (gridSize / 2) | 0;
                var xAmplitud = 180 * gridSize * 1 / tileSize;
                var xPosition = northlatValue + 90;
                var result = ((xPosition * xAmplitud) / 180) + halfGridSize;
                //var result = (northlatValue / tileSize) * (halfGridSize) + ((northlatValue - tileSize) / tileSize) * (halfGridSize);
                return CoordinateSystemHelps.ReferToNorthOrigin(Math.round(result));
            };
            CoordinateSystemHelps.CheckLalitude = function (value, decimalPrecision) {
                value = +(value).toFixed(decimalPrecision) / 1;
                if (value < -90) {
                    return value + 180;
                }
                else if (value > 90) {
                    return value - 180;
                }
                else {
                    return value;
                }
            };
            CoordinateSystemHelps.CheckLongitude = function (value, decimalPrecision) {
                value = +(value).toFixed(decimalPrecision) / 1;
                if (value < -180) {
                    return value + 360;
                }
                else if (value > 180) {
                    return value - 360;
                }
                else {
                    return value;
                }
            };
            CoordinateSystemHelps.ReferToNorthOrigin = function (value) {
                if (value > 0) {
                    return value - CoordinateSystemHelps.northOrigin;
                }
                else {
                    return CoordinateSystemHelps.northOrigin - value;
                }
            };
            CoordinateSystemHelps.ReferToWestOrigin = function (value) {
                if (value > 0) {
                    return value - CoordinateSystemHelps.westOrigin;
                }
                else {
                    return CoordinateSystemHelps.westOrigin - value;
                }
            };
            return CoordinateSystemHelps;
        })();
        Tiles.CoordinateSystemHelps = CoordinateSystemHelps;
    })(Tiles = Terrain.Tiles || (Terrain.Tiles = {}));
})(Terrain || (Terrain = {}));
