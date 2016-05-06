module Terrain.Models {
    
    export class PositionedElementedResourcedInstanceModel extends ElementedResourcedInstanceModel {
        private north: number;
        private west: number;
        private index: number;

        constructor(north: number, west: number, index: number, position: BABYLON.Vector3, meshes: Array<BABYLON.AbstractMesh>, size: number, geometry: GeometryType, mapElementType: MapElement.MapElementType, resourceType: Terrain.Resources.ResourceType) {

            super(meshes, size, geometry, mapElementType, resourceType);

            this.north = north;
            this.west = west;
            this.index = index;
            this.SetPosition(position);
        }

        public SetPosition(position: BABYLON.Vector3) {
            super.SetPosition(position);

            this.name = Terrain.Utilities.GetPositionedModelName(position);
        }

        public GetIndex(): number { return this.index; }

        public HasResourceAssociated(): boolean {
            return this._resourceType != Terrain.Resources.ResourceType.empty;
        }

        public Click(): boolean {
            
            if (this._inProgressAction != Actions.ActionType.emptyAction || !this.HasResourceAssociated()) {
                return false;
            }

            // TODO: by default for now the action click is consume
            var actionType = Terrain.Actions.ActionType.consume;
            var finishMapElementType = MapElement.MapElementType.empty;

            var result = Terrain.Actions.ActionsQueue.GetInstance().Enqueue(this.north, this.west, this.index, this._mapElementType, finishMapElementType, actionType);

            if (result) {
                this.HideHoverPanel();                

                this._inProgressAction = actionType;
                Sounds.SoundsContainer.GetInstance().Play(this._inProgressAction, this._mapElementType);                
            }

            return result;
        }
    }
} 