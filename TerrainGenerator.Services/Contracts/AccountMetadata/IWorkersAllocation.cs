namespace TerrainGenerator.Services.Contracts.AccountMetadata
{
    public interface IWorkersAllocation
    {
        /// <summary>
        /// This works like the id of the resource
        /// Eg.: NortTile_WestTitle_X_Y
        /// </summary>
        string ResourceAssignedLocation { get; set; } 

        /// <summary>
        /// List of workers working on this resource
        /// </summary>
        string[] Workers { get; set; }
    }
}
