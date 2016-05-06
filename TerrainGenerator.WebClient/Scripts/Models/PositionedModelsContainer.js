var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Terrain;
(function (Terrain) {
    var Models;
    (function (Models) {
        var PositionedModelsContainer = (function (_super) {
            __extends(PositionedModelsContainer, _super);
            function PositionedModelsContainer(scene) {
                _super.call(this, scene);
            }
            PositionedModelsContainer.Initialize = function (scene) {
                if (PositionedModelsContainer.instance == null) {
                    var buildingModelsContainer = new PositionedModelsContainer(scene);
                    buildingModelsContainer.initialize();
                    PositionedModelsContainer.instance = buildingModelsContainer;
                }
                return PositionedModelsContainer.instance;
            };
            PositionedModelsContainer.GetInstance = function () {
                return PositionedModelsContainer.instance;
            };
            PositionedModelsContainer.prototype.GetPanelTextInstanceModel = function (textKey) {
                // Types refer here to the text key of the text to show
                var text = Terrain.Localization.LocalizationManager.GetInstance().GetText(textKey);
                if (!text || text.length == 0) {
                    return null;
                }
                var modelName = PositionedModelsContainer.panelModelText;
                var meshes = _super.prototype.CreateNewModelInstanceMeshes.call(this, modelName);
                if (meshes == null) {
                    return null;
                }
                var geometry = _super.prototype.GetBasicModelGeometry.call(this, modelName);
                var model = new Models.BaseInstanceModel(meshes, this.sizes.getByKey(modelName), geometry);
                model.WriteText(text);
                return model;
            };
            PositionedModelsContainer.prototype.GetPanelResourceInstanceModel = function (resourceType) {
                var modelName = this.BuildNameResource(resourceType);
                var meshes = _super.prototype.CreateNewModelInstanceMeshes.call(this, modelName);
                if (meshes == null) {
                    return null;
                }
                var geometry = _super.prototype.GetBasicModelGeometry.call(this, modelName);
                return new Models.ResourcedInstanceModel(meshes, this.sizes.getByKey(modelName), geometry, resourceType);
            };
            PositionedModelsContainer.prototype.GetElementedResourcedInstanceModel = function (mapElementType) {
                var resourceType = Terrain.Tiles.GetResourceFromMapElementType(mapElementType);
                var modelName = this.BuildNameResource(resourceType);
                var meshes = _super.prototype.CreateNewModelInstanceMeshes.call(this, modelName);
                if (meshes == null) {
                    return null;
                }
                var geometry = _super.prototype.GetBasicModelGeometry.call(this, modelName);
                return new Models.ElementedResourcedInstanceModel(meshes, this.sizes.getByKey(modelName), geometry, mapElementType, resourceType);
            };
            PositionedModelsContainer.prototype.GettPositionedElementedResourcedInstanceModel = function (north, west, index, position, mapElementType) {
                var modelName = this.BuildNameMapElement(mapElementType);
                var resourceType = Terrain.Tiles.GetResourceFromMapElementType(mapElementType);
                var meshes = _super.prototype.CreateNewModelInstanceMeshes.call(this, modelName);
                if (meshes == null) {
                    return null;
                }
                var geometry = _super.prototype.GetBasicModelGeometry.call(this, modelName);
                return new Models.PositionedElementedResourcedInstanceModel(north, west, index, position, meshes, this.sizes.getByKey(modelName), geometry, mapElementType, resourceType);
            };
            PositionedModelsContainer.prototype.initialize = function () {
                //var diameterTop: number = 1;                   
                //var diameterBottom: number = 1;
                //var tessellation: number = 1;
                _super.prototype.ImportBasicGeometryModelStandardTexture.call(this, Models.GeometryType.Cylinder, { diameterTop: 1, diameterBottom: 3, tessellation: 6 }, this.BuildNameMapElement(Terrain.Tiles.MapElementType.thatchedBuilding), "Assets/Buildings/Thatched.jpg", BABYLON.AbstractMesh.BILLBOARDMODE_NONE, 3.0);
                //super.Import3DModel("tree_3d_0", "Assets/Trees/", "tree_0.babylon", 0.02);
                //super.Import3DModel("tree_3d_1", "Assets/Trees/", "tree_1.babylon", 0.03);
                //super.Import3DModel("tree_3d_2", "Assets/Trees/", "tree_2.babylon", 0.03);
                //super.Import3DModel("tree_3d_3", "Assets/Trees/", "tree_3.babylon", 0.03);
                //super.Import3DModel("tree_3d_4", "Assets/Trees/", "tree_4.babylon", 0.04);
                //super.Import3DModel("tree_3d_5", "Assets/Trees/", "tree_5.babylon", 0.03);
                //super.Import3DModel("tree_3d_6", "Assets/Trees/", "tree_6.babylon", 0.02);
                //super.ImportBasicGeometryModelStandardTexture(Geometries.Plane, null, [100], Terrain.Resources.ResourceType.tree, "Assets/Trees/tree_100.png", 100000, 4.0, BABYLON.AbstractMesh.BILLBOARDMODE_NONE);
                //super.ImportBasicGeometryModelStandardTexture(Geometries.Plane, null, [210], Terrain.Resources.ResourceType.tree, "Assets/Trees/tree_110.png", 100000, 4.0, BABYLON.AbstractMesh.BILLBOARDMODE_NONE);
                //super.ImportBasicGeometryModelStandardTexture(Geometries.Plane, null, [200], Terrain.Resources.ResourceType.tree, "Assets/Trees/tree_200.png", 100000, 4.0, BABYLON.AbstractMesh.BILLBOARDMODE_NONE);
                //super.ImportBasicGeometryModelStandardTexture(Geometries.Plane, null, [300], Terrain.Resources.ResourceType.tree, "Assets/Trees/tree_300.png", 100000, 4.0, BABYLON.AbstractMesh.BILLBOARDMODE_NONE);
                //super.ImportBasicGeometryModelStandardTexture(Geometries.Plane, null, [310], Terrain.Resources.ResourceType.tree, "Assets/Trees/tree_310.png", 100000, 4.0, BABYLON.AbstractMesh.BILLBOARDMODE_NONE);
                //super.ImportBasicGeometryModelStandardTexture(Geometries.Plane, null, [320], Terrain.Resources.ResourceType.tree, "Assets/Trees/tree_320.png", 100000, 4.0, BABYLON.AbstractMesh.BILLBOARDMODE_NONE);
                //super.ImportBasicGeometryModelStandardTexture(Geometries.Plane, null, [400], Terrain.Resources.ResourceType.tree, "Assets/Trees/tree_400.png", 100000, 4.0, BABYLON.AbstractMesh.BILLBOARDMODE_NONE);
                //super.ImportBasicGeometryModelStandardTexture(Geometries.Plane, null, [410], Terrain.Resources.ResourceType.tree, "Assets/Trees/tree_410.png", 100000, 4.0, BABYLON.AbstractMesh.BILLBOARDMODE_NONE);
                //super.ImportBasicGeometryModelStandardTexture(Geometries.Plane, null, [500], Terrain.Resources.ResourceType.tree, "Assets/Trees/tree_500.png", 100000, 4.0, BABYLON.AbstractMesh.BILLBOARDMODE_NONE);
                _super.prototype.ImportBasicGeometryModelStandardTexture.call(this, Models.GeometryType.Plane, null, this.BuildNameMapElement(Terrain.Tiles.MapElementType.TROPICAL_RAIN_FOREST_TERRAIN_TREE), "Assets/Trees/tree_510.png", BABYLON.AbstractMesh.BILLBOARDMODE_NONE, 4.0);
                //super.ImportBasicGeometryModelStandardTexture(Geometries.Plane, null, [600], Terrain.Resources.ResourceType.tree, "Assets/Trees/tree_600.png", 100000, 4.0, BABYLON.AbstractMesh.BILLBOARDMODE_NONE);
                _super.prototype.ImportBasicGeometryModelStandardTexture.call(this, Models.GeometryType.Plane, null, this.BuildNameResource(Terrain.Resources.ResourceType.wood), "Assets/Icons/log.png", BABYLON.AbstractMesh.BILLBOARDMODE_ALL, 2.0);
                _super.prototype.ImportBasicGeometryModelStandardTexture.call(this, Models.GeometryType.Plane, null, this.BuildNameResource(Terrain.Resources.ResourceType.noBuildingAllowed), "Assets/Icons/noBuilding.png", BABYLON.AbstractMesh.BILLBOARDMODE_ALL, 2.0);
                _super.prototype.ImportBasicGeometryModelStandardTexture.call(this, Models.GeometryType.Plane, null, this.BuildNameResource(Terrain.Resources.ResourceType.population), "Assets/Icons/face.png", BABYLON.AbstractMesh.BILLBOARDMODE_ALL, 2.0);
                _super.prototype.ImportBasicGeometryModelDynamicTexture.call(this, Models.GeometryType.Plane, { isPickable: true }, PositionedModelsContainer.panelModelText, null, BABYLON.AbstractMesh.BILLBOARDMODE_X, 100.0, new BABYLON.Vector3(1, 0.3, 1));
            };
            PositionedModelsContainer.prototype.BuildNameMapElement = function (mapElementType) {
                return "mapElem_" + mapElementType;
            };
            PositionedModelsContainer.prototype.BuildNameResource = function (resourceType) {
                return "res_" + resourceType;
            };
            PositionedModelsContainer.panelModelText = "panelText";
            return PositionedModelsContainer;
        })(Models.BaseModelsContainer);
        Models.PositionedModelsContainer = PositionedModelsContainer;
    })(Models = Terrain.Models || (Terrain.Models = {}));
})(Terrain || (Terrain = {}));
//# sourceMappingURL=PositionedModelsContainer.js.map