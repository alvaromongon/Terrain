module Terrain.Models {
    
    export class ElementedResourcedInstanceModel extends ResourcedInstanceModel {
        public _inProgressAction: Actions.ActionType;
        public _mapElementType: MapElement.MapElementType;

        constructor(meshes: Array<BABYLON.AbstractMesh>, size: number, geometry: GeometryType, mapElementType: MapElement.MapElementType, resourceType: Terrain.Resources.ResourceType) {

            super(meshes, size, geometry, resourceType);

            this._inProgressAction = Actions.ActionType.emptyAction;
            this._mapElementType = mapElementType;
        }

        public static RequestCreation(north: number, west: number, index: number, finishMapElementType: MapElement.MapElementType): boolean {

            var initialMapElementType = MapElement.MapElementType.empty;
            var actionType = Terrain.Actions.ActionType.create;            

            var result = Terrain.Actions.ActionsQueue.GetInstance().Enqueue(north, west, index, initialMapElementType, finishMapElementType, actionType);

            if (result) {
                Sounds.SoundsContainer.GetInstance().Play(actionType, finishMapElementType);
            }

            return result;            
        }  
        
        public GetMapElementType(): MapElement.MapElementType {
            return this._mapElementType;
        }              

        public HideHoverPanel(): boolean {
            if (this._inProgressAction == Actions.ActionType.emptyAction) {
                return super.HideHoverPanel();
            }
            return false;
        }

        public ShowHoverPanel(): boolean {
            if (this._inProgressAction == Actions.ActionType.emptyAction) {
                return super.ShowHoverPanel();
            }
            return false;
        }

        public Dispose(): void {

            if (this._inProgressAction == Actions.ActionType.consume) {
                Sounds.SoundsContainer.GetInstance().Play(Actions.ActionType.finishConsumption, this._mapElementType);
            }
            
            super.Dispose();
        }
    }
} 