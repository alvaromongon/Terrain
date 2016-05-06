using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Configuration;
using System.IO;
using System.Web.Script.Serialization;
using TerrainGenerator.Services.Contracts;
using TerrainGenerator.Services.Interfaces;
using TerrainGenerator.Services.Utils;

namespace TerrainGenerator.Services.Implementations.Storage
{
    class ActionRulesFileStorage : BaseFileStorage, IActionRulesStorage
    {
        private readonly JavaScriptSerializer _serializer = new JavaScriptSerializer();

        public ActionRulesFileStorage() : base()
        {
            this.file = "actionRules.json";
            this.folder = ConfigurationManager.AppSettings.Get(ConfigurationKeys.StorageFolder);
            CreateDirectory();
        }
       
        public IEnumerable<ActionRule> LoadActionRules()
        {
            var filePath = this.GetFullFilePath();
            var actionRuleSerialized = string.Empty;

            using (LockFactory.AdquireLock(filePath))
            {
                if (!File.Exists(filePath))
                {
                    var actionRules = this.LoadDefaultActionRules();
                    this.SaveActionRule(actionRules);
                    return actionRules;
                }
                else
                {
                    actionRuleSerialized = File.ReadAllText(filePath);
                }
            }

            if (string.IsNullOrEmpty(actionRuleSerialized))
            {
                return new Collection<ActionRule>();
            }

            return _serializer.Deserialize<IEnumerable<ActionRule>>(actionRuleSerialized);
        }

        public void SaveActionRule(IEnumerable<ActionRule> actionRules)
        {
            var filePath = this.GetFullFilePath();

            using (LockFactory.AdquireLock(filePath))
            {
                if (File.Exists(filePath))
                {
                    File.WriteAllText(filePath, _serializer.Serialize(actionRules));
                }                
            }            
        }

        private IList<ActionRule> LoadDefaultActionRules()
        {
            //TODO this needs to be loaded from a configuration file
            var actionRules = new List<ActionRule>();

            actionRules.Add(new ActionRule
            {
                InitialActionType = ActionType.unemployed,
                InProgressActionType = ActionType.unemployed,
                FinishActionType = ActionType.unemployed,
                InitialMapElementType = MapElementType.empty,
                FinishMapElementType = MapElementType.empty,
                ManPowerNeeded = 1,
                Length = new TimeSpan(0, 0, 0), //0 seconds to be is consumed in one cycle
                ProducedResouce = ResourceType.food,
                ProducedQuantity = 1,
                AutoRenewal = true
            });

            actionRules.Add(new ActionRule
            {
                InitialActionType = ActionType.consume,
                InProgressActionType = ActionType.continueConsuming,
                FinishActionType = ActionType.finishConsumption,
                InitialMapElementType = MapElementType.TROPICAL_RAIN_FOREST_TERRAIN_TREE,
                FinishMapElementType = MapElementType.empty,
                ManPowerNeeded = 1,
                Length = new TimeSpan(0, 0, 30), //30 seconds
                ProducedResouce = ResourceType.wood,
                ProducedQuantity = 1,
                AutoRenewal = false
            });

            actionRules.Add(new ActionRule
            {
                InitialActionType = ActionType.create,
                InProgressActionType = ActionType.continueCreating,
                FinishActionType = ActionType.finishCreation,
                InitialMapElementType = MapElementType.empty,
                FinishMapElementType = MapElementType.tipiBuilding,
                ManPowerNeeded = 1,
                Length = new TimeSpan(0, 0, 60), //60 seconds
                ProducedResouce = ResourceType.empty,
                ProducedQuantity = 0,
                AutoRenewal = false
            });

            actionRules.Add(new ActionRule
            {
                InitialActionType = ActionType.create,
                InProgressActionType = ActionType.continueCreating,
                FinishActionType = ActionType.finishCreation,
                InitialMapElementType = MapElementType.empty,
                FinishMapElementType = MapElementType.thatchedBuilding,
                ManPowerNeeded = 2,
                Length = new TimeSpan(0, 0, 120), //120 seconds
                ProducedResouce = ResourceType.empty,
                ProducedQuantity = 0,
                AutoRenewal = false
            });

            actionRules.Add(new ActionRule
            {
                InitialActionType = ActionType.create,
                InProgressActionType = ActionType.continueCreating,
                FinishActionType = ActionType.finishCreation,
                InitialMapElementType = MapElementType.empty,
                FinishMapElementType = MapElementType.granaryBuilding,
                ManPowerNeeded = 3,
                Length = new TimeSpan(0, 0, 240), //240 seconds
                ProducedResouce = ResourceType.empty,
                ProducedQuantity = 0,
                AutoRenewal = false
            });

            actionRules.Add(new ActionRule
            {
                InitialActionType = ActionType.create,
                InProgressActionType = ActionType.continueCreating,
                FinishActionType = ActionType.finishCreation,
                InitialMapElementType = MapElementType.empty,
                FinishMapElementType = MapElementType.kilnBuilding,
                ManPowerNeeded = 3,
                Length = new TimeSpan(0, 0, 240), //240 seconds
                ProducedResouce = ResourceType.empty,
                ProducedQuantity = 0,
                AutoRenewal = false
            });

            return actionRules;
        }
    }
}
