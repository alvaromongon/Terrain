using System.Configuration;
using TerrainGenerator.Services.Contracts;
using TerrainGenerator.Services.Interfaces;

namespace TerrainGenerator.Services.Implementations
{
    internal class ExistingTilesPositionService : IPositionService
    {
        private readonly ITilesStorage _tilesStorage;
        private readonly ITilesManager _tilesManager;

        public ExistingTilesPositionService(ITilesStorage tilesStorage, ITilesManager tilesManager)
        {
            _tilesStorage = tilesStorage;
            _tilesManager = tilesManager;
        }

        public TilePosition GetInitialPosition(decimal tileSize, int gridSize)
        {
            // Read list of available files tiles
            var availableTilePositions = _tilesStorage.GetAvailableTilePositions(tileSize, gridSize);

            if (availableTilePositions == null || availableTilePositions.Count == 0)
            {
                throw new ConfigurationErrorsException(string.Format("There is not available tiles for the given configuration, tilesize: {0} and gridSize: {1}", gridSize, tileSize));
            }

            foreach (var availableTilePosition in availableTilePositions)
            {
                var tileData = this._tilesManager.GetTileDataFor(new TileMetadata
                {
                    TilePosition = availableTilePosition,
                    GridSize = gridSize,
                    TileSize = tileSize,
                    TilesMatrixSideSize = 1 //only one tile
                });

                if (tileData[(gridSize*gridSize)/2].a > 0)
                {
                    return availableTilePosition;
                }                
            }

            throw new ConfigurationErrorsException(string.Format("None of the available tiles has a center point over the sea level for the given configuration, tilesize: {0} and gridSize: {1}", gridSize, tileSize));
        }
    }
}
