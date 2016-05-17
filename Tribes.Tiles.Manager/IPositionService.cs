using Tribes.Tiles.Contract;

namespace Tribes.Tiles.Manager
{
    public interface IPositionService
    {
        TilePosition GetInitialPosition(decimal tileSize, int gridSize);
    }
}
