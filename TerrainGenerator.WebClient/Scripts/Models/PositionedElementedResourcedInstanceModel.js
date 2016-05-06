var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Terrain;
(function (Terrain) {
    var Models;
    (function (Models) {
        var PositionedElementedResourcedInstanceModel = (function (_super) {
            __extends(PositionedElementedResourcedInstanceModel, _super);
            function PositionedElementedResourcedInstanceModel(north, west, index, position, meshes, size, geometry, mapElementType, resourceType) {
                _super.call(this, meshes, size, geometry, mapElementType, resourceType);
                this.north = north;
                this.west = west;
                this.index = index;
                this.SetPosition(position);
            }
            PositionedElementedResourcedInstanceModel.prototype.SetPosition = function (position) {
                _super.prototype.SetPosition.call(this, position);
                this.name = Terrain.Utilities.GetPositionedModelName(position);
            };
            PositionedElementedResourcedInstanceModel.prototype.GetIndex = function () { return this.index; };
            PositionedElementedResourcedInstanceModel.prototype.HasResourceAssociated = function () {
                return this._resourceType != Terrain.Resources.ResourceType.empty;
            };
            PositionedElementedResourcedInstanceModel.prototype.Click = function () {
                if (this._inProgressAction != Terrain.Actions.ActionType.emptyAction || !this.HasResourceAssociated()) {
                    return false;
                }
                // TODO: by default for now the action click is consume
                var actionType = Terrain.Actions.ActionType.consume;
                var finishMapElementType = Terrain.MapElement.MapElementType.empty;
                var result = Terrain.Actions.ActionsQueue.GetInstance().Enqueue(this.north, this.west, this.index, this._mapElementType, finishMapElementType, actionType);
                if (result) {
                    this.HideHoverPanel();
                    this._inProgressAction = actionType;
                    Terrain.Sounds.SoundsContainer.GetInstance().Play(this._inProgressAction, this._mapElementType);
                }
                return result;
            };
            return PositionedElementedResourcedInstanceModel;
        })(Models.ElementedResourcedInstanceModel);
        Models.PositionedElementedResourcedInstanceModel = PositionedElementedResourcedInstanceModel;
    })(Models = Terrain.Models || (Terrain.Models = {}));
})(Terrain || (Terrain = {}));
//# sourceMappingURL=PositionedElementedResourcedInstanceModel.js.map