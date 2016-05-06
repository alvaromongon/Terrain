module Terrain.Actions {

    export enum ActionType {
        emptyAction = -999, //This action does not exist in the back end

        create = 1, //Create a map element, user action
        continueCreating = 2,
        finishCreation = 3,

        consume = 11, //Consume a resource, map power action
        continueConsuming = 12,
        finishConsumption = 13
    }

    export class ActionsQueue {

        private static instance: ActionsQueue;

        private actions: Array<IAction>;
        private rules: Array<System.IRule>

        public static GetInstance(): ActionsQueue {
            if (ActionsQueue.instance == null) {
                ActionsQueue.instance = new ActionsQueue();
            }

            return ActionsQueue.instance;
        }

        constructor() {
            this.actions = new Array<IAction>();
        }

        public SetRules(rules: Array<System.IRule>) {
            this.rules = rules;
        }

        public GetPendingActions(): Array<IAction> {
            var pendingActions  = this.actions;
            this.actions = new Array<IAction>();

            return pendingActions;
        }

        public Enqueue(north: number, west: number, index: number, initialMapElementType: MapElement.MapElementType, finishMapElementType: MapElement.MapElementType, actionType: ActionType): boolean {
            
            if (actionType == ActionType.emptyAction) {
                return false;
            }

            var applicableRule = this.GetApplicableRule(initialMapElementType, finishMapElementType, actionType);

            var resourceUpdate: Terrain.Resources.IResourceUpdate;
            if (applicableRule != null) {
                var availableManPower = Terrain.Resources.ResourcesManager.GetInstance().GetResource(Resources.ResourceType.unemployedManpower).Stock;

                if (availableManPower < applicableRule.ManPowerNeeded) {
                    return false;
                }

                resourceUpdate = { Stock: availableManPower - applicableRule.ManPowerNeeded, ResourceType: Resources.ResourceType.unemployedManpower }
            }

            var action: IAction =
                {
                    North: north,
                    West: west,
                    Index: index,
                    InitialMapElementType: initialMapElementType,
                    FinishMapElementType: finishMapElementType,
                    ActionType: actionType,
                }
            this.actions.push(action);

            if (resourceUpdate != null) {
                Terrain.Resources.ResourcesManager.GetInstance().AddUpdateResource(resourceUpdate);                
            }            

            return true;
        }

        private GetApplicableRule(initialMapElementType: MapElement.MapElementType, finishMapElementType: MapElement.MapElementType, actionType: ActionType): System.IRule {
            var filteredRules = this.rules.filter((rule) => rule.InitialActionType == actionType && rule.InitialMapElementType == initialMapElementType && rule.FinishMapElementType == finishMapElementType);

            if (filteredRules.length > 0) {
                return filteredRules[0];
            }

            return null;
        }


    }
}     