var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Terrain;
(function (Terrain) {
    var Models;
    (function (Models) {
        var PanelResourceModelsContainer = (function (_super) {
            __extends(PanelResourceModelsContainer, _super);
            function PanelResourceModelsContainer(scene) {
                _super.call(this, scene);
            }
            PanelResourceModelsContainer.Initialize = function (scene) {
                if (PanelResourceModelsContainer.instance == null) {
                    var panelModelsContainer = new PanelResourceModelsContainer(scene);
                    panelModelsContainer.initialize();
                    PanelResourceModelsContainer.instance = panelModelsContainer;
                }
                return PanelResourceModelsContainer.instance;
            };
            PanelResourceModelsContainer.GetInstance = function () {
                return PanelResourceModelsContainer.instance;
            };
            PanelResourceModelsContainer.prototype.GetModelInstance = function (resourceType) {
                // Types refer here to the resource type
                if (resourceType == Terrain.Resources.ResourceType.emptyResourceType) {
                    return null;
                }
                var modelName = this.BuildName(resourceType);
                var meshes = _super.prototype.CreateNewModelInstanceMeshes.call(this, modelName);
                if (meshes == null) {
                    return null;
                }
                var geometry = _super.prototype.GetBasicModelGeometry.call(this, modelName);
                var model = new Models.BaseInstanceModel(meshes, this.sizes.getByKey(modelName), geometry);
                return model;
            };
            PanelResourceModelsContainer.prototype.initialize = function () {
                _super.prototype.ImportBasicGeometryModelStandardTexture.call(this, Models.GeometryType.Plane, null, this.BuildName(Terrain.Resources.ResourceType.tree), "Assets/Icons/log.png", BABYLON.AbstractMesh.BILLBOARDMODE_ALL, 2.0);
                _super.prototype.ImportBasicGeometryModelStandardTexture.call(this, Models.GeometryType.Plane, null, this.BuildName(Terrain.Resources.ResourceType.noBuildingAllowed), "Assets/Icons/noBuilding.png", BABYLON.AbstractMesh.BILLBOARDMODE_ALL, 2.0);
                _super.prototype.ImportBasicGeometryModelStandardTexture.call(this, Models.GeometryType.Plane, null, this.BuildName(Terrain.Resources.ResourceType.thatchedBuilding), "Assets/Icons/face.png", BABYLON.AbstractMesh.BILLBOARDMODE_ALL, 2.0);
            };
            PanelResourceModelsContainer.prototype.BuildName = function (resourceType) {
                return "panelResource_" + resourceType;
            };
            return PanelResourceModelsContainer;
        })(Models.BaseModelsContainer);
        Models.PanelResourceModelsContainer = PanelResourceModelsContainer;
    })(Models = Terrain.Models || (Terrain.Models = {}));
})(Terrain || (Terrain = {}));
//# sourceMappingURL=PanelResourceModelsContainer.js.map