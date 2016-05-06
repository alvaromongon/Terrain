module Terrain.MapElement {

    export enum MapElementType {
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

    export function GetResourceFromMapElementType(mapElementType: MapElementType): Resources.ResourceType {
        switch (mapElementType) {
            case MapElementType.ARTIC_ALPINE_TERRAIN_TREE:
            case MapElementType.TUNDRA_TERRAIN_TREE:
            case MapElementType.TAIGA_TERRAIN_TREE:
            case MapElementType.WOODLAND_TERRAIN_TREE:
            case MapElementType.SAVANNA_TERRAIN_TREE:
            case MapElementType.THOM_FOREST_TERRAIN_TREE:
            case MapElementType.TEMPERATE_DECIDUOUS_FOREST_TERRAIN_TREE:
            case MapElementType.TROPICAL_MONTANE_FOREST_TERRAIN_TREE:
            case MapElementType.DRY_FOREST_TERRAIN_TREE:
            case MapElementType.TROPICAL_RAIN_FOREST_TERRAIN_TREE:
            case MapElementType.DESERT_TERRAIN_TREE:
                return Resources.ResourceType.wood;

            case MapElementType.thatchedBuilding:
                return Resources.ResourceType.population;

            default:
                return Resources.ResourceType.empty;
        }
    } 
}  
