using System.Linq;
using System.Runtime.InteropServices;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace ComplexTerrain.Tests
{
    [TestClass]
    public class RiverFloodingTests
    {
        [DllImport("ComplexTerrain.dll", EntryPoint = "NumberOfSurrounderRivers", CallingConvention = CallingConvention.Cdecl)]
        extern static int NumberOfSurrounderRivers(float[] elevationPreviousLine, float[] elevationCurrentLine, float[] elevationNextLine, int columnCounter, int columnNumber);

        [DllImport("ComplexTerrain.dll", EntryPoint = "MinTerrainAltitudeOfSurrounderRivers",
            CallingConvention = CallingConvention.Cdecl)]
        private static extern float MinTerrainAltitudeOfSurrounderRivers(float[] elevationRiverPreviousLine, float[] elevationRiverCurrentLine, float[] elevationRiverNextLine, float[] elevationPreviousLine, float[] elevationCurrentLine, float[] elevationNextLine, int columnCounter, int columnNumber);

        [TestMethod]
        public void NumberOfSurrounderRivers_Tests()
        {
            var result = NumberOfSurrounderRivers(GridPrevious, GridCurrent, GridNext, 0, GridCurrent.Count());

            Assert.IsTrue(result == 3);
        }

        [TestMethod]
        public void MinTerrainAltitudeOfSurrounderRivers_Tests()
        {
            var result = MinTerrainAltitudeOfSurrounderRivers(GridRiverPrevious, GridRiverCurrent, GridRiverNext, GridPrevious, GridCurrent, GridNext, 0, GridCurrent.Count());

            Assert.IsTrue(result == 0.216705f);
        }

        private static readonly float[] GridPrevious = { 0.216705f, 0.234455f, 0.236646f };
        private static readonly float[] GridCurrent = { 0.216705f, 0.234455f, 0.236646f };
        private static readonly float[] GridNext = { 0.216705f, 0.234455f, 0.236646f };

        private static readonly float[] GridRiverPrevious = { 0.216705f, -0.234455f, 0.236646f };
        private static readonly float[] GridRiverCurrent = { 0.216705f, 0.234455f, 0.236646f };
        private static readonly float[] GridRiverNext = { -0.216705f, -0.234455f, 0.236646f };
    }
}
