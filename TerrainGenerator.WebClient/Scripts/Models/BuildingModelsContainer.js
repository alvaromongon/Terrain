var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Terrain;
(function (Terrain) {
    var Models;
    (function (Models) {
        var BuildingModelsContainer = (function (_super) {
            __extends(BuildingModelsContainer, _super);
            function BuildingModelsContainer(scene) {
                _super.call(this, scene);
            }
            BuildingModelsContainer.Initialize = function (scene) {
                if (BuildingModelsContainer.instance == null) {
                    var buildingModelsContainer = new BuildingModelsContainer(scene);
                    buildingModelsContainer.initialize();
                    BuildingModelsContainer.instance = buildingModelsContainer;
                }
                return BuildingModelsContainer.instance;
            };
            BuildingModelsContainer.GetInstance = function () {
                return BuildingModelsContainer.instance;
            };
            BuildingModelsContainer.prototype.GetResourcedModel = function (buildingType) {
                if (!Terrain.Resources.Resource.Isbuilding(buildingType)) {
                    return null;
                }
                var modelName = this.BuildName(buildingType);
                var meshes = _super.prototype.CreateNewModelInstanceMeshes.call(this, modelName);
                if (meshes == null) {
                    return null;
                }
                var geometry = _super.prototype.GetBasicModelGeometry.call(this, modelName);
                var model = new Models.ResourcedInstanceModel(meshes, this.sizes.getByKey(modelName), geometry, buildingType);
                return model;
            };
            BuildingModelsContainer.prototype.GetPositionedResourcedModel = function (buildingType, north, west, index, position) {
                if (buildingType < 1001 || buildingType > 1999) {
                    return null;
                }
                var modelName = this.BuildName(buildingType);
                var meshes = _super.prototype.CreateNewModelInstanceMeshes.call(this, modelName);
                if (meshes == null) {
                    return null;
                }
                var geometry = _super.prototype.GetBasicModelGeometry.call(this, modelName);
                var model = new Models.PositionedResourcedInstanceModel(north, west, index, position, meshes, this.sizes.getByKey(modelName), geometry, buildingType);
                return model;
            };
            BuildingModelsContainer.prototype.initialize = function () {
                //var diameterTop: number = 1;                   
                //var diameterBottom: number = 1;
                //var tessellation: number = 1;
                _super.prototype.ImportBasicGeometryModelStandardTexture.call(this, Models.GeometryType.Cylinder, { diameterTop: 1, diameterBottom: 3, tessellation: 6 }, this.BuildName(Terrain.Resources.ResourceType.thatchedBuilding), "Assets/Buildings/Thatched.jpg", BABYLON.AbstractMesh.BILLBOARDMODE_NONE, 3.0);
            };
            BuildingModelsContainer.prototype.BuildName = function (buildingType) {
                return "bui_" + buildingType;
            };
            return BuildingModelsContainer;
        })(Models.BaseModelsContainer);
        Models.BuildingModelsContainer = BuildingModelsContainer;
    })(Models = Terrain.Models || (Terrain.Models = {}));
})(Terrain || (Terrain = {}));
//# sourceMappingURL=BuildingModelsContainer.js.map