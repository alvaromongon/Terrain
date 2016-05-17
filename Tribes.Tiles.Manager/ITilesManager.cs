using Tribes.Tiles.Contract;

namespace Tribes.Tiles.Manager
{
    public interface ITilesManager
    {
        Cell[] GetTileDataFor(TileMetadata tileMetadata);

        byte[] GetTileImageFor(TileMetadata tileMetadata);

        Cell GetCellDataFor(CellMetatada cellMetatada);

        void SetCellDataFor(CellMetatada cellMetatada, Cell cell);
    }
}
