var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Terrain;
(function (Terrain) {
    var Models;
    (function (Models) {
        var ElementedResourcedInstanceModel = (function (_super) {
            __extends(ElementedResourcedInstanceModel, _super);
            function ElementedResourcedInstanceModel(meshes, size, geometry, mapElementType, resourceType) {
                _super.call(this, meshes, size, geometry, resourceType);
                this._inProgressAction = Terrain.Actions.ActionType.emptyAction;
                this._mapElementType = mapElementType;
            }
            ElementedResourcedInstanceModel.RequestCreation = function (north, west, index, finishMapElementType) {
                var initialMapElementType = Terrain.MapElement.MapElementType.empty;
                var actionType = Terrain.Actions.ActionType.create;
                var result = Terrain.Actions.ActionsQueue.GetInstance().Enqueue(north, west, index, initialMapElementType, finishMapElementType, actionType);
                if (result) {
                    Terrain.Sounds.SoundsContainer.GetInstance().Play(actionType, finishMapElementType);
                }
                return result;
            };
            ElementedResourcedInstanceModel.prototype.GetMapElementType = function () {
                return this._mapElementType;
            };
            ElementedResourcedInstanceModel.prototype.HideHoverPanel = function () {
                if (this._inProgressAction == Terrain.Actions.ActionType.emptyAction) {
                    return _super.prototype.HideHoverPanel.call(this);
                }
                return false;
            };
            ElementedResourcedInstanceModel.prototype.ShowHoverPanel = function () {
                if (this._inProgressAction == Terrain.Actions.ActionType.emptyAction) {
                    return _super.prototype.ShowHoverPanel.call(this);
                }
                return false;
            };
            ElementedResourcedInstanceModel.prototype.Dispose = function () {
                if (this._inProgressAction == Terrain.Actions.ActionType.consume) {
                    Terrain.Sounds.SoundsContainer.GetInstance().Play(Terrain.Actions.ActionType.finishConsumption, this._mapElementType);
                }
                _super.prototype.Dispose.call(this);
            };
            return ElementedResourcedInstanceModel;
        })(Models.ResourcedInstanceModel);
        Models.ElementedResourcedInstanceModel = ElementedResourcedInstanceModel;
    })(Models = Terrain.Models || (Terrain.Models = {}));
})(Terrain || (Terrain = {}));
//# sourceMappingURL=ElementedResourcedInstanceModel.js.map