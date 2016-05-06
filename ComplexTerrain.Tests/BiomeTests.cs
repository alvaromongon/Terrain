using System;
using System.Runtime.InteropServices;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace ComplexTerrain.Tests
{
    [TestClass]
    public class BiomeTests
    {
        [DllImport("ComplexTerrain.dll", EntryPoint = "CalculateTemperature", CallingConvention = CallingConvention.Cdecl)]
        extern static float CalculateTemperature(float latitude, float altitude);

        [DllImport("ComplexTerrain.dll", EntryPoint = "CalculatePrecipitation", CallingConvention = CallingConvention.Cdecl)]
        extern static float CalculatePrecipitation(float latitude, float altitude);

        [DllImport("ComplexTerrain.dll", EntryPoint = "CalculateBiomeCode", CallingConvention = CallingConvention.Cdecl)]
        extern static int CalculateBiomeCode(float temperature, float precipitation, float slope);

        [TestMethod]
        public void CalculateTemperature_Latitude_Tests()
        {
            Assert.AreEqual(27, Math.Round(CalculateTemperature(0, 0), 2, MidpointRounding.ToEven));
            Assert.AreEqual(13.5, Math.Round(CalculateTemperature(50, 0), 2, MidpointRounding.ToEven));
            Assert.AreEqual(13.5, Math.Round(CalculateTemperature(-50, 0), 2, MidpointRounding.ToEven));
        }

        [TestMethod]
        public void CalculateTemperature_Altitude_Tests()
        {
            Assert.AreEqual(26.35, Math.Round(CalculateTemperature(0, 100), 2, MidpointRounding.ToEven));
            Assert.AreEqual(20.5, Math.Round(CalculateTemperature(0, 1000), 2, MidpointRounding.ToEven));
        }

        [TestMethod]
        public void CalculatePrecipitation_Latitude__ZeroToThirty_Tests()
        {
            Assert.AreEqual(400, Math.Round(CalculatePrecipitation(0, 0), 2, MidpointRounding.ToEven));

            Assert.AreEqual(133.33, Math.Round(CalculatePrecipitation(20, 0), 2, MidpointRounding.ToEven));
            Assert.AreEqual(133.33, Math.Round(CalculatePrecipitation(20, 0), 2, MidpointRounding.ToEven));

            Assert.AreEqual(0, Math.Round(CalculatePrecipitation(30, 0), 2, MidpointRounding.ToEven));
            Assert.AreEqual(0, Math.Round(CalculatePrecipitation(-30, 0), 2, MidpointRounding.ToEven));
        }

        [TestMethod]
        public void CalculatePrecipitation_Latitude_ThirtyToFiftyFive_Tests()
        {
            Assert.AreEqual(120, Math.Round(CalculatePrecipitation(45, 0), 2, MidpointRounding.ToEven));
            Assert.AreEqual(120, Math.Round(CalculatePrecipitation(-45, 0), 2, MidpointRounding.ToEven));

            Assert.AreEqual(200, Math.Round(CalculatePrecipitation(55, 0), 2, MidpointRounding.ToEven));
            Assert.AreEqual(200, Math.Round(CalculatePrecipitation(-55, 0), 2, MidpointRounding.ToEven));
        }

        [TestMethod]
        public void CalculatePrecipitation_Latitude_FiftyFiveToNinety_Tests()
        {
            Assert.AreEqual(130.75, Math.Round(CalculatePrecipitation(65, 0), 2, MidpointRounding.ToEven));
            Assert.AreEqual(130.75, Math.Round(CalculatePrecipitation(-65, 0), 2, MidpointRounding.ToEven));

            Assert.AreEqual(5, Math.Round(CalculatePrecipitation(90, 0), 2, MidpointRounding.ToEven));
            Assert.AreEqual(5, Math.Round(CalculatePrecipitation(-90, 0), 2, MidpointRounding.ToEven));
        }

        [TestMethod]
        [Ignore]
        public void CalculatePrecipitation_Altitude_Tests()
        {
        }

        [TestMethod]
        public void CalculateBiomeCode_Temperature_Tests()
        {
            Assert.AreEqual(100, CalculateBiomeCode(-25, 0, 0));
            Assert.AreEqual(100, CalculateBiomeCode(-20, 0, 0));
            Assert.AreEqual(100, CalculateBiomeCode(-15, 0, 0));
            Assert.AreEqual(110, CalculateBiomeCode(-10, 0, 0));
            Assert.AreEqual(600, CalculateBiomeCode(-5, 0, 0));
            Assert.AreEqual(600, CalculateBiomeCode(0, 0, 0));
            Assert.AreEqual(600, CalculateBiomeCode(5, 0, 0));
            Assert.AreEqual(600, CalculateBiomeCode(10, 0, 0));
            Assert.AreEqual(600, CalculateBiomeCode(15, 0, 0));
            Assert.AreEqual(600, CalculateBiomeCode(20, 0, 0));
            Assert.AreEqual(600, CalculateBiomeCode(25, 0, 0));
            Assert.AreEqual(600, CalculateBiomeCode(30, 0, 0));
            Assert.AreEqual(600, CalculateBiomeCode(35, 0, 0));
        }

        [TestMethod]
        public void CalculateBiomeCode_Precipitation_Tests()
        {
            Assert.AreEqual(600, CalculateBiomeCode(0, 0, 0));
            Assert.AreEqual(300, CalculateBiomeCode(0, 50, 0));
            Assert.AreEqual(200, CalculateBiomeCode(0, 100, 0));
            Assert.AreEqual(200, CalculateBiomeCode(0, 150, 0));
            Assert.AreEqual(400, CalculateBiomeCode(0, 200, 0));
            Assert.AreEqual(410, CalculateBiomeCode(0, 250, 0));
            Assert.AreEqual(410, CalculateBiomeCode(0, 300, 0));
            Assert.AreEqual(510, CalculateBiomeCode(0, 350, 0));
            Assert.AreEqual(510, CalculateBiomeCode(0, 400, 0));
            Assert.AreEqual(510, CalculateBiomeCode(0, 450, 0));
            Assert.AreEqual(510, CalculateBiomeCode(0, 500, 0));
        }

        [TestMethod]
        public void CalculateBiomeCode_Slope_Tests()
        {
            Assert.AreEqual(100, CalculateBiomeCode(-25, 0, 0));
            Assert.AreEqual(100, CalculateBiomeCode(-25, 0, 0.022f));
            Assert.AreEqual(101, CalculateBiomeCode(-25, 0, 0.026f));
            Assert.AreEqual(101, CalculateBiomeCode(-25, 0, 0.58f));
        }
    }
}
