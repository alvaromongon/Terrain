using System.Collections.Generic;
using System.Drawing;
using TerrainGenerator.Services.Contracts;
using TerrainGenerator.Services.Interfaces.Internals;
using TerrainGenerator.Services.Utils;

namespace TerrainGenerator.Services.Implementations
{
    public class MapColorGeneratorService : IMapColorGeneratorService
    {
        private const double SHELF_LEVEL = -0.375;
        private readonly IList<ColorGradientPoint> _gradientPoints;

        public MapColorGeneratorService()
        {
            _gradientPoints = new List<ColorGradientPoint>
            {
                new ColorGradientPoint() {point = -1.0, color = Color.FromArgb(255, 3, 29, 63)},
                new ColorGradientPoint() {point = SHELF_LEVEL, color = Color.FromArgb(255, 3, 29, 63)},
                new ColorGradientPoint() {point = -0.0001, color = Color.FromArgb(255, 7, 106, 127)},
                new ColorGradientPoint() {point = 0.0, color = Color.FromArgb(255, 62, 86, 30)},
                new ColorGradientPoint() {point = 0.125, color = Color.FromArgb(255, 84, 96, 50)},
                new ColorGradientPoint() {point = 0.25, color = Color.FromArgb(255, 130, 127, 97)},
                new ColorGradientPoint() {point = 0.375, color = Color.FromArgb(255, 184, 163, 141)},
                new ColorGradientPoint() {point = 0.5, color = Color.FromArgb(255, 255, 255, 255)},
                new ColorGradientPoint() {point = 0.75, color = Color.FromArgb(255, 128, 255, 255)},
                new ColorGradientPoint() {point = 1.0, color = Color.FromArgb(255, 0, 0, 255)}
            };
        }

        public Color GetColor(CellStruct cell)
        {
            //This will work for rivers
            var position = cell.t < -100 ? -0.0001 : cell.a;

            // Find the first element in the gradient point array that has a gradient
            // position larger than the gradient position passed to this method.
            int indexPos;
            for (indexPos = 0; indexPos < _gradientPoints.Count; indexPos++)
            {
                if (position < _gradientPoints[indexPos].point)
                {
                    break;
                }
            }

            // Find the two nearest gradient points so that we can perform linear
            // interpolation on the color.
            var index0 = indexPos > 0 ? indexPos - 1 : 0;
            var index1 = indexPos;

            // If some gradient points are missing (which occurs if the gradient
            // position passed to this method is greater than the largest gradient
            // position or less than the smallest gradient position in the array), get
            // the corresponding gradient color of the nearest gradient point and exit
            // now.
            if (index0 == index1)
            {
                return _gradientPoints[indexPos].color;
            }

            // Compute the alpha value used for linear interpolation.
            var input0 = _gradientPoints[index0].point;
            var input1 = _gradientPoints[index1].point;
            var alpha = (position - input0) / (input1 - input0);

            // Now perform the linear interpolation given the alpha value.
            var color0 = _gradientPoints[index0].color;
            var color1 = _gradientPoints[index1].color;
            return LinearInterpColor(color0, color1, (float) alpha);
        }

        // Performs linear interpolation between two colors and stores the result
        // in out.
        private static Color LinearInterpColor(Color color0, Color color1, float alpha)
        {
            return ColorInterpolator.InterpolateBetween(color0, color1, alpha);
        }
    }
}
