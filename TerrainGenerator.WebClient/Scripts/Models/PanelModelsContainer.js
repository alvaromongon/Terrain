var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Terrain;
(function (Terrain) {
    var Models;
    (function (Models) {
        var PanelModelsContainer = (function (_super) {
            __extends(PanelModelsContainer, _super);
            function PanelModelsContainer(scene) {
                _super.call(this, scene);
            }
            PanelModelsContainer.Initialize = function (scene) {
                if (PanelModelsContainer.instance == null) {
                    var panelModelsContainer = new PanelModelsContainer(scene);
                    panelModelsContainer.initialize();
                    PanelModelsContainer.instance = panelModelsContainer;
                }
                return PanelModelsContainer.instance;
            };
            PanelModelsContainer.GetInstance = function () {
                return PanelModelsContainer.instance;
            };
            PanelModelsContainer.prototype.GetInstanceModel = function (types) {
                // Types refer here to the resource type
                if (types < 0 || types == Terrain.Resources.ResourceType.emptyResourceType) {
                    return null;
                }
                return _super.prototype.GetInstanceModel.call(this, types);
            };
            PanelModelsContainer.prototype.initialize = function () {
                _super.prototype.ImportBasicGeometryModel.call(this, Models.Geometries.Plane, null, [Terrain.Resources.ResourceType.tree], Terrain.Resources.ResourceType.emptyResourceType, "Assets/Icons/log.png", 1, 2.0, BABYLON.AbstractMesh.BILLBOARDMODE_ALL);
            };
            return PanelModelsContainer;
        })(Models.BaseModelsContainer);
        Models.PanelModelsContainer = PanelModelsContainer;
    })(Models = Terrain.Models || (Terrain.Models = {}));
})(Terrain || (Terrain = {}));
//# sourceMappingURL=PanelModelsContainer.js.map