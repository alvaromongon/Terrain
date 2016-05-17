using System;
using System.Runtime.InteropServices;

namespace Tribes.Tiles.Contract
{
    public enum CellType
    {
        Sea = 0,
        River = 1,
        Terrain = 2
    };

    [Serializable]
    [StructLayout(LayoutKind.Sequential)]
    public struct Cell
    {
        public float a;
        public int t;
        public int c;
    };  
}
