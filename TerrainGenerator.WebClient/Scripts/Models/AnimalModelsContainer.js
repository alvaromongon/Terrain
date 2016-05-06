var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Terrain;
(function (Terrain) {
    var Models;
    (function (Models) {
        var AnimalModelsContainer = (function (_super) {
            __extends(AnimalModelsContainer, _super);
            function AnimalModelsContainer(scene) {
                _super.call(this, scene);
            }
            AnimalModelsContainer.GetInstance = function (scene) {
                if (AnimalModelsContainer.instance == null) {
                    var animal3DModelsContainer = new AnimalModelsContainer(scene);
                    animal3DModelsContainer.Initialize();
                    AnimalModelsContainer.instance = animal3DModelsContainer;
                }
                return AnimalModelsContainer.instance;
            };
            AnimalModelsContainer.GetExistingInstance = function () {
                return AnimalModelsContainer.instance;
            };
            AnimalModelsContainer.prototype.Initialize = function () {
                _super.prototype.ImportComplexGeometryDBabylonModel.call(this, this.BuildName(100), "Assets/People/", "dude.babylon", 0.5);
            };
            AnimalModelsContainer.prototype.BuildName = function (objectType) {
                return "ani_" + objectType;
            };
            return AnimalModelsContainer;
        })(Models.BaseModelsContainer);
        Models.AnimalModelsContainer = AnimalModelsContainer;
    })(Models = Terrain.Models || (Terrain.Models = {}));
})(Terrain || (Terrain = {}));
//# sourceMappingURL=AnimalModelsContainer.js.map