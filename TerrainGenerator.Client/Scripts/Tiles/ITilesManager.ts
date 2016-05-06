module Terrain.Tiles {

    export interface ITilesManager {

        LoadNeededData(currentPosition: BABYLON.Vector3): boolean
        GetPositonAltitude(position: BABYLON.Vector3): number
        GetCenterTilePosition(): BABYLON.Vector3
        GetAmplitud(): number
        GetSideSize(): number
        GetTileName(latitude: number, longitude: number): string
        GetTileByName(name: string): Tile
        OntileLoaded(tileData: ITileData): void

    }
}  
