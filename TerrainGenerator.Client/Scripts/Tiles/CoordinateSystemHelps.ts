module Terrain.Tiles {

    export class CoordinateSystemHelps {

        private static northOrigin: number;
        private static westOrigin: number;

        public static SetOrigin(northlatValue, westLonValue, tileSize, gridSize): void {

            CoordinateSystemHelps.northOrigin = 0;
            CoordinateSystemHelps.westOrigin = 0;

            CoordinateSystemHelps.northOrigin = CoordinateSystemHelps.CalculateNorthSouthOffSet(northlatValue, tileSize, gridSize);
            CoordinateSystemHelps.westOrigin = CoordinateSystemHelps.CalculateWestEastOffSet(westLonValue, tileSize, gridSize);
        }

        public static CalculateWestEastOffSet(westLonValue, tileSize, gridSize): number {

            var halfGridSize = (gridSize / 2) | 0;
            var xAmplitud: number = 360 * gridSize * 1/tileSize;
            var xPosition: number = westLonValue + 180;

            var result: number = ((xPosition * xAmplitud) / 360) + halfGridSize;            
            //var result = (westLonValue / tileSize) * (halfGridSize) + ((westLonValue + tileSize) / tileSize) * (halfGridSize);

            return CoordinateSystemHelps.ReferToWestOrigin(Math.round(result));
        }

        public static CalculateNorthSouthOffSet(northlatValue, tileSize, gridSize): number {

            var halfGridSize = (gridSize / 2) | 0;
            var xAmplitud: number = 180 * gridSize * 1 / tileSize;
            var xPosition: number = northlatValue + 90;

            var result: number = ((xPosition * xAmplitud) / 180) + halfGridSize;
            //var result = (northlatValue / tileSize) * (halfGridSize) + ((northlatValue - tileSize) / tileSize) * (halfGridSize);

            return CoordinateSystemHelps.ReferToNorthOrigin(Math.round(result));
        }

        public static CheckLalitude(value: number, decimalPrecision: number) {
            value = +(value).toFixed(decimalPrecision) / 1;

            if (value < -90) {
                return value + 180;
            } else if (value > 90) {
                return value - 180;
            } else {
                return value;
            }
        }

        public static CheckLongitude(value: number, decimalPrecision: number) {
            value = +(value).toFixed(decimalPrecision) / 1;

            if (value < -180) {
                return value + 360;
            } else if (value > 180) {
                return value - 360;
            } else {
                return value;
            }
        }

        private static ReferToNorthOrigin(value: number): number {
            if (value > 0) {
                return value - CoordinateSystemHelps.northOrigin;
            } else {
                return CoordinateSystemHelps.northOrigin - value;
            }
        }

        private static ReferToWestOrigin(value: number): number {
            if (value > 0) {
                return value - CoordinateSystemHelps.westOrigin;
            } else {
                return CoordinateSystemHelps.westOrigin - value;
            }
        }
    }   
} 