module Terrain.D3Models {

    export class Animal3DModelsContainer extends Base3DModelsContainer {

        private static instance: I3DModelsContainer;

        public static GetInstance(scene: BABYLON.Scene): I3DModelsContainer {
            if (Animal3DModelsContainer.instance == null) {
                var animal3DModelsContainer = new Animal3DModelsContainer(scene);
                animal3DModelsContainer.Initialize();
                Animal3DModelsContainer.instance = animal3DModelsContainer;
            }

            return Animal3DModelsContainer.instance;
        }

        public static GetExistingInstance(): I3DModelsContainer {
            return Animal3DModelsContainer.instance;
        }

        constructor(scene: BABYLON.Scene) {
            super(scene);
        }

        private Initialize(): void {
            super.Import3DModel("man", "Assets/People/", "dude.babylon", 0.5);
        }
    }

} 