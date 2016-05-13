namespace Tribes.TerrainGenerator.Services.Internals
{
    public interface ITileAdjustmentService
    {
        void AdjustBorders(ref TileInformation tileInformation, TileInformation northTile, TileInformation southTile, TileInformation westTile, TileInformation eastTile);
    }
}
