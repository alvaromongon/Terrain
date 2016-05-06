var Terrain;
(function (Terrain) {
    var Tiles;
    (function (Tiles) {
        var PositionedModel = (function () {
            function PositionedModel(north, west, index, position, model) {
                this.north = north;
                this.west = west;
                this.index = index;
                this.inProgressAction = Terrain.Actions.ActionType.emptyAction;
                this.model = model;
                if (this.model != null) {
                    this.model.SetPosition(position);
                }
            }
            PositionedModel.PositionedModelFactory = function (north, west, index, position, altitude, terrainType, content) {
                var model = Terrain.Models.ModelsContainerManager.GetInstance().GetResourceInstanceModel(altitude, terrainType, content);
                if (model != null) {
                    return new PositionedModel(north, west, index, position, model);
                }
            };
            PositionedModel.prototype.GetName = function () { return this.model.GetName(); };
            PositionedModel.prototype.GetIndex = function () { return this.index; };
            PositionedModel.prototype.Hide = function () {
                this.model.Hide();
            };
            PositionedModel.prototype.Show = function () {
                this.model.Show();
            };
            PositionedModel.prototype.HideHoverPanel = function () {
                if (this.inProgressAction == Terrain.Actions.ActionType.emptyAction) {
                    this.model.DeHighLight();
                    return this.model.HideHoverPanel();
                }
            };
            PositionedModel.prototype.ShowHoverPanel = function () {
                if (this.inProgressAction == Terrain.Actions.ActionType.emptyAction) {
                    this.model.HighLight();
                    return this.model.ShowHoverPanel();
                }
            };
            PositionedModel.prototype.Dispose = function () {
                if (this.inProgressAction != Terrain.Actions.ActionType.emptyAction) {
                    Terrain.Sounds.SoundsContainer.GetInstance().Play(Terrain.Actions.ActionType.finishConsumption, this.model.GetResourceType());
                }
                this.model.LaunchParticles();
                this.model.Hide();
                this.model = null;
            };
            PositionedModel.prototype.Click = function () {
                if (this.inProgressAction != Terrain.Actions.ActionType.emptyAction || !this.model.HasResourceAssociated()) {
                    return false;
                }
                // TODO: by default for now the action click is consume
                var actionType = Terrain.Actions.ActionType.consume;
                var result = Terrain.Actions.ActionsQueue.GetInstance().Enqueue(this.north, this.west, this.index, this.model.GetResourceType(), actionType);
                if (result) {
                    this.HideHoverPanel();
                    this.model.HighLight();
                    this.inProgressAction = actionType;
                    Terrain.Sounds.SoundsContainer.GetInstance().Play(this.inProgressAction, this.model.GetResourceType());
                }
                return result;
            };
            return PositionedModel;
        })();
        Tiles.PositionedModel = PositionedModel;
    })(Tiles = Terrain.Tiles || (Terrain.Tiles = {}));
})(Terrain || (Terrain = {}));
//# sourceMappingURL=PositionedModel.js.map