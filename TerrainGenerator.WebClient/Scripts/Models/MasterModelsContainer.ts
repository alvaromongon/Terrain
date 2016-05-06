module Terrain.Models {   
    export class MasterModelsContainer extends BaseModelsContainer {

        private static instance: MasterModelsContainer;
        public static panelModelText: string = "panelText";
        private static mapElementPrefix: string = "mapElem_";
        private static resourcePrefix: string = "res_";

        public static Initialize(scene: BABYLON.Scene): MasterModelsContainer {
            if (MasterModelsContainer.instance == null) {
                var masterModelsContainer = new MasterModelsContainer(scene);
                masterModelsContainer.initialize();
                MasterModelsContainer.instance = masterModelsContainer;
            }

            return MasterModelsContainer.instance;
        }

        public static GetInstance(): MasterModelsContainer {
            return MasterModelsContainer.instance;
        }

        constructor(scene: BABYLON.Scene) {
            super(scene);
        }

        public GetPanelTextInstanceModel(textKey: string): Models.BaseInstanceModel {
            // Types refer here to the text key of the text to show
            var text = Localization.LocalizationManager.GetInstance().GetText(textKey);
            if (!text || text.length == 0) {
                return null;
            }

            var modelName = MasterModelsContainer.panelModelText;

            var meshes = super.CreateNewModelInstanceMeshes(modelName);

            if (meshes == null) {
                return null;
            }

            var geometry = super.GetBasicModelGeometry(modelName);

            var model = new BaseInstanceModel(meshes, this.sizes.getByKey(modelName), geometry);

            model.WriteText(text);

            return model;
        }

        public GetPanelResourceInstanceModel(resourceType: number): Models.ResourcedInstanceModel {
            var modelName = this.BuildName(MasterModelsContainer.resourcePrefix, resourceType);

            var meshes = super.CreateNewModelInstanceMeshes(modelName);

            if (meshes == null) {
                return null;
            }

            var geometry = super.GetBasicModelGeometry(modelName);

            return new ResourcedInstanceModel(meshes, this.sizes.getByKey(modelName), geometry, resourceType);
        }

        public GetElementedResourcedInstanceModel(mapElementType: MapElement.MapElementType): Models.ElementedResourcedInstanceModel {
            
            var resourceType = MapElement.GetResourceFromMapElementType(mapElementType);         
            var modelName = this.BuildName(MasterModelsContainer.mapElementPrefix, mapElementType);

            var meshes = super.CreateNewModelInstanceMeshes(modelName);

            if (meshes == null) {
                return null;
            }

            var geometry = super.GetBasicModelGeometry(modelName);

            return new ElementedResourcedInstanceModel(meshes, this.sizes.getByKey(modelName), geometry, mapElementType, resourceType);
        }

        public GetPositionedElementedResourcedInstanceModel(north: number, west: number, index: number, position: BABYLON.Vector3, mapElementType: MapElement.MapElementType): Models.PositionedElementedResourcedInstanceModel {            
            
            var modelName = this.BuildName(MasterModelsContainer.mapElementPrefix, mapElementType);
            var resourceType = MapElement.GetResourceFromMapElementType(mapElementType);         

            var meshes = super.CreateNewModelInstanceMeshes(modelName);

            if (meshes == null) {
                return null;
            }

            var geometry = super.GetBasicModelGeometry(modelName);

            return new PositionedElementedResourcedInstanceModel(north, west, index, position, meshes, this.sizes.getByKey(modelName), geometry, mapElementType, resourceType);
        }

        private initialize(): void {
            //var diameterTop: number = 1;                   
            //var diameterBottom: number = 1;
            //var tessellation: number = 1;
            super.ImportBasicGeometryModelStandardTexture(GeometryType.Cylinder, { diameterTop: 1, diameterBottom: 3, tessellation: 6 }, this.BuildName(MasterModelsContainer.mapElementPrefix, MapElement.MapElementType.thatchedBuilding), "Assets/Buildings/Thatched.jpg", BABYLON.AbstractMesh.BILLBOARDMODE_NONE, 3.0);

            //super.Import3DModel("tree_3d_0", "Assets/Trees/", "tree_0.babylon", 0.02);
            //super.Import3DModel("tree_3d_1", "Assets/Trees/", "tree_1.babylon", 0.03);
            //super.Import3DModel("tree_3d_2", "Assets/Trees/", "tree_2.babylon", 0.03);
            //super.Import3DModel("tree_3d_3", "Assets/Trees/", "tree_3.babylon", 0.03);
            //super.Import3DModel("tree_3d_4", "Assets/Trees/", "tree_4.babylon", 0.04);
            //super.Import3DModel("tree_3d_5", "Assets/Trees/", "tree_5.babylon", 0.03);
            //super.Import3DModel("tree_3d_6", "Assets/Trees/", "tree_6.babylon", 0.02);
            super.ImportBasicGeometryModelStandardTexture(GeometryType.Plane, null, this.BuildName(MasterModelsContainer.mapElementPrefix, MapElement.MapElementType.ARTIC_ALPINE_TERRAIN_TREE), "Assets/Trees/tree_100.png", BABYLON.AbstractMesh.BILLBOARDMODE_NONE, 4.0);
            super.ImportBasicGeometryModelStandardTexture(GeometryType.Plane, null, this.BuildName(MasterModelsContainer.mapElementPrefix, MapElement.MapElementType.TUNDRA_TERRAIN_TREE), "Assets/Trees/tree_110.png", BABYLON.AbstractMesh.BILLBOARDMODE_NONE, 4.0);
            super.ImportBasicGeometryModelStandardTexture(GeometryType.Plane, null, this.BuildName(MasterModelsContainer.mapElementPrefix, MapElement.MapElementType.TAIGA_TERRAIN_TREE), "Assets/Trees/tree_200.png", BABYLON.AbstractMesh.BILLBOARDMODE_NONE, 4.0);
            super.ImportBasicGeometryModelStandardTexture(GeometryType.Plane, null, this.BuildName(MasterModelsContainer.mapElementPrefix, MapElement.MapElementType.WOODLAND_TERRAIN_TREE), "Assets/Trees/tree_300.png", BABYLON.AbstractMesh.BILLBOARDMODE_NONE, 4.0);
            super.ImportBasicGeometryModelStandardTexture(GeometryType.Plane, null, this.BuildName(MasterModelsContainer.mapElementPrefix, MapElement.MapElementType.SAVANNA_TERRAIN_TREE), "Assets/Trees/tree_310.png", BABYLON.AbstractMesh.BILLBOARDMODE_NONE, 4.0);
            super.ImportBasicGeometryModelStandardTexture(GeometryType.Plane, null, this.BuildName(MasterModelsContainer.mapElementPrefix, MapElement.MapElementType.THOM_FOREST_TERRAIN_TREE), "Assets/Trees/tree_320.png", BABYLON.AbstractMesh.BILLBOARDMODE_NONE, 4.0);
            super.ImportBasicGeometryModelStandardTexture(GeometryType.Plane, null, this.BuildName(MasterModelsContainer.mapElementPrefix, MapElement.MapElementType.TEMPERATE_DECIDUOUS_FOREST_TERRAIN_TREE), "Assets/Trees/tree_400.png", BABYLON.AbstractMesh.BILLBOARDMODE_NONE, 4.0);
            super.ImportBasicGeometryModelStandardTexture(GeometryType.Plane, null, this.BuildName(MasterModelsContainer.mapElementPrefix, MapElement.MapElementType.TROPICAL_MONTANE_FOREST_TERRAIN_TREE), "Assets/Trees/tree_410.png", BABYLON.AbstractMesh.BILLBOARDMODE_NONE, 4.0);
            super.ImportBasicGeometryModelStandardTexture(GeometryType.Plane, null, this.BuildName(MasterModelsContainer.mapElementPrefix, MapElement.MapElementType.DRY_FOREST_TERRAIN_TREE), "Assets/Trees/tree_500.png", BABYLON.AbstractMesh.BILLBOARDMODE_NONE, 4.0);
            super.ImportBasicGeometryModelStandardTexture(GeometryType.Plane, null, this.BuildName(MasterModelsContainer.mapElementPrefix, MapElement.MapElementType.TROPICAL_RAIN_FOREST_TERRAIN_TREE), "Assets/Trees/tree_510.png", BABYLON.AbstractMesh.BILLBOARDMODE_NONE, 4.0);
            super.ImportBasicGeometryModelStandardTexture(GeometryType.Plane, null, this.BuildName(MasterModelsContainer.mapElementPrefix, MapElement.MapElementType.DESERT_TERRAIN_TREE), "Assets/Trees/tree_600.png", BABYLON.AbstractMesh.BILLBOARDMODE_NONE, 4.0);

            super.ImportBasicGeometryModelStandardTexture(GeometryType.Plane, null, this.BuildName(MasterModelsContainer.resourcePrefix, Resources.ResourceType.wood), "Assets/Icons/log.png", BABYLON.AbstractMesh.BILLBOARDMODE_ALL, 2.0);
            super.ImportBasicGeometryModelStandardTexture(GeometryType.Plane, null, this.BuildName(MasterModelsContainer.resourcePrefix, Resources.ResourceType.noBuildingAllowed), "Assets/Icons/noBuilding.png", BABYLON.AbstractMesh.BILLBOARDMODE_ALL, 2.0);
            super.ImportBasicGeometryModelStandardTexture(GeometryType.Plane, null, this.BuildName(MasterModelsContainer.resourcePrefix, Resources.ResourceType.population), "Assets/Icons/face.png", BABYLON.AbstractMesh.BILLBOARDMODE_ALL, 2.0);

            super.ImportBasicGeometryModelDynamicTexture(GeometryType.Plane, { isPickable: true }, MasterModelsContainer.panelModelText, null, BABYLON.AbstractMesh.BILLBOARDMODE_X, 100.0, new BABYLON.Vector3(1, 0.3, 1));
        }

        private BuildName(prefix: string, mapElementType: number): string {
            return prefix + mapElementType;
        } 
    }

} 