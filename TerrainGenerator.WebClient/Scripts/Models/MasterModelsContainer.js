var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Terrain;
(function (Terrain) {
    var Models;
    (function (Models) {
        var MasterModelsContainer = (function (_super) {
            __extends(MasterModelsContainer, _super);
            function MasterModelsContainer(scene) {
                _super.call(this, scene);
            }
            MasterModelsContainer.Initialize = function (scene) {
                if (MasterModelsContainer.instance == null) {
                    var masterModelsContainer = new MasterModelsContainer(scene);
                    masterModelsContainer.initialize();
                    MasterModelsContainer.instance = masterModelsContainer;
                }
                return MasterModelsContainer.instance;
            };
            MasterModelsContainer.GetInstance = function () {
                return MasterModelsContainer.instance;
            };
            MasterModelsContainer.prototype.GetPanelTextInstanceModel = function (textKey) {
                // Types refer here to the text key of the text to show
                var text = Terrain.Localization.LocalizationManager.GetInstance().GetText(textKey);
                if (!text || text.length == 0) {
                    return null;
                }
                var modelName = MasterModelsContainer.panelModelText;
                var meshes = _super.prototype.CreateNewModelInstanceMeshes.call(this, modelName);
                if (meshes == null) {
                    return null;
                }
                var geometry = _super.prototype.GetBasicModelGeometry.call(this, modelName);
                var model = new Models.BaseInstanceModel(meshes, this.sizes.getByKey(modelName), geometry);
                model.WriteText(text);
                return model;
            };
            MasterModelsContainer.prototype.GetPanelResourceInstanceModel = function (resourceType) {
                var modelName = this.BuildName(MasterModelsContainer.resourcePrefix, resourceType);
                var meshes = _super.prototype.CreateNewModelInstanceMeshes.call(this, modelName);
                if (meshes == null) {
                    return null;
                }
                var geometry = _super.prototype.GetBasicModelGeometry.call(this, modelName);
                return new Models.ResourcedInstanceModel(meshes, this.sizes.getByKey(modelName), geometry, resourceType);
            };
            MasterModelsContainer.prototype.GetElementedResourcedInstanceModel = function (mapElementType) {
                var resourceType = Terrain.MapElement.GetResourceFromMapElementType(mapElementType);
                var modelName = this.BuildName(MasterModelsContainer.mapElementPrefix, mapElementType);
                var meshes = _super.prototype.CreateNewModelInstanceMeshes.call(this, modelName);
                if (meshes == null) {
                    return null;
                }
                var geometry = _super.prototype.GetBasicModelGeometry.call(this, modelName);
                return new Models.ElementedResourcedInstanceModel(meshes, this.sizes.getByKey(modelName), geometry, mapElementType, resourceType);
            };
            MasterModelsContainer.prototype.GetPositionedElementedResourcedInstanceModel = function (north, west, index, position, mapElementType) {
                var modelName = this.BuildName(MasterModelsContainer.mapElementPrefix, mapElementType);
                var resourceType = Terrain.MapElement.GetResourceFromMapElementType(mapElementType);
                var meshes = _super.prototype.CreateNewModelInstanceMeshes.call(this, modelName);
                if (meshes == null) {
                    return null;
                }
                var geometry = _super.prototype.GetBasicModelGeometry.call(this, modelName);
                return new Models.PositionedElementedResourcedInstanceModel(north, west, index, position, meshes, this.sizes.getByKey(modelName), geometry, mapElementType, resourceType);
            };
            MasterModelsContainer.prototype.initialize = function () {
                //var diameterTop: number = 1;                   
                //var diameterBottom: number = 1;
                //var tessellation: number = 1;
                _super.prototype.ImportBasicGeometryModelStandardTexture.call(this, Models.GeometryType.Cylinder, { diameterTop: 1, diameterBottom: 3, tessellation: 6 }, this.BuildName(MasterModelsContainer.mapElementPrefix, Terrain.MapElement.MapElementType.thatchedBuilding), "Assets/Buildings/Thatched.jpg", BABYLON.AbstractMesh.BILLBOARDMODE_NONE, 3.0);
                //super.Import3DModel("tree_3d_0", "Assets/Trees/", "tree_0.babylon", 0.02);
                //super.Import3DModel("tree_3d_1", "Assets/Trees/", "tree_1.babylon", 0.03);
                //super.Import3DModel("tree_3d_2", "Assets/Trees/", "tree_2.babylon", 0.03);
                //super.Import3DModel("tree_3d_3", "Assets/Trees/", "tree_3.babylon", 0.03);
                //super.Import3DModel("tree_3d_4", "Assets/Trees/", "tree_4.babylon", 0.04);
                //super.Import3DModel("tree_3d_5", "Assets/Trees/", "tree_5.babylon", 0.03);
                //super.Import3DModel("tree_3d_6", "Assets/Trees/", "tree_6.babylon", 0.02);
                _super.prototype.ImportBasicGeometryModelStandardTexture.call(this, Models.GeometryType.Plane, null, this.BuildName(MasterModelsContainer.mapElementPrefix, Terrain.MapElement.MapElementType.ARTIC_ALPINE_TERRAIN_TREE), "Assets/Trees/tree_100.png", BABYLON.AbstractMesh.BILLBOARDMODE_NONE, 4.0);
                _super.prototype.ImportBasicGeometryModelStandardTexture.call(this, Models.GeometryType.Plane, null, this.BuildName(MasterModelsContainer.mapElementPrefix, Terrain.MapElement.MapElementType.TUNDRA_TERRAIN_TREE), "Assets/Trees/tree_110.png", BABYLON.AbstractMesh.BILLBOARDMODE_NONE, 4.0);
                _super.prototype.ImportBasicGeometryModelStandardTexture.call(this, Models.GeometryType.Plane, null, this.BuildName(MasterModelsContainer.mapElementPrefix, Terrain.MapElement.MapElementType.TAIGA_TERRAIN_TREE), "Assets/Trees/tree_200.png", BABYLON.AbstractMesh.BILLBOARDMODE_NONE, 4.0);
                _super.prototype.ImportBasicGeometryModelStandardTexture.call(this, Models.GeometryType.Plane, null, this.BuildName(MasterModelsContainer.mapElementPrefix, Terrain.MapElement.MapElementType.WOODLAND_TERRAIN_TREE), "Assets/Trees/tree_300.png", BABYLON.AbstractMesh.BILLBOARDMODE_NONE, 4.0);
                _super.prototype.ImportBasicGeometryModelStandardTexture.call(this, Models.GeometryType.Plane, null, this.BuildName(MasterModelsContainer.mapElementPrefix, Terrain.MapElement.MapElementType.SAVANNA_TERRAIN_TREE), "Assets/Trees/tree_310.png", BABYLON.AbstractMesh.BILLBOARDMODE_NONE, 4.0);
                _super.prototype.ImportBasicGeometryModelStandardTexture.call(this, Models.GeometryType.Plane, null, this.BuildName(MasterModelsContainer.mapElementPrefix, Terrain.MapElement.MapElementType.THOM_FOREST_TERRAIN_TREE), "Assets/Trees/tree_320.png", BABYLON.AbstractMesh.BILLBOARDMODE_NONE, 4.0);
                _super.prototype.ImportBasicGeometryModelStandardTexture.call(this, Models.GeometryType.Plane, null, this.BuildName(MasterModelsContainer.mapElementPrefix, Terrain.MapElement.MapElementType.TEMPERATE_DECIDUOUS_FOREST_TERRAIN_TREE), "Assets/Trees/tree_400.png", BABYLON.AbstractMesh.BILLBOARDMODE_NONE, 4.0);
                _super.prototype.ImportBasicGeometryModelStandardTexture.call(this, Models.GeometryType.Plane, null, this.BuildName(MasterModelsContainer.mapElementPrefix, Terrain.MapElement.MapElementType.TROPICAL_MONTANE_FOREST_TERRAIN_TREE), "Assets/Trees/tree_410.png", BABYLON.AbstractMesh.BILLBOARDMODE_NONE, 4.0);
                _super.prototype.ImportBasicGeometryModelStandardTexture.call(this, Models.GeometryType.Plane, null, this.BuildName(MasterModelsContainer.mapElementPrefix, Terrain.MapElement.MapElementType.DRY_FOREST_TERRAIN_TREE), "Assets/Trees/tree_500.png", BABYLON.AbstractMesh.BILLBOARDMODE_NONE, 4.0);
                _super.prototype.ImportBasicGeometryModelStandardTexture.call(this, Models.GeometryType.Plane, null, this.BuildName(MasterModelsContainer.mapElementPrefix, Terrain.MapElement.MapElementType.TROPICAL_RAIN_FOREST_TERRAIN_TREE), "Assets/Trees/tree_510.png", BABYLON.AbstractMesh.BILLBOARDMODE_NONE, 4.0);
                _super.prototype.ImportBasicGeometryModelStandardTexture.call(this, Models.GeometryType.Plane, null, this.BuildName(MasterModelsContainer.mapElementPrefix, Terrain.MapElement.MapElementType.DESERT_TERRAIN_TREE), "Assets/Trees/tree_600.png", BABYLON.AbstractMesh.BILLBOARDMODE_NONE, 4.0);
                _super.prototype.ImportBasicGeometryModelStandardTexture.call(this, Models.GeometryType.Plane, null, this.BuildName(MasterModelsContainer.resourcePrefix, Terrain.Resources.ResourceType.wood), "Assets/Icons/log.png", BABYLON.AbstractMesh.BILLBOARDMODE_ALL, 2.0);
                _super.prototype.ImportBasicGeometryModelStandardTexture.call(this, Models.GeometryType.Plane, null, this.BuildName(MasterModelsContainer.resourcePrefix, Terrain.Resources.ResourceType.noBuildingAllowed), "Assets/Icons/noBuilding.png", BABYLON.AbstractMesh.BILLBOARDMODE_ALL, 2.0);
                _super.prototype.ImportBasicGeometryModelStandardTexture.call(this, Models.GeometryType.Plane, null, this.BuildName(MasterModelsContainer.resourcePrefix, Terrain.Resources.ResourceType.population), "Assets/Icons/face.png", BABYLON.AbstractMesh.BILLBOARDMODE_ALL, 2.0);
                _super.prototype.ImportBasicGeometryModelDynamicTexture.call(this, Models.GeometryType.Plane, { isPickable: true }, MasterModelsContainer.panelModelText, null, BABYLON.AbstractMesh.BILLBOARDMODE_X, 100.0, new BABYLON.Vector3(1, 0.3, 1));
            };
            MasterModelsContainer.prototype.BuildName = function (prefix, mapElementType) {
                return prefix + mapElementType;
            };
            MasterModelsContainer.panelModelText = "panelText";
            MasterModelsContainer.mapElementPrefix = "mapElem_";
            MasterModelsContainer.resourcePrefix = "res_";
            return MasterModelsContainer;
        })(Models.BaseModelsContainer);
        Models.MasterModelsContainer = MasterModelsContainer;
    })(Models = Terrain.Models || (Terrain.Models = {}));
})(Terrain || (Terrain = {}));
//# sourceMappingURL=MasterModelsContainer.js.map