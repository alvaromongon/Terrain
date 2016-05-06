module Terrain.D3Models {   

    export class Vegetation3DModelsContainer extends Base3DModelsContainer {

        private static instance: I3DModelsContainer;

        public static GetInstance(scene: BABYLON.Scene): I3DModelsContainer {
            if (Vegetation3DModelsContainer.instance == null) {
                var vegetationResourceContainer = new Vegetation3DModelsContainer(scene);
                vegetationResourceContainer.Initialize();
                Vegetation3DModelsContainer.instance = vegetationResourceContainer;
            }

            return Vegetation3DModelsContainer.instance;
        }

        public static GetExistingInstance(): I3DModelsContainer {
            return Vegetation3DModelsContainer.instance;
        }

        constructor(scene: BABYLON.Scene) {
            super(scene);
        }

        private Initialize(): void {
            super.Import3DModel("tree_0", "Assets/Trees/", "tree_0.babylon", 0.02);
            super.Import3DModel("tree_1", "Assets/Trees/", "tree_1.babylon", 0.03);
            super.Import3DModel("tree_2", "Assets/Trees/", "tree_2.babylon", 0.03);
            super.Import3DModel("tree_3", "Assets/Trees/", "tree_3.babylon", 0.03);
            super.Import3DModel("tree_4", "Assets/Trees/", "tree_4.babylon", 0.04);
            super.Import3DModel("tree_5", "Assets/Trees/", "tree_5.babylon", 0.03);
            super.Import3DModel("tree_6", "Assets/Trees/", "tree_6.babylon", 0.02);
        }      
    }

} 