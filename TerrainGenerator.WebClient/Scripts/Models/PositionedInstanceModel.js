var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Terrain;
(function (Terrain) {
    var Models;
    (function (Models) {
        var PositionedInstanceModel = (function (_super) {
            __extends(PositionedInstanceModel, _super);
            function PositionedInstanceModel(north, west, index, position, meshes, size, geometry, resourceType) {
                _super.call(this, meshes, size, geometry);
                this.north = north;
                this.west = west;
                this.index = index;
                this.inProgressAction = Terrain.Actions.ActionType.emptyAction;
                this.SetPosition(position);
                this.Show();
                this.resourceType = resourceType;
            }
            PositionedInstanceModel.RequestCreation = function (north, west, index, resourceType) {
                var actionType = Terrain.Actions.ActionType.create;
                var result = Terrain.Actions.ActionsQueue.GetInstance().Enqueue(north, west, index, resourceType, actionType);
                if (result) {
                    Terrain.Sounds.SoundsContainer.GetInstance().Play(actionType, resourceType);
                }
                return result;
            };
            PositionedInstanceModel.prototype.SetPosition = function (position) {
                _super.prototype.SetPosition.call(this, position);
                this.name = Terrain.Utilities.GetPositionedModelName(position);
            };
            PositionedInstanceModel.prototype.GetIndex = function () { return this.index; };
            PositionedInstanceModel.prototype.HasResourceAssociated = function () {
                return this.resourceType != Terrain.Resources.ResourceType.emptyResourceType;
            };
            PositionedInstanceModel.prototype.HideHoverPanel = function () {
                if (this.inProgressAction == Terrain.Actions.ActionType.emptyAction) {
                    if (this.HasResourceAssociated() && this.hoverPanel != null) {
                        this.hoverPanel.Hide();
                        return true;
                    }
                    return false;
                }
            };
            PositionedInstanceModel.prototype.ShowHoverPanel = function () {
                if (this.inProgressAction == Terrain.Actions.ActionType.emptyAction) {
                    if (this.HasResourceAssociated()) {
                        if (this.hoverPanel == null) {
                            this.hoverPanel = Terrain.Models.PanelResourceModelsContainer.GetInstance().GetModelInstance(this.resourceType);
                        }
                        if (this.hoverPanel != null) {
                            var modelPosition = this.GetPosition();
                            if (this.hoverPanel.GetPosition() == null || this.hoverPanel.GetPosition().x != modelPosition.x || this.hoverPanel.GetPosition().z != modelPosition.z) {
                                this.hoverPanel.SetPosition(new BABYLON.Vector3(modelPosition.x, modelPosition.y + this.GetSize() * 1.2, modelPosition.z));
                            }
                            this.hoverPanel.Show();
                            return true;
                        }
                    }
                    return false;
                }
            };
            PositionedInstanceModel.prototype.Dispose = function () {
                if (this.inProgressAction != Terrain.Actions.ActionType.emptyAction) {
                    Terrain.Sounds.SoundsContainer.GetInstance().Play(Terrain.Actions.ActionType.finishConsumption, this.resourceType);
                }
                _super.prototype.LaunchParticles.call(this);
                _super.prototype.Dispose.call(this);
            };
            PositionedInstanceModel.prototype.Click = function () {
                if (this.inProgressAction != Terrain.Actions.ActionType.emptyAction || !this.HasResourceAssociated()) {
                    return false;
                }
                // TODO: by default for now the action click is consume
                var actionType = Terrain.Actions.ActionType.consume;
                var result = Terrain.Actions.ActionsQueue.GetInstance().Enqueue(this.north, this.west, this.index, this.resourceType, actionType);
                if (result) {
                    this.HideHoverPanel();
                    this.inProgressAction = actionType;
                    Terrain.Sounds.SoundsContainer.GetInstance().Play(this.inProgressAction, this.resourceType);
                }
                return result;
            };
            return PositionedInstanceModel;
        })(Models.BaseInstanceModel);
        Models.PositionedInstanceModel = PositionedInstanceModel;
    })(Models = Terrain.Models || (Terrain.Models = {}));
})(Terrain || (Terrain = {}));
//# sourceMappingURL=PositionedInstanceModel.js.map