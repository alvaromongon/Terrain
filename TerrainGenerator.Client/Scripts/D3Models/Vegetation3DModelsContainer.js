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
        var Vegetation3DModelsContainer = (function (_super) {
            __extends(Vegetation3DModelsContainer, _super);
            function Vegetation3DModelsContainer(scene) {
                _super.call(this, scene);
            }
            Vegetation3DModelsContainer.GetInstance = function (scene) {
                if (Vegetation3DModelsContainer.instance == null) {
                    var vegetationResourceContainer = new Vegetation3DModelsContainer(scene);
                    vegetationResourceContainer.Initialize();
                    Vegetation3DModelsContainer.instance = vegetationResourceContainer;
                }
                return Vegetation3DModelsContainer.instance;
            };
            Vegetation3DModelsContainer.GetExistingInstance = function () {
                return Vegetation3DModelsContainer.instance;
            };
            Vegetation3DModelsContainer.prototype.Initialize = function () {
                _super.prototype.Import3DModel.call(this, "tree_0", "Assets/Trees/", "tree_0.babylon", 0.02);
                _super.prototype.Import3DModel.call(this, "tree_1", "Assets/Trees/", "tree_1.babylon", 0.03);
                _super.prototype.Import3DModel.call(this, "tree_2", "Assets/Trees/", "tree_2.babylon", 0.03);
                _super.prototype.Import3DModel.call(this, "tree_3", "Assets/Trees/", "tree_3.babylon", 0.03);
                _super.prototype.Import3DModel.call(this, "tree_4", "Assets/Trees/", "tree_4.babylon", 0.04);
                _super.prototype.Import3DModel.call(this, "tree_5", "Assets/Trees/", "tree_5.babylon", 0.03);
                _super.prototype.Import3DModel.call(this, "tree_6", "Assets/Trees/", "tree_6.babylon", 0.02);
            };
            return Vegetation3DModelsContainer;
        })(D3Models.Base3DModelsContainer);
        D3Models.Vegetation3DModelsContainer = Vegetation3DModelsContainer;
    })(D3Models = Terrain.D3Models || (Terrain.D3Models = {}));
})(Terrain || (Terrain = {}));
