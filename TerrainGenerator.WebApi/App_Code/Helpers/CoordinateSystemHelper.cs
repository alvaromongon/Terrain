
namespace TerrainGenerator.WebApi
{
    internal static class CoordinateSystemHelper
    {
        public static decimal CheckLalitude(decimal value) 
        {
            if (value < -90) {
                return value + 180;
            } else if (value > 90) {
                return value - 180;
            } else {
                return value;
            }
        }

        public static decimal CheckLongitude(decimal value)
        {
            if (value < -180) {
                return value + 360;
            } else if (value > 180) {
                return value - 360;
            } else {
                return value;
            }
        }
    }
}