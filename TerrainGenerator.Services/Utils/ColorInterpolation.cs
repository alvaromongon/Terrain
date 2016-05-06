using System;
using System.Drawing;

namespace TerrainGenerator.Services.Utils
{
    internal static class ColorInterpolator
    {
        delegate byte ComponentSelector(Color color);
        static ComponentSelector _redSelector = color => color.R;
        static ComponentSelector _greenSelector = color => color.G;
        static ComponentSelector _blueSelector = color => color.B;
        //static ComponentSelector _alphaSelector = color => color.A;

        public static Color InterpolateBetween(Color endPoint1, Color endPoint2, double lambda)
        {
            if (lambda < 0 || lambda > 1)
            {
                throw new ArgumentOutOfRangeException("lambda");
            }
            var color = Color.FromArgb(
                endPoint1.A,
                InterpolateComponent(endPoint1, endPoint2, lambda, _redSelector),
                InterpolateComponent(endPoint1, endPoint2, lambda, _greenSelector),
                InterpolateComponent(endPoint1, endPoint2, lambda, _blueSelector));

            return color;
        }

        static byte InterpolateComponent(Color endPoint1, Color endPoint2, double lambda, ComponentSelector selector)
        {
            return (byte)(selector(endPoint1) + (selector(endPoint2) - selector(endPoint1)) * lambda);
        }
    }
}
