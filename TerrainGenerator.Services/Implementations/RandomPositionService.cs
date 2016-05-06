using System;
using TerrainGenerator.Services.Contracts;

namespace TerrainGenerator.Services
{
    internal class RandomPositionService : IPositionService
    {
        private readonly ITilesManager _tilesManager;

        public RandomPositionService(ITilesManager tilesManager)
        {
            this._tilesManager = tilesManager;
        }

        public TilePosition GetInitialPosition(decimal tileSize, int gridSize)
        {
            while (true)
            {
                var random = new Random();
                int count = BitConverter.GetBytes(decimal.GetBits(tileSize)[3])[2];

                var multiplier = 1;
                for (var i = 0; i < count; i++)
                {
                    multiplier *= 10;
                }

                //TODO: for now this only generate values between 0 and 10
                var tilePosition = new TilePosition()
                {
                    NorthLalitude = (decimal)(Math.Truncate(multiplier * random.NextDouble() * 10) / multiplier),
                    WestLongitude = (decimal)(Math.Truncate(multiplier * random.NextDouble() * 10) / multiplier)
                };

                var tileData = this._tilesManager.GetTileDataFor(new TileMetadata
                {
                    TilePosition = tilePosition, GridSize = gridSize, TileSize = tileSize, TilesMatrixSideSize = 1 //only one tile
                });

                if (tileData[(int) (gridSize*gridSize)/2].a < 0) continue;

                return tilePosition;
            }
        }
    }
}
