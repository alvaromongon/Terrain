var Terrain;
(function (Terrain) {
    var MapElement;
    (function (MapElement) {
        (function (MapElementType) {
            MapElementType[MapElementType["empty"] = 0] = "empty";
            MapElementType[MapElementType["ARTIC_ALPINE_TERRAIN_TREE"] = 100] = "ARTIC_ALPINE_TERRAIN_TREE";
            MapElementType[MapElementType["TUNDRA_TERRAIN_TREE"] = 110] = "TUNDRA_TERRAIN_TREE";
            MapElementType[MapElementType["TAIGA_TERRAIN_TREE"] = 200] = "TAIGA_TERRAIN_TREE";
            MapElementType[MapElementType["WOODLAND_TERRAIN_TREE"] = 300] = "WOODLAND_TERRAIN_TREE";
            MapElementType[MapElementType["SAVANNA_TERRAIN_TREE"] = 310] = "SAVANNA_TERRAIN_TREE";
            MapElementType[MapElementType["THOM_FOREST_TERRAIN_TREE"] = 320] = "THOM_FOREST_TERRAIN_TREE";
            MapElementType[MapElementType["TEMPERATE_DECIDUOUS_FOREST_TERRAIN_TREE"] = 400] = "TEMPERATE_DECIDUOUS_FOREST_TERRAIN_TREE";
            MapElementType[MapElementType["TROPICAL_MONTANE_FOREST_TERRAIN_TREE"] = 410] = "TROPICAL_MONTANE_FOREST_TERRAIN_TREE";
            MapElementType[MapElementType["DRY_FOREST_TERRAIN_TREE"] = 500] = "DRY_FOREST_TERRAIN_TREE";
            MapElementType[MapElementType["TROPICAL_RAIN_FOREST_TERRAIN_TREE"] = 510] = "TROPICAL_RAIN_FOREST_TERRAIN_TREE";
            MapElementType[MapElementType["DESERT_TERRAIN_TREE"] = 600] = "DESERT_TERRAIN_TREE";
            MapElementType[MapElementType["tipiBuilding"] = 1001] = "tipiBuilding";
            MapElementType[MapElementType["thatchedBuilding"] = 1002] = "thatchedBuilding";
            MapElementType[MapElementType["granaryBuilding"] = 1003] = "granaryBuilding";
            MapElementType[MapElementType["kilnBuilding"] = 1004] = "kilnBuilding";
        })(MapElement.MapElementType || (MapElement.MapElementType = {}));
        var MapElementType = MapElement.MapElementType;
        function GetResourceFromMapElementType(mapElementType) {
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
                    return Terrain.Resources.ResourceType.wood;
                case MapElementType.thatchedBuilding:
                    return Terrain.Resources.ResourceType.population;
                default:
                    return Terrain.Resources.ResourceType.empty;
            }
        }
        MapElement.GetResourceFromMapElementType = GetResourceFromMapElementType;
    })(MapElement = Terrain.MapElement || (Terrain.MapElement = {}));
})(Terrain || (Terrain = {}));
//# sourceMappingURL=MapElementType.js.map