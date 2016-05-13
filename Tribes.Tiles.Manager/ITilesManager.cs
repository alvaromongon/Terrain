﻿namespace Tribes.TerrainGenerator.Storage
{
    public interface ITilesManager
    {
        CellStruct[] GetTileDataFor(TileMetadata tileMetadata);

        byte[] GetTileImageFor(TileMetadata tileMetadata);

        CellStruct GetCellDataFor(TileMetadata tileMetadata, int index);

        void SetCellDataFor(TileMetadata tileMetadata, int index, CellStruct cellStruct);
    }
}
