namespace TerrainGenerator.Services.Contracts
{
    public class Action : CellMetadata
    {
        public Action()
        {
            
        }

        public Action(Action action) : base (action)
        {
            this.ActionType = action.ActionType;
        }

        public ActionType ActionType { get; set; }        
    }
}