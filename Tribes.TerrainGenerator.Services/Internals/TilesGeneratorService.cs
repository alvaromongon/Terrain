using System.IO;
using System.Runtime.InteropServices;

namespace Tribes.TerrainGenerator.Services.Internals
{
    internal class TilesGeneratorService : ITilesGeneratorService
    {
        [DllImport("ComplexTerrain.dll", EntryPoint = "SetBaseDirectory", CallingConvention = CallingConvention.Cdecl)]
        extern static void SetBaseDirectory(string absolutePathDirectory);

        [DllImport("ComplexTerrain.dll", EntryPoint = "BuildImagePlanetFiles", CallingConvention = CallingConvention.Cdecl)]
        extern static int BuildImagePlanetFiles(float northCoord, float westCoord, int widthTileSize, int heightTileSize, float deltaNorthCoord, float deltaWestCoord, int width, int height, string destinyDirectory);

        [DllImport("ComplexTerrain.dll", EntryPoint = "BuildDataPlanetFiles", CallingConvention = CallingConvention.Cdecl)]
        extern static int BuildDataPlanetFiles(float northCoord, float westCoord, int widthTileSize, int heightTileSize, float deltaNorthCoord, float deltaWestCoord, int width, int height, string destinyDirectory);

        private readonly string tilesFolder;

        internal TilesGeneratorService()
        {
            var folder = ConfigurationManager.AppSettings.Get(ConfigurationKeys.TilesFolder);
            tilesFolder = @FilePathsFactory.BuildFolderPath(folder) + @"\";

            SetBaseDirectory(@FilePathsFactory.BuildUserAppDataFolderPath() + @"\");
        }

        public bool GenerateTileDataFor(TileMetadata tileMetadata)
        {              
            var tileFilePath = FilePathsFactory.BuildTileDataFilePath(tilesFolder, tileMetadata);

            using (LockFactory.AdquireLock(tileFilePath)) //Ensure only one thread build a given tile
            {
                if (!File.Exists(tileFilePath))
                {
                    BuildDataPlanetFiles((float)tileMetadata.TilePosition.NorthLalitude, (float)tileMetadata.TilePosition.WestLongitude, 1, 1, (float)tileMetadata.TileSize * tileMetadata.TilesMatrixSideSize, (float)tileMetadata.TileSize * tileMetadata.TilesMatrixSideSize, tileMetadata.GridSize * tileMetadata.TilesMatrixSideSize, tileMetadata.GridSize * tileMetadata.TilesMatrixSideSize, tilesFolder);
                }

                if (File.Exists(tileFilePath))
                {
                    return true;
                }
            }

            return false;
        }

        /// <summary>
        /// This method uses the c++ code to generate the image. Producing some missmatch
        /// </summary>
        /// <param name="tileMetadata"></param>
        /// <returns></returns>
        public bool GenerateTileImageFor(TileMetadata tileMetadata)
        {
            var tileFilePath = FilePathsFactory.BuildTileImageFilePath(tilesFolder, tileMetadata);

            using (LockFactory.AdquireLock(tileFilePath)) //Ensure only one thread build a given tile
            {
                if (!File.Exists(tileFilePath))
                {
                    BuildImagePlanetFiles((float)tileMetadata.TilePosition.NorthLalitude, (float)tileMetadata.TilePosition.WestLongitude, 1, 1, (float)tileMetadata.TileSize * tileMetadata.TilesMatrixSideSize, (float)tileMetadata.TileSize * tileMetadata.TilesMatrixSideSize, tileMetadata.GridSize * tileMetadata.TilesMatrixSideSize, tileMetadata.GridSize * tileMetadata.TilesMatrixSideSize, tilesFolder);
                }

                if (File.Exists(tileFilePath))
                {
                    return true;
                }
            }

            return false;
        }
    }
}
