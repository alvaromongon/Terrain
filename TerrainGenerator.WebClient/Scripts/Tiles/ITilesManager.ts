module Terrain.Tiles {

    export interface ITilesManager {

        LoadNeededData(currentPosition: BABYLON.Vector2): BABYLON.Vector3
        //GetPickedInfo(position: BABYLON.Vector2): BABYLON.PickingInfo
        GetModel(pickedInfo: BABYLON.PickingInfo): Terrain.Models.PositionedElementedResourcedInstanceModel
        GetPositonAltitude(position: BABYLON.Vector2): number
        GetCenterTilePosition(): BABYLON.Vector3
        GetAmplitud(): number
        GetSideSize(): number
        GetTileName(latitude: number, longitude: number): string
        GetTileByName(name: string): Tile
        OntileLoaded(tileData: ITileData): void
        IsLoading(): boolean
        RequestPositionedModelCreationFromPosition(position: BABYLON.Vector3, mapElementType: MapElement.MapElementType): boolean
        UpdateCell(cell: ICell): void
    }
}  
