module Terrain.System {

    export interface ISystemConfiguration {
        FirstUse: boolean;
        Rules: Array<IRule>;
        TilePosition: Tiles.ITilePosition;
        TileSize: number;
        GridSize: number;
        TilesMatrixSideSize: number;
        MaxMinHeight: number;
        MaxAllowedCameraAltitudeOverTerrain: number;
        MinAllowedCameraAltitudeOverTerrain: number;
        ShelfLevel: number;
        MaxTerrainAltitudeInMeters: number;
    }


    export interface IRule {
        InitialActionType: Actions.ActionType;
        InitialMapElementType: MapElement.MapElementType;
        FinishMapElementType: MapElement.MapElementType;
        ManPowerNeeded: number;
    }
}   