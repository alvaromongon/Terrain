using System;
using System.Collections.Generic;
using System.Configuration;
using System.IO;
using System.Linq;
using System.Web.Script.Serialization;
using TerrainGenerator.Services.Contracts;
using TerrainGenerator.Services.Interfaces;
using TerrainGenerator.Services.Interfaces.Internals;
using TerrainGenerator.Services.Utils;

namespace TerrainGenerator.Services.Implementations.Storage
{
    internal class TilesFileStorage : BaseFileStorage, ITilesStorage
    {
        private readonly ILogger _logger;

        private readonly JavaScriptSerializer _serializer = new JavaScriptSerializer();

        public TilesFileStorage(ILogger logger) : base()
        {
            this._logger = logger;

            this.folder = ConfigurationManager.AppSettings.Get(ConfigurationKeys.TilesFolder);
            CreateDirectory();
        }

        public TileInformation LoadTileInformationFor(TileMetadata tileMetadata)
        {
            this.file = FilePathsFactory.BuildTileDataFileName(tileMetadata);
            var tilePath = this.GetFullFilePath();

            var tileInformationSerialized = string.Empty;

            using (LockFactory.AdquireLock(tilePath))
            {
                this._logger.Log("LoadTileInformationFor, " + tilePath + " tilePath locked", logLevel.Verbose);

                if (File.Exists(tilePath))
                {
                    tileInformationSerialized = File.ReadAllText(tilePath);
                }
            }

            this._logger.Log("LoadTileInformationFor, " + tilePath + " tilePath UNlocked", logLevel.Verbose);

            if (string.IsNullOrEmpty(tileInformationSerialized))
            {
                return null;
            }

            try
            {
                return _serializer.Deserialize<TileInformation>(@tileInformationSerialized);
            }
            catch (Exception)
            {
                return null;
            }
            
        }

        public void SaveTileInformation(TileInformation tileInformation, TileMetadata tileMetadata)
        {
            this.file = FilePathsFactory.BuildTileDataFileName(tileMetadata);
            var tilePath = this.GetFullFilePath();

            using (LockFactory.AdquireLock(tilePath))
            {
                File.WriteAllText(tilePath, _serializer.Serialize(tileInformation));
            }
        }

        public void SaveTileInformationIfBetter(TileInformation tileInformation, TileMetadata tileMetadata)
        {
            this.file = FilePathsFactory.BuildTileDataFileName(tileMetadata);
            var tilePath = this.GetFullFilePath();

            using (LockFactory.AdquireLock(tilePath))
            {
                if (File.Exists(tilePath))
                {
                    var existedTileInformation = _serializer.Deserialize<TileInformation>(File.ReadAllText(tilePath));

                    if (tileInformation.IsBetterThan(existedTileInformation))
                    {
                        File.WriteAllText(tilePath, _serializer.Serialize(tileInformation));
                    }
                }
                else
                {
                    File.WriteAllText(tilePath, _serializer.Serialize(tileInformation));
                }
            }
        }

        public byte[] LoadTileImageFor(TileMetadata tileMetadata)
        {
            this.file = FilePathsFactory.BuildTileImageFileName(tileMetadata);
            var imagePath = this.GetFullFilePath();

            using (LockFactory.AdquireLock(imagePath))
            {
                if (File.Exists(imagePath))
                {
                    return File.ReadAllBytes(imagePath);
                }
            }

            return null;
        }

        public void SaveTileImage(byte[] tileImage, TileMetadata tileMetadata)
        {
            this.file = FilePathsFactory.BuildTileImageFileName(tileMetadata);
            var imagePath = this.GetFullFilePath();

            using (LockFactory.AdquireLock(imagePath))
            {
                File.WriteAllBytes(imagePath, tileImage);
            }
        }

        public IList<TilePosition> GetAvailableTilePositions(decimal tileSize, int gridSize)
        {
            var tilesFolder = new DirectoryInfo(FilePathsFactory.BuildFolderPath(this.folder));

            var tileFiles = tilesFolder.GetFiles(FilePathsFactory.WildCardSimbol + FilePathsFactory.TileDataExtension);

            return tileFiles.Select(tileFile => FilePathsFactory.BuildTilePosition(tileFile.Name)).ToList();
        }               
    }
}
