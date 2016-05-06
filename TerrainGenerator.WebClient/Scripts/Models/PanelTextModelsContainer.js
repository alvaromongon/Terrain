var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Terrain;
(function (Terrain) {
    var Models;
    (function (Models) {
        var PanelTextModelsContainer = (function (_super) {
            __extends(PanelTextModelsContainer, _super);
            function PanelTextModelsContainer(scene) {
                _super.call(this, scene);
            }
            PanelTextModelsContainer.Initialize = function (scene) {
                if (PanelTextModelsContainer.instance == null) {
                    var panelTextModelsContainer = new PanelTextModelsContainer(scene);
                    panelTextModelsContainer.initialize();
                    PanelTextModelsContainer.instance = panelTextModelsContainer;
                }
                return PanelTextModelsContainer.instance;
            };
            PanelTextModelsContainer.GetInstance = function () {
                return PanelTextModelsContainer.instance;
            };
            PanelTextModelsContainer.prototype.GetPanelText = function (textKey) {
                // Types refer here to the text key of the text to show
                var text = Terrain.Localization.LocalizationManager.GetInstance().GetText(textKey);
                if (!text || text.length == 0) {
                    return null;
                }
                var modelName = PanelTextModelsContainer.modelName;
                var meshes = _super.prototype.CreateNewModelInstanceMeshes.call(this, modelName);
                if (meshes == null) {
                    return null;
                }
                var geometry = _super.prototype.GetBasicModelGeometry.call(this, modelName);
                var model = new Models.BaseInstanceModel(meshes, this.sizes.getByKey(modelName), geometry);
                model.WriteText(text);
                return model;
            };
            PanelTextModelsContainer.prototype.initialize = function () {
                _super.prototype.ImportBasicGeometryModelDynamicTexture.call(this, Models.GeometryType.Plane, { isPickable: true }, PanelTextModelsContainer.modelName, null, BABYLON.AbstractMesh.BILLBOARDMODE_X, 100.0, new BABYLON.Vector3(1, 0.3, 1));
            };
            PanelTextModelsContainer.modelName = "panelText";
            return PanelTextModelsContainer;
        })(Models.BaseModelsContainer);
        Models.PanelTextModelsContainer = PanelTextModelsContainer;
    })(Models = Terrain.Models || (Terrain.Models = {}));
})(Terrain || (Terrain = {}));
//# sourceMappingURL=PanelTextModelsContainer.js.map