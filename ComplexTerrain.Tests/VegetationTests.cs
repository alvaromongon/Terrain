using System;
using System.Security.Cryptography;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using System.Linq;
using System.Runtime.InteropServices;

namespace ComplexTerrain.Tests
{
    [TestClass]
    public class VegetationTests
    {
        [DllImport("ComplexTerrain.dll", EntryPoint = "CalculateVegetationCode", CallingConvention = CallingConvention.Cdecl)]
        extern static int CalculateVegetationCode(float maximumProbability, int biome, float precipitationRate, float unScaledAltitude);

        [TestMethod]
        public void CalculateVegetation_Test()
        {
            var numberOfExecutions = 2500;

            var precipitation = 300f;
            var precipitationRate = precipitation / 500;
            var maximumProbability = (1f / 9);

            int[] results = new int[numberOfExecutions];
            for (int i = 0; i < numberOfExecutions; i++)
            {
                results[i] = CalculateVegetationCode(maximumProbability, 510, precipitationRate, 0.5f);
            }

            Assert.IsTrue(results.Any(r => r == 5));

            var numberOfPointsWithVegetation = (float)results.Where(r => r == 5).Count();

            Assert.IsTrue((numberOfPointsWithVegetation / numberOfExecutions) < maximumProbability, string.Format("Expected under {0} but was {1}", maximumProbability, numberOfPointsWithVegetation / numberOfExecutions));
        }

        [TestMethod]
        public void CalculateVegetation_Sand_Test()
        {
            var numberOfExecutions = 2500;

            var precipitation = 300f;
            var precipitationRate = precipitation / 500;
            var maximumProbability = (1f / 9);

            int[] results = new int[numberOfExecutions];
            for (int i = 0; i < numberOfExecutions; i++)
            {
                results[i] = CalculateVegetationCode(maximumProbability, 510, precipitationRate, 0.09f); //0.001f);
            }

            Assert.IsTrue(results.Any(r => r != 5));
        }

        [TestMethod]
        public void CalculateVegetation_Snow_Test()
        {
            var numberOfExecutions = 2500;

            var precipitation = 300f;
            var precipitationRate = precipitation / 500;
            var maximumProbability = (1f / 9);

            int[] results = new int[numberOfExecutions];
            for (int i = 0; i < numberOfExecutions; i++)
            {
                results[i] = CalculateVegetationCode(maximumProbability, 510, precipitationRate, 0.71f);
            }

            Assert.IsTrue(results.Any(r => r != 5));
        }

        [TestMethod]
        public void CalculateVegetation_SlopedTerrain_Test()
        {
            var numberOfExecutions = 2500;

            var precipitation = 300f;
            var precipitationRate = precipitation / 500;
            var maximumProbability = (1f / 9);

            var results = new int[numberOfExecutions];
            for (var i = 0; i < numberOfExecutions; i++)
            {
                results[i] = CalculateVegetationCode(maximumProbability, 511, precipitationRate, 0.5f);
            }

            Assert.IsTrue(results.Any(r => r != 5));
        }
    }
}
