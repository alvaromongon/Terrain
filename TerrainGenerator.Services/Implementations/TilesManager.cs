using System;
using System.Configuration;
using System.Data;
using System.Drawing;
using System.IO;
using TerrainGenerator.Services.Contracts;
using TerrainGenerator.Services.Interfaces;
using TerrainGenerator.Services.Interfaces.Internals;
using TerrainGenerator.Services.Utils;

namespace TerrainGenerator.Services
{
    internal class TilesManager : ITilesManager
    {
        private readonly ITilesGeneratorService _tilesGenerator;
        private readonly ITileAdjustmentService _tileAdjustment;
        private readonly ITilesStorage _tilesStorage;
        private readonly IMapColorGeneratorService _mapColorGeneratorService;

        public TilesManager(ITilesGeneratorService tilesGenerator, ITileAdjustmentService tileAdjustment, ITilesStorage tilesStorage, IMapColorGeneratorService mapColorGeneratorService)
         {
             _tilesGenerator = tilesGenerator;
             _tileAdjustment = tileAdjustment;
             _tilesStorage = tilesStorage;
            _mapColorGeneratorService = mapColorGeneratorService;
         }

        public CellStruct[] GetTileDataFor(TileMetadata tileMetadata)
        {
            return this.GetTileInformationFor(tileMetadata).Grid;
        }

        public byte[] GetTileImageFor(TileMetadata tileMetadata)
        {
            var image = _tilesStorage.LoadTileImageFor(tileMetadata);

            if (image != null)
            {
                return image;
            }

            if (!_tilesGenerator.GenerateTileImageFor(tileMetadata)) //this.GenerateTileImageFor(tileMetadata))
            {
                throw new InvalidDataException("Expected a valid tile image file generated but returned fail");
            }

            image = _tilesStorage.LoadTileImageFor(tileMetadata);

            if (image == null)
            {
                throw new InvalidDataException("Expected a valid tile image file generated but could not be found in storage");
            }

            return image;
        }

        public CellStruct GetCellDataFor(TileMetadata tileMetadata, int index)
        {
            var tileData = this.GetTileDataFor(tileMetadata);

            if (tileData.Length <= index)
            {
                throw  new ArgumentException("Index cannot be bigger than length of tile data", "index");
            }

            return new CellStruct() {a = tileData[index].a, c = tileData[index].c, t = tileData[index].t};
        }

        public void SetCellDataFor(TileMetadata tileMetadata, int index, CellStruct cellStruct)
        {
            if (!bool.Parse(ConfigurationManager.AppSettings.Get(ConfigurationKeys.UserModificationRemains))) 
                return;
            
            var tileInformation = this.GetTileInformationFor(tileMetadata);

            if (tileInformation.Grid.Length <= index)
            {
                throw new ArgumentException("Index cannot be bigger than length of tile data", "index");
            }

            tileInformation.Grid[index].a = cellStruct.a;
            tileInformation.Grid[index].t = cellStruct.t;
            tileInformation.Grid[index].c = cellStruct.c;

            _tilesStorage.SaveTileInformation(tileInformation, tileMetadata);
        }

        private TileInformation GetTileInformationFor(TileMetadata tileMetadata)
        {
            var tileInformation = _tilesStorage.LoadTileInformationFor(tileMetadata);

            if (tileInformation == null)
            {
                if (!_tilesGenerator.GenerateTileDataFor(tileMetadata))
                {
                    throw new InvalidDataException("Expected a valid tile data file generated but returned fail");
                }

                tileInformation = _tilesStorage.LoadTileInformationFor(tileMetadata);

                if (tileInformation == null)
                {
                    throw new InvalidDataException("Expected a valid tile data file generated but could not be found in storage");
                }
            }

            if (tileInformation.IsfinishedAdjustement)
            {
                return tileInformation;
            }

            AdjustTileBorders(ref tileInformation, tileMetadata);

            _tilesStorage.SaveTileInformationIfBetter(tileInformation, tileMetadata);

            return tileInformation;
        }

        private void AdjustTileBorders(ref TileInformation tileInformation, TileMetadata tileMetadata)
        {
            //TODO Refactor this method, is huge!

            TileInformation northTile = null;
            TileMetadata northMetadata = null;
            if (!tileInformation.IsNorthAdjusted)
            {                
                northMetadata = new TileMetadata
                {
                    GridSize = tileMetadata.GridSize,
                    TileSize = tileMetadata.TileSize,
                    TilePosition = new TilePosition
                    {
                        NorthLalitude = tileMetadata.TilePosition.NorthLalitude + tileMetadata.TileSize,
                        WestLongitude = tileMetadata.TilePosition.WestLongitude
                    },
                    TilesMatrixSideSize = 1 //only one tile
                };
                northTile = _tilesStorage.LoadTileInformationFor(northMetadata);
                if (northTile != null && northTile.IsSouthAdjusted)
                {
                    northTile = null;
                }
            }

            TileInformation southTile = null;
            TileMetadata southMetadata = null;
            if (!tileInformation.IsSouthAdjusted)
            {                
                southMetadata = new TileMetadata
                {
                    GridSize = tileMetadata.GridSize,
                    TileSize = tileMetadata.TileSize,
                    TilePosition = new TilePosition
                    {
                        NorthLalitude = tileMetadata.TilePosition.NorthLalitude - tileMetadata.TileSize,
                        WestLongitude = tileMetadata.TilePosition.WestLongitude
                    },
                    TilesMatrixSideSize = 1 //only one tile
                };
                southTile = _tilesStorage.LoadTileInformationFor(southMetadata);
                if (southTile !=null && southTile.IsNorthAdjusted)
                {
                    southTile = null;
                }
            }

            TileInformation westTile = null;
            TileMetadata westMetadata = null;
            if (!tileInformation.IsWestAdjusted)
            {                
                westMetadata = new TileMetadata
                {
                    GridSize = tileMetadata.GridSize,
                    TileSize = tileMetadata.TileSize,
                    TilePosition = new TilePosition
                    {
                        NorthLalitude = tileMetadata.TilePosition.NorthLalitude,
                        WestLongitude = tileMetadata.TilePosition.WestLongitude - tileMetadata.TileSize
                    },
                    TilesMatrixSideSize = 1 //only one tile
                };
                westTile = _tilesStorage.LoadTileInformationFor(westMetadata);
                if (westTile != null && westTile.IsEastAdjusted)
                {
                    westTile = null;
                }
            }

            TileInformation eastTile = null;
            TileMetadata eastMetadata = null;
            if (!tileInformation.IsEastAdjusted)
            {                
                eastMetadata = new TileMetadata
                {
                    GridSize = tileMetadata.GridSize,
                    TileSize = tileMetadata.TileSize,
                    TilePosition = new TilePosition
                    {
                        NorthLalitude = tileMetadata.TilePosition.NorthLalitude,
                        WestLongitude = tileMetadata.TilePosition.WestLongitude + tileMetadata.TileSize
                    },
                    TilesMatrixSideSize = 1 //only one tile
                };
                eastTile = _tilesStorage.LoadTileInformationFor(eastMetadata);
                if (eastTile != null && eastTile.IsWestAdjusted)
                {
                    eastTile = null;
                }
            }

            if (northTile == null && southTile == null && westTile == null && eastTile == null)
            {
                return;
            }

            _tileAdjustment.AdjustBorders(ref tileInformation, northTile, southTile, westTile, eastTile);

            if (northTile != null)
            {
                northTile.IsSouthAdjusted = true;
                _tilesStorage.SaveTileInformationIfBetter(northTile, northMetadata);
            }

            if (southTile != null)
            {
                southTile.IsNorthAdjusted = true;
                _tilesStorage.SaveTileInformationIfBetter(southTile, southMetadata);
            }

            if (westTile != null)
            {
                westTile.IsEastAdjusted = true;
                _tilesStorage.SaveTileInformationIfBetter(westTile, westMetadata);
            }

            if (eastTile != null)
            {
                eastTile.IsWestAdjusted = true;
                _tilesStorage.SaveTileInformationIfBetter(eastTile, eastMetadata);
            }
        }


        /// <summary>
        /// This method uses the json files to generate a bmp on the file with c# code
        /// REFACTOR THIS HORRIBLE CODE!
        /// </summary>
        /// <param name="tileMetadata"></param>
        /// <returns></returns>
        private bool GenerateTileImageFor(TileMetadata tileMetadata)
        {
            var folder = ConfigurationManager.AppSettings.Get(ConfigurationKeys.TilesFolder);
            var dataFolder = @FilePathsFactory.BuildFolderPath(folder) + @"\";
            var tileFilePath = FilePathsFactory.BuildTileImageFilePath(dataFolder, tileMetadata);

            using (LockFactory.AdquireLock(tileFilePath)) //Ensure only one thread build a given tile
            {
                if (!File.Exists(tileFilePath))
                {
                    var south = tileMetadata.TilePosition.NorthLalitude - (tileMetadata.TileSize * tileMetadata.TilesMatrixSideSize);
                    var east = tileMetadata.TilePosition.WestLongitude + (tileMetadata.TileSize * tileMetadata.TilesMatrixSideSize);

                    var map = new Bitmap(tileMetadata.GridSize * tileMetadata.TilesMatrixSideSize, tileMetadata.GridSize * tileMetadata.TilesMatrixSideSize);
                    
                    var northSouthCounter = 0;
                    for (var north = tileMetadata.TilePosition.NorthLalitude; north > south; )
                    {
                        var westEastCounter = 0;
                        for (var west = tileMetadata.TilePosition.WestLongitude; west < east; )
                        {
                            var tileData =
                                this.GetTileDataFor(new TileMetadata()
                                {
                                    GridSize = tileMetadata.GridSize,
                                    TileSize = tileMetadata.TileSize,
                                    TilePosition = new TilePosition() { NorthLalitude = north, WestLongitude = west },
                                    TilesMatrixSideSize = 1 //Just one tile
                                });

                            var rowCounter = 0;
                            for (var y = northSouthCounter * tileMetadata.GridSize;y < (northSouthCounter * tileMetadata.GridSize) + tileMetadata.GridSize; ++y)
                            {
                                var columnCounter = 0;
                                for (var x = westEastCounter * tileMetadata.GridSize; x < (westEastCounter * tileMetadata.GridSize) + tileMetadata.GridSize; ++x)
                                {
                                    map.SetPixel(x, y, _mapColorGeneratorService.GetColor(tileData[(rowCounter * tileMetadata.GridSize) + columnCounter]));
                                    
                                    columnCounter++;
                                }
                                rowCounter++;
                            }

                            west = west + tileMetadata.TileSize;
                            westEastCounter++;
                        }

                        north = north - tileMetadata.TileSize;
                        northSouthCounter++;
                    }

                    map.Save(tileFilePath);
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
