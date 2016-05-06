module Terrain.Actions {    

    export interface IAction extends Terrain.Tiles.ICell {
        ActionType: ActionType;
    }
} 