module Terrain.Models { 
      
    export class ModelsContainerManager{

        private static instance: ModelsContainerManager;       

        public static Initialize(scene: BABYLON.Scene): void {
            if (ModelsContainerManager.instance == null) {
                var modelsContainerManager = new ModelsContainerManager();

                Terrain.Models.MasterModelsContainer.Initialize(scene);
                                
                ModelsContainerManager.instance = modelsContainerManager;
            }            
        }

        public static GetInstance(): ModelsContainerManager {
            return ModelsContainerManager.instance;
        }
    }

} 