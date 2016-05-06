var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Terrain;
(function (Terrain) {
    var Models;
    (function (Models) {
        var ResourcedInstanceModel = (function (_super) {
            __extends(ResourcedInstanceModel, _super);
            function ResourcedInstanceModel(meshes, size, geometry, resourceType) {
                _super.call(this, meshes, size, geometry);
                this._resourceType = resourceType;
            }
            ResourcedInstanceModel.prototype.HasResourceAssociated = function () {
                return this._resourceType != Terrain.Resources.ResourceType.empty;
            };
            ResourcedInstanceModel.prototype.GetResouceAssociated = function () {
                return this._resourceType;
            };
            ResourcedInstanceModel.prototype.HideHoverPanel = function () {
                if (this.HasResourceAssociated() && this._hoverPanel != null) {
                    //console.log("Hide hover panel : " + this._hoverPanel.GetName());
                    this._hoverPanel.Dispose();
                    this._hoverPanel = null;
                    return true;
                }
                return false;
            };
            ResourcedInstanceModel.prototype.ShowHoverPanel = function () {
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
                    }
                    else {
                        console.log("ShowHoverPanel, could not create a hover panel for the resource type: " + this._resourceType);
                    }
                    return false;
                }
            };
            return ResourcedInstanceModel;
        })(Models.BaseInstanceModel);
        Models.ResourcedInstanceModel = ResourcedInstanceModel;
    })(Models = Terrain.Models || (Terrain.Models = {}));
})(Terrain || (Terrain = {}));
//# sourceMappingURL=ResourcedInstanceModel.js.map