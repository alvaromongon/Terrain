var Terrain;
(function (Terrain) {
    var Actions;
    (function (Actions) {
        (function (ActionType) {
            ActionType[ActionType["emptyAction"] = -999] = "emptyAction";
            ActionType[ActionType["create"] = 1] = "create";
            ActionType[ActionType["continueCreating"] = 2] = "continueCreating";
            ActionType[ActionType["finishCreation"] = 3] = "finishCreation";
            ActionType[ActionType["consume"] = 11] = "consume";
            ActionType[ActionType["continueConsuming"] = 12] = "continueConsuming";
            ActionType[ActionType["finishConsumption"] = 13] = "finishConsumption";
        })(Actions.ActionType || (Actions.ActionType = {}));
        var ActionType = Actions.ActionType;
        var ActionsQueue = (function () {
            function ActionsQueue() {
                this.actions = new Array();
            }
            ActionsQueue.GetInstance = function () {
                if (ActionsQueue.instance == null) {
                    ActionsQueue.instance = new ActionsQueue();
                }
                return ActionsQueue.instance;
            };
            ActionsQueue.prototype.SetRules = function (rules) {
                this.rules = rules;
            };
            ActionsQueue.prototype.GetPendingActions = function () {
                var pendingActions = this.actions;
                this.actions = new Array();
                return pendingActions;
            };
            ActionsQueue.prototype.Enqueue = function (north, west, index, initialMapElementType, finishMapElementType, actionType) {
                if (actionType == ActionType.emptyAction) {
                    return false;
                }
                var applicableRule = this.GetApplicableRule(initialMapElementType, finishMapElementType, actionType);
                var resourceUpdate;
                if (applicableRule != null) {
                    var availableManPower = Terrain.Resources.ResourcesManager.GetInstance().GetResource(Terrain.Resources.ResourceType.unemployedManpower).Stock;
                    if (availableManPower < applicableRule.ManPowerNeeded) {
                        return false;
                    }
                    resourceUpdate = { Stock: availableManPower - applicableRule.ManPowerNeeded, ResourceType: Terrain.Resources.ResourceType.unemployedManpower };
                }
                var action = {
                    North: north,
                    West: west,
                    Index: index,
                    InitialMapElementType: initialMapElementType,
                    FinishMapElementType: finishMapElementType,
                    ActionType: actionType,
                };
                this.actions.push(action);
                if (resourceUpdate != null) {
                    Terrain.Resources.ResourcesManager.GetInstance().AddUpdateResource(resourceUpdate);
                }
                return true;
            };
            ActionsQueue.prototype.GetApplicableRule = function (initialMapElementType, finishMapElementType, actionType) {
                var filteredRules = this.rules.filter(function (rule) { return rule.InitialActionType == actionType && rule.InitialMapElementType == initialMapElementType && rule.FinishMapElementType == finishMapElementType; });
                if (filteredRules.length > 0) {
                    return filteredRules[0];
                }
                return null;
            };
            return ActionsQueue;
        })();
        Actions.ActionsQueue = ActionsQueue;
    })(Actions = Terrain.Actions || (Terrain.Actions = {}));
})(Terrain || (Terrain = {}));
//# sourceMappingURL=ActionsQueue.js.map