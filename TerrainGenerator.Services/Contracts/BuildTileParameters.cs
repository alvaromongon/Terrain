using System.Runtime.InteropServices;

namespace TerrainGenerator.Services.Contracts
{
    [StructLayout(LayoutKind.Sequential)]
    internal struct BuildTileParameters
    {
        public double southCoord;
        public double northCoord;
        public double westCoord;
        public double eastCoord;
        public int gridSize;
        public int maxJsonLength;
    };
}
