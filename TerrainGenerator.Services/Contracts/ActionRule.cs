using System;

namespace TerrainGenerator.Services.Contracts
{
    public class ActionRule
    {
        public ActionType InitialActionType { get; set; }
        public ActionType InProgressActionType { get; set; }
        public ActionType FinishActionType { get; set; }
        public MapElementType InitialMapElementType { get; set; }
        public MapElementType FinishMapElementType { get; set; }
        public int ManPowerNeeded { get; set; }
        public TimeSpan Length { get; set; }
        public ResourceType ProducedResouce { get; set; }
        public int ProducedQuantity { get; set; }
        public bool AutoRenewal { get; set; }

    }
}
