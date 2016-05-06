var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Terrain;
(function (Terrain) {
    var Models;
    (function (Models) {
        var PositionedResourcedInstanceModel = (function (_super) {
            __extends(PositionedResourcedInstanceModel, _super);
            function PositionedResourcedInstanceModel(north, west, index, position, meshes, size, geometry, resourceType) {
                _super.call(this, meshes, size, geometry, resourceType);
                this.north = north;
                this.west = west;
                this.index = index;
                this.inProgressAction = Terrain.Actions.ActionType.emptyAction;
                this.SetPosition(position);
                this.Show();
            }
            PositionedResourcedInstanceModel.RequestCreation = function (north, west, index, resourceType) {
                var actionType = Terrain.Actions.ActionType.create;
                var result = Terrain.Actions.ActionsQueue.GetInstance().Enqueue(north, west, index, resourceType, actionType);
                if (result) {
                    Terrain.Sounds.SoundsContainer.GetInstance().Play(actionType, resourceType);
                }
                return result;
            };
            PositionedResourcedInstanceModel.prototype.SetPosition = function (position) {
                _super.prototype.SetPosition.call(this, position);
                this.name = Terrain.Utilities.GetPositionedModelName(position);
            };
            PositionedResourcedInstanceModel.prototype.GetIndex = function () { return this.index; };
            PositionedResourcedInstanceModel.prototype.HasResourceAssociated = function () {
                return this._resourceType != Terrain.Resources.ResourceType.emptyResourceType;
            };
            PositionedResourcedInstanceModel.prototype.HideHoverPanel = function () {
                if (this.inProgressAction == Terrain.Actions.ActionType.emptyAction) {
                    return _super.prototype.HideHoverPanel.call(this);
                }
            };
            PositionedResourcedInstanceModel.prototype.ShowHoverPanel = function () {
                if (this.inProgressAction == Terrain.Actions.ActionType.emptyAction) {
                    return _super.prototype.ShowHoverPanel.call(this);
                }
            };
            PositionedResourcedInstanceModel.prototype.Dispose = function () {
                if (this.inProgressAction == Terrain.Actions.ActionType.consume) {
                    Terrain.Sounds.SoundsContainer.GetInstance().Play(Terrain.Actions.ActionType.finishConsumption, this._resourceType);
                }
                _super.prototype.Dispose.call(this);
            };
            PositionedResourcedInstanceModel.prototype.Click = function () {
                if (this.inProgressAction != Terrain.Actions.ActionType.emptyAction || !this.HasResourceAssociated()) {
                    return false;
                }
                // TODO: by default for now the action click is consume
                var actionType = Terrain.Actions.ActionType.consume;
                var result = Terrain.Actions.ActionsQueue.GetInstance().Enqueue(this.north, this.west, this.index, this._resourceType, actionType);
                if (result) {
                    this.HideHoverPanel();
                    this.inProgressAction = actionType;
                    Terrain.Sounds.SoundsContainer.GetInstance().Play(this.inProgressAction, this._resourceType);
                }
                return result;
            };
            return PositionedResourcedInstanceModel;
        })(Models.ResourcedInstanceModel);
        Models.PositionedResourcedInstanceModel = PositionedResourcedInstanceModel;
    })(Models = Terrain.Models || (Terrain.Models = {}));
})(Terrain || (Terrain = {}));
//# sourceMappingURL=PositionedResourcedInstanceModel.js.map