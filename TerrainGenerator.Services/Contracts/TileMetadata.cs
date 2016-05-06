
namespace TerrainGenerator.Services.Contracts
{
    public class TileMetadata
    {
        public TilePosition TilePosition { get; set; }
        public decimal TileSize { get; set; }
        public int GridSize { get; set; }
        public int TilesMatrixSideSize { get; set; }
    }
}