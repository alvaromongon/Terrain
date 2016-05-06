module Terrain.Tiles {

    export interface ICell {
        North: number;
        West: number;
        Index: number;
        InitialMapElementType: MapElement.MapElementType;
        FinishMapElementType: MapElement.MapElementType;
    }
}   