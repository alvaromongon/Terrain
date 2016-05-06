module Terrain.Models {

    export class AnimalModelsContainer extends BaseModelsContainer {

        private static instance: AnimalModelsContainer;

        public static GetInstance(scene: BABYLON.Scene): AnimalModelsContainer {
            if (AnimalModelsContainer.instance == null) {
                var animal3DModelsContainer = new AnimalModelsContainer(scene);
                animal3DModelsContainer.Initialize();
                AnimalModelsContainer.instance = animal3DModelsContainer;
            }

            return AnimalModelsContainer.instance;
        }

        public static GetExistingInstance(): AnimalModelsContainer {
            return AnimalModelsContainer.instance;
        }

        constructor(scene: BABYLON.Scene) {
            super(scene);
        }

        private Initialize(): void {
            super.ImportComplexGeometryDBabylonModel(this.BuildName(100), "Assets/People/", "dude.babylon", 0.5);
        }

        private BuildName(objectType: number): string {
            return "ani_" + objectType;
        }
    }

} 