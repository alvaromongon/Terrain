using TerrainGenerator.Services.Contracts;

namespace TerrainGenerator.Services
{
    public interface IPositionService
    {
        TilePosition GetInitialPosition(decimal tileSize, int gridSize);
    }
}
