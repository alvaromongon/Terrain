module Terrain.Sounds { 
      
    export class SoundsContainer{

        private scene: BABYLON.Scene;

        private sounds: Terrain.Utilities.Dictionary<BABYLON.Sound>;

        private static instance: SoundsContainer;

        constructor(scene: BABYLON.Scene) {
            this.scene = scene;
            this.sounds = new Terrain.Utilities.Dictionary<BABYLON.Sound>();
        }

        public static Initialize(scene: BABYLON.Scene): void {
            if (SoundsContainer.instance == null) {
                var soundsContainer = new SoundsContainer(scene);

                soundsContainer.ImportSound(soundsContainer.BuildSoundName(Actions.ActionType.consume, MapElement.MapElementType.TROPICAL_RAIN_FOREST_TERRAIN_TREE), "Assets/Sounds/axe_chopping_tree.mp3");
                soundsContainer.ImportSound(soundsContainer.BuildSoundName(Actions.ActionType.finishConsumption, MapElement.MapElementType.TROPICAL_RAIN_FOREST_TERRAIN_TREE), "Assets/Sounds/tree_falls_down.mp3");
                
                soundsContainer.ImportSound(soundsContainer.BuildSoundName(Actions.ActionType.create, MapElement.MapElementType.thatchedBuilding), "Assets/Sounds/hammer_hitting_nail_into_wood.mp3");

                SoundsContainer.instance = soundsContainer;
            }
        }

        public static GetInstance(): SoundsContainer {
            return SoundsContainer.instance;
        }

        public Play(action: Actions.ActionType, mapElementType: MapElement.MapElementType): void {
            var result = this.sounds.getByKey(this.BuildSoundName(action, mapElementType));

            if (result) {
                result.play();
            }
        }

        private BuildSoundName(action: Actions.ActionType, mapElementType: MapElement.MapElementType): string {
            return action + "_" + mapElementType;
        }

        private ImportSound(name: string, url: string) {
            this.sounds.add(name, new BABYLON.Sound(name, url, this.scene));
        }
    }

}  