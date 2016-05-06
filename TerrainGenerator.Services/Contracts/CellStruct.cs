using System;
using System.Runtime.InteropServices;

namespace TerrainGenerator.Services.Contracts
{
    public enum CellType
    {
        Sea = 0,
        River = 1,
        Terrain = 2
    };

    [Serializable]
    [StructLayout(LayoutKind.Sequential)]
    public struct CellStruct
    {
        public float a;
        public int t;
        public int c;
    };  
}
