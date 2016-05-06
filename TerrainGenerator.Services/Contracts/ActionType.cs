namespace TerrainGenerator.Services.Contracts
{
    /// <summary>
    /// Define the different types of actions originated by man power or user interaction
    /// </summary>
    public enum ActionType
    {
        unemployed = 0,

        create = 1, //Create a map element, user action
        continueCreating = 2,
        finishCreation = 3,

        consume = 11, //Consume a resource, map power action
        continueConsuming = 12,
        finishConsumption = 13
        
    }
}