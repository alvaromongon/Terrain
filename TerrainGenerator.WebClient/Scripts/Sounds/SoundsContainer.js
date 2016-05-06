var Terrain;
(function (Terrain) {
    var Sounds;
    (function (Sounds) {
        var SoundsContainer = (function () {
            function SoundsContainer(scene) {
                this.scene = scene;
                this.sounds = new Terrain.Utilities.Dictionary();
            }
            SoundsContainer.Initialize = function (scene) {
                if (SoundsContainer.instance == null) {
                    var soundsContainer = new SoundsContainer(scene);
                    soundsContainer.ImportSound(soundsContainer.BuildSoundName(Terrain.Actions.ActionType.consume, Terrain.MapElement.MapElementType.TROPICAL_RAIN_FOREST_TERRAIN_TREE), "Assets/Sounds/axe_chopping_tree.mp3");
                    soundsContainer.ImportSound(soundsContainer.BuildSoundName(Terrain.Actions.ActionType.finishConsumption, Terrain.MapElement.MapElementType.TROPICAL_RAIN_FOREST_TERRAIN_TREE), "Assets/Sounds/tree_falls_down.mp3");
                    soundsContainer.ImportSound(soundsContainer.BuildSoundName(Terrain.Actions.ActionType.create, Terrain.MapElement.MapElementType.thatchedBuilding), "Assets/Sounds/hammer_hitting_nail_into_wood.mp3");
                    SoundsContainer.instance = soundsContainer;
                }
            };
            SoundsContainer.GetInstance = function () {
                return SoundsContainer.instance;
            };
            SoundsContainer.prototype.Play = function (action, mapElementType) {
                var result = this.sounds.getByKey(this.BuildSoundName(action, mapElementType));
                if (result) {
                    result.play();
                }
            };
            SoundsContainer.prototype.BuildSoundName = function (action, mapElementType) {
                return action + "_" + mapElementType;
            };
            SoundsContainer.prototype.ImportSound = function (name, url) {
                this.sounds.add(name, new BABYLON.Sound(name, url, this.scene));
            };
            return SoundsContainer;
        })();
        Sounds.SoundsContainer = SoundsContainer;
    })(Sounds = Terrain.Sounds || (Terrain.Sounds = {}));
})(Terrain || (Terrain = {}));
//# sourceMappingURL=SoundsContainer.js.map