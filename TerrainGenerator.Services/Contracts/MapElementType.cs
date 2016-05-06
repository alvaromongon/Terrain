namespace TerrainGenerator.Services.Contracts
{
    public enum MapElementType
    {
        empty = 0,
        ARTIC_ALPINE_TERRAIN_TREE = 100,
        TUNDRA_TERRAIN_TREE = 110,
        TAIGA_TERRAIN_TREE = 200,
        WOODLAND_TERRAIN_TREE = 300,
        SAVANNA_TERRAIN_TREE = 310,
        THOM_FOREST_TERRAIN_TREE = 320,
        TEMPERATE_DECIDUOUS_FOREST_TERRAIN_TREE = 400,
        TROPICAL_MONTANE_FOREST_TERRAIN_TREE = 410,
        DRY_FOREST_TERRAIN_TREE = 500,
        TROPICAL_RAIN_FOREST_TERRAIN_TREE = 510,
        DESERT_TERRAIN_TREE = 600,
        tipiBuilding = 1001,
        thatchedBuilding = 1002,
        granaryBuilding = 1003,
        kilnBuilding = 1004
    }
}
