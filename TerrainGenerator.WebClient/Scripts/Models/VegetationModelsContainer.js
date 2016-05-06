var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Terrain;
(function (Terrain) {
    var Models;
    (function (Models) {
        /*
        - 0 - ** Empty **
        - 1 - Artic / Alpine / Tundra
        - 2 - Taiga(Boreal forest)
        - 3 - Woodland / Shrubland / Savanna / Thom fores
        - 4 - Temperate deciduous forest / Tropical montane forest
        - 5 - Dry forest / Tropical rain forest
        - 6 - Desert
        */
        var VegetationModelsContainer = (function (_super) {
            __extends(VegetationModelsContainer, _super);
            function VegetationModelsContainer(scene) {
                _super.call(this, scene);
            }
            VegetationModelsContainer.Initialize = function (scene) {
                if (VegetationModelsContainer.instance == null) {
                    var vegetationResourceContainer = new VegetationModelsContainer(scene);
                    vegetationResourceContainer.initialize();
                    VegetationModelsContainer.instance = vegetationResourceContainer;
                }
                return VegetationModelsContainer.instance;
            };
            VegetationModelsContainer.GetInstance = function () {
                return VegetationModelsContainer.instance;
            };
            VegetationModelsContainer.prototype.GetModelInstance = function (terrainType, content, north, west, index, position) {
                // types refer to the terrain type for vegeration. At some point we should add content type
                if (terrainType < 1 || terrainType > 999) {
                    return null;
                }
                var modelName = this.BuildName(terrainType);
                var meshes = _super.prototype.CreateNewModelInstanceMeshes.call(this, modelName);
                if (meshes == null) {
                    return null;
                }
                var geometry = _super.prototype.GetBasicModelGeometry.call(this, modelName);
                // TODO? is this ok? I am not using the content value but assinging tree by default
                var model = new Models.PositionedResourcedInstanceModel(north, west, index, position, meshes, this.sizes.getByKey(modelName), geometry, Terrain.Resources.ResourceType.tree);
                return model;
            };
            VegetationModelsContainer.prototype.initialize = function () {
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
                _super.prototype.ImportBasicGeometryModelStandardTexture.call(this, Models.GeometryType.Plane, null, this.BuildName(510), "Assets/Trees/tree_510.png", BABYLON.AbstractMesh.BILLBOARDMODE_NONE, 4.0);
                //super.ImportBasicGeometryModelStandardTexture(Geometries.Plane, null, [600], Terrain.Resources.ResourceType.tree, "Assets/Trees/tree_600.png", 100000, 4.0, BABYLON.AbstractMesh.BILLBOARDMODE_NONE);
            };
            VegetationModelsContainer.prototype.BuildName = function (terrainType) {
                return "veg_" + terrainType;
            };
            return VegetationModelsContainer;
        })(Models.BaseModelsContainer);
        Models.VegetationModelsContainer = VegetationModelsContainer;
    })(Models = Terrain.Models || (Terrain.Models = {}));
})(Terrain || (Terrain = {}));
//# sourceMappingURL=VegetationModelsContainer.js.map