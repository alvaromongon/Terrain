using System.Collections.Generic;
using TerrainGenerator.Services.Contracts;

namespace TerrainGenerator.Services.Interfaces
{
    interface ITilesStorage
    {
        TileInformation LoadTileInformationFor(TileMetadata tileMetadata);
        void SaveTileInformation(TileInformation tileInformation, TileMetadata tileMetadata);
        void SaveTileInformationIfBetter(TileInformation tileInformation, TileMetadata tileMetadata);
        byte[] LoadTileImageFor(TileMetadata tileMetadata);
        void SaveTileImage(byte[] tileImage, TileMetadata tileMetadata);
        IList<TilePosition> GetAvailableTilePositions(decimal tileSize, int gridSize);
    }

}
