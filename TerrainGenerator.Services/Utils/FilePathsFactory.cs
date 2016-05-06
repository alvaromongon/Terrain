using System;
using System.Configuration;
using System.Globalization;
using System.IO;
using System.Web;
using TerrainGenerator.Services.Contracts;

namespace TerrainGenerator.Services.Utils
{
    public static class FilePathsFactory
    {
        internal const string WildCardSimbol = "*";
        internal const string TileDataExtension = ".json";
        internal const string TileImageExtension = ".bmp";

        private static readonly Object LockedObject = new Object();
        private const string DataFolderName = "TerrainGeneratorData";
        private static string AppDataPath;

        internal static string BuildTileDataFilePath(string folderPath, TileMetadata tileMetadata)
        {
            return Path.Combine(folderPath, BuildTileDataFileName(tileMetadata));
        }

        internal static string BuildTileDataFileName(TileMetadata tileMetadata)
        {
            return BuildTileFileName(tileMetadata, TileDataExtension);
        }

        internal static string BuildTileImageFilePath(string folderPath, TileMetadata tileMetadata)
        {
            return Path.Combine(folderPath, BuildTileImageFileName(tileMetadata));
        }

        internal static string BuildTileImageFileName(TileMetadata tileMetadata)
        {
            return BuildTileFileName(tileMetadata, TileImageExtension);
        }

        internal static string BuildFolderPath(string folder)
        {
            var parentFolder = BuildUserAppDataFolderPath();
            return Path.Combine(parentFolder, folder);
        }

        internal static string BuildFilePath(string folder, string file)
        {
            var parentFolder = BuildFolderPath(folder);
            return Path.Combine(parentFolder, file);
        }

        internal static string BuildTempFolderPath()
        {
            return Path.GetTempPath();
        }

        internal static string BuildUserAppDataFolderPath()
        {
            if (string.IsNullOrEmpty(FilePathsFactory.AppDataPath))
            {
                lock (LockedObject)
                {
                    if (string.IsNullOrEmpty(FilePathsFactory.AppDataPath))
                    {
                        FilePathsFactory.AppDataPath = ConfigurationManager.AppSettings.Get(ConfigurationKeys.AppDataPath);

                        if (string.IsNullOrEmpty(FilePathsFactory.AppDataPath) || !Directory.Exists(FilePathsFactory.AppDataPath))
                        {
                            var appPath = Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData);

                            //HttpContext.Current.Server.MapPath("~/App_Data");
                            //var appPath = Path.GetDirectoryName(System.Reflection.Assembly.GetExecutingAssembly().GetName().CodeBase);
                            if (appPath == null) throw new ArgumentNullException("appPath");

                            FilePathsFactory.AppDataPath = Path.Combine(appPath, DataFolderName);
                        }                                              

                        if (!Directory.Exists(FilePathsFactory.AppDataPath))
                        {
                            Directory.CreateDirectory(FilePathsFactory.AppDataPath);
                        }
                    }                    
                }                               
            }
            return FilePathsFactory.AppDataPath;
        }

        private static string BuildTileFileName(TileMetadata tileMetadata, string extension)
        {
            //stream << "GS" << width << "-" << height << "_TSN" << deltaNorthCoord << "_NL" << north << "_TSW" << deltaWestCoord << "_WL" << west << extension;
            return String.Format("GS{0}-{0}_TSN{1}_NL{2}_TSW{1}_WL{3}{4}", tileMetadata.GridSize * tileMetadata.TilesMatrixSideSize, (tileMetadata.TileSize * tileMetadata.TilesMatrixSideSize).ToString("F1", CultureInfo.InvariantCulture), tileMetadata.TilePosition.NorthLalitude.ToString("F1", CultureInfo.InvariantCulture), tileMetadata.TilePosition.WestLongitude.ToString("F1", CultureInfo.InvariantCulture), extension);
        }

        internal static TilePosition BuildTilePosition(string fileName)
        {
            return new TilePosition()
            {
                NorthLalitude = decimal.Parse(fileName.Substring(fileName.IndexOf("NL", System.StringComparison.Ordinal) + 2, fileName.IndexOf("_TSW", System.StringComparison.Ordinal) - fileName.IndexOf("NL", System.StringComparison.Ordinal) - 2)),
                WestLongitude = decimal.Parse(fileName.Substring(fileName.IndexOf("WL", System.StringComparison.Ordinal) + 2, fileName.LastIndexOf(".", System.StringComparison.Ordinal) - fileName.IndexOf("WL", System.StringComparison.Ordinal) - 2))
            };
        }        
    }
}
