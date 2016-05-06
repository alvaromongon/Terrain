using TerrainGenerator.Services.Contracts;

namespace TerrainGenerator.Services
{
    public interface ITileAdjustmentService
    {
        void AdjustBorders(ref TileInformation tileInformation, TileInformation northTile, TileInformation southTile, TileInformation westTile, TileInformation eastTile);
    }
}
