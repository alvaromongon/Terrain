module Terrain.Models {

    export class ResourcedInstanceModel extends BaseInstanceModel {
        public _resourceType: Terrain.Resources.ResourceType;
        public _hoverPanel: Models.BaseInstanceModel;

        constructor(meshes: Array<BABYLON.AbstractMesh>, size: number, geometry: GeometryType, resourceType: Terrain.Resources.ResourceType) {

            super(meshes, size, geometry);

            this._resourceType = resourceType;
        }

        public HasResourceAssociated(): boolean {
            return this._resourceType != Terrain.Resources.ResourceType.empty;
        }

        public GetResouceAssociated(): Resources.ResourceType {
            return this._resourceType;
        }

        public HideHoverPanel(): boolean {            
            if (this.HasResourceAssociated() && this._hoverPanel != null) {
                //console.log("Hide hover panel : " + this._hoverPanel.GetName());
                this._hoverPanel.Dispose();
                this._hoverPanel = null;
                return true;
            }
            return false;
        }        

        public ShowHoverPanel(): boolean {
            if (this.HasResourceAssociated()) {
                //console.log("show hover panel");
                if (this._hoverPanel == null) {
                    this._hoverPanel = Terrain.Models.MasterModelsContainer.GetInstance().GetPanelResourceInstanceModel(this._resourceType);
                }

                if (this._hoverPanel != null) {
                    var modelPosition = this.GetPosition();
                    if (this._hoverPanel.GetPosition() == null || this._hoverPanel.GetPosition().x != modelPosition.x || this._hoverPanel.GetPosition().z != modelPosition.z) {
                        this._hoverPanel.SetPosition(new BABYLON.Vector3(modelPosition.x, modelPosition.y + this._size * 1.2, modelPosition.z));
                    }

                    this._hoverPanel.Show();
                    return true;
                } else {
                    console.log("ShowHoverPanel, could not create a hover panel for the resource type: " + this._resourceType);
                }

                return false;
            }
        }
    }

}  