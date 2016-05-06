using System;
using System.Linq;
using System.Runtime.InteropServices;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace ComplexTerrain.Tests
{
    [TestClass]
    public class SlopeTests
    {
        [DllImport("ComplexTerrain.dll", EntryPoint = "CalculateSlope", CallingConvention = CallingConvention.Cdecl)]
        extern static double CalculateSlope(float[] elevationPreviousLine, float[] elevationCurrentLine, float[] elevationNextLine, int columnCounter, int columnNumber);

        [TestMethod]
        public void CalculateSlope_Tests()
        {
            var result = CalculateSlope(GridPrevious, GridCurrent, GridNext, 0, GridCurrent.Count());

            Assert.AreEqual(0.4146, Math.Round(result, 4));
        }

        private static readonly float[] GridPrevious = { 0.216705f, 0.234455f, 0.236646f };
        private static readonly float[] GridCurrent = { 0.279152f, 0.282847f, 0.281707f };
        private static readonly float[] GridNext = { 0.390189f, 0.39489f, 0.40779f };
    }
}
