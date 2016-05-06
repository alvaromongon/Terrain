var Terrain;
(function (Terrain) {
    var Models;
    (function (Models) {
        var ModelsContainerManager = (function () {
            function ModelsContainerManager() {
            }
            ModelsContainerManager.Initialize = function (scene) {
                if (ModelsContainerManager.instance == null) {
                    var modelsContainerManager = new ModelsContainerManager();
                    Terrain.Models.MasterModelsContainer.Initialize(scene);
                    ModelsContainerManager.instance = modelsContainerManager;
                }
            };
            ModelsContainerManager.GetInstance = function () {
                return ModelsContainerManager.instance;
            };
            return ModelsContainerManager;
        })();
        Models.ModelsContainerManager = ModelsContainerManager;
    })(Models = Terrain.Models || (Terrain.Models = {}));
})(Terrain || (Terrain = {}));
//# sourceMappingURL=ModelsContainerManager.js.map