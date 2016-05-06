using System.Drawing;
using TerrainGenerator.Services.Contracts;

namespace TerrainGenerator.Services.Interfaces.Internals
{
    interface IMapColorGeneratorService
    {
        Color GetColor(CellStruct cell);
    }
}
