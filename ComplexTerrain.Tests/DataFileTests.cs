using System.IO;
using System.Runtime.InteropServices;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace ComplexTerrain.Tests
{
    [TestClass]
    public class DataFileTests
    {
        [DllImport("ComplexTerrain.dll", EntryPoint = "SetBaseDirectory", CallingConvention = CallingConvention.Cdecl)]
        extern static void SetBaseDirectory(string absolutePathDirectory);

        [DllImport("ComplexTerrain.dll", EntryPoint = "BuildDataPlanetFiles", CallingConvention = CallingConvention.Cdecl)]
        extern static int BuildDataPlanetFiles(float northCoord, float westCoord, int widthTileSize, int heightTileSize, float deltaNorthCoord, float deltaWestCoord, int width, int height, string destinyDirectory);

        [TestMethod]
        public void BuildDataFile_Test()
        {
            // Complete
            //float northCoord = 90;
            //float westCoord = -180;
            //int width = 1000;
            //int height = 1000;
            //int widthTileSize = 1;
            //int heightTileSize = 1;
            //float deltaNorthCoord = 180;
            //float deltaWestCoord = 270;

            // Big Island
            //float northCoord = 2.5f;
            //int height = 1000;
            //int heightTileSize = 1;
            //float westCoord = -5.5f;
            //int width = 1000;            
            //int widthTileSize = 1;            
            //float deltaNorthCoord = 4;
            //float deltaWestCoord = 4.8f;
            //BuildDataPlanetFiles(northCoord, westCoord, widthTileSize, heightTileSize, deltaNorthCoord, deltaWestCoord, width, height, @"C:\Users\ealvmon\Desktop\river tests\");            

            //// Small Island
            //float northCoord = 1.2f;
            //int height = 150 * 7;
            //int heightTileSize = 1;
            //float westCoord = -0.5f;
            //int width = 150 * 7;
            //int widthTileSize = 1;
            //float deltaNorthCoord = 0.7f;
            //float deltaWestCoord = 0.7f;
            //BuildDataPlanetFiles(northCoord, westCoord, widthTileSize, heightTileSize, deltaNorthCoord, deltaWestCoord, width, height, @"C:\Users\ealvmon\Desktop\river tests\");            

            //float northCoord = 1.1f;
            //int height = 150 * 3;
            //int heightTileSize = 1;
            //float westCoord = -0.3f;
            //int width = 150 * 3;
            //int widthTileSize = 1;
            //float deltaNorthCoord = 0.3f;
            //float deltaWestCoord = 0.3f;
            //BuildDataPlanetFiles(northCoord, westCoord, widthTileSize, heightTileSize, deltaNorthCoord, deltaWestCoord, width, height, @"C:\Users\ealvmon\Desktop\river tests\");            

            float northCoord = 1.1f;
            int height = 150 * 1;
            int heightTileSize = 1;
            float westCoord = -0.2f;
            int width = 150 * 1;
            int widthTileSize = 1;
            float deltaNorthCoord = 0.1f;
            float deltaWestCoord = 0.1f;
            BuildDataPlanetFiles(northCoord, westCoord, widthTileSize, heightTileSize, deltaNorthCoord, deltaWestCoord, width, height, @"C:\Users\ealvmon\Desktop\river tests\");
        }

        [TestMethod]
        public void BuildMultipleDataFiles_Test()
        {
            ////Small Island
            //float northCoord = 1.2F;
            //int heightTileSize = 7;
            //float westCoord = -0.5F;
            //int widthTileSize = 7;
            //float deltaNorthCoord = 0.1F;
            //float deltaWestCoord = 0.1F;
            //int sizeMultiplier = 1;
            //BuildDataPlanetFiles(northCoord, westCoord, widthTileSize, heightTileSize, deltaNorthCoord, deltaWestCoord, 150 * sizeMultiplier, 150 * sizeMultiplier, @"C:\Users\ealvmon\Desktop\river tests\GS1050-1050_TSN0.7_NL1.2_TSW0.7_WL-0.5\");
            //BuildDataPlanetFiles(northCoord, westCoord, widthTileSize, heightTileSize, deltaNorthCoord, deltaWestCoord, 150 * sizeMultiplier, 150 * sizeMultiplier, @"C:\Personal\TerrainGeneratorTS\TerrainGenerator.WebApi\App_Data\Tiles\");

            float northCoord = 1.1F;
            int heightTileSize = 3;
            float westCoord = -0.3F;
            int widthTileSize = 3;
            float deltaNorthCoord = 0.1F;
            float deltaWestCoord = 0.1F;
            int sizeMultiplier = 1;
            BuildDataPlanetFiles(northCoord, westCoord, widthTileSize, heightTileSize, deltaNorthCoord, deltaWestCoord, 150 * sizeMultiplier, 150 * sizeMultiplier, @"C:\Users\ealvmon\Desktop\river tests\");            
        }
    }
}