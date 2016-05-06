using System.Collections.Generic;
using System.Linq;
using TerrainGenerator.Services.Contracts;
using TerrainGenerator.Services.Interfaces;
using Action = TerrainGenerator.Services.Contracts.Action;

namespace TerrainGenerator.Services.Implementations
{    
    internal class ActionRulesService : IActionRulesService
    {
        private IActionRulesStorage _actionRulesStorage;

        private IList<ActionRule> actionRules { get; set; }

        public ActionRulesService(IActionRulesStorage actionRulesStorage)
        {
            _actionRulesStorage = actionRulesStorage;

            this.actionRules = this._actionRulesStorage.LoadActionRules().ToList();           
        }

        public ActionRule GetApplicableRule(Action action)
        {
            return this.actionRules.FirstOrDefault(
                    actionMetadata =>
                        actionMetadata.InitialActionType == action.ActionType
                        && actionMetadata.InitialMapElementType == action.InitialMapElementType
                        && actionMetadata.FinishMapElementType == action.FinishMapElementType);
        }        
    }
}
