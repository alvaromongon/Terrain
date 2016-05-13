namespace Tribes.Subscribers.Manager
{
    public interface IPositionService
    {
        TilePosition GetInitialPosition(decimal tileSize, int gridSize);
    }
}
