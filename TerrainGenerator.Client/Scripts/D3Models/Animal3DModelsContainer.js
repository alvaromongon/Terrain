var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Terrain;
(function (Terrain) {
    var D3Models;
    (function (D3Models) {
        var Animal3DModelsContainer = (function (_super) {
            __extends(Animal3DModelsContainer, _super);
            function Animal3DModelsContainer(scene) {
                _super.call(this, scene);
            }
            Animal3DModelsContainer.GetInstance = function (scene) {
                if (Animal3DModelsContainer.instance == null) {
                    var animal3DModelsContainer = new Animal3DModelsContainer(scene);
                    animal3DModelsContainer.Initialize();
                    Animal3DModelsContainer.instance = animal3DModelsContainer;
                }
                return Animal3DModelsContainer.instance;
            };
            Animal3DModelsContainer.GetExistingInstance = function () {
                return Animal3DModelsContainer.instance;
            };
            Animal3DModelsContainer.prototype.Initialize = function () {
                _super.prototype.Import3DModel.call(this, "man", "Assets/People/", "dude.babylon", 0.5);
            };
            return Animal3DModelsContainer;
        })(D3Models.Base3DModelsContainer);
        D3Models.Animal3DModelsContainer = Animal3DModelsContainer;
    })(D3Models = Terrain.D3Models || (Terrain.D3Models = {}));
})(Terrain || (Terrain = {}));
