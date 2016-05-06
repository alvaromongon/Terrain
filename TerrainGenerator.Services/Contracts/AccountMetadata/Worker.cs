using System;

namespace TerrainGenerator.Services.Contracts.AccountMetadata
{
    [Serializable]
    public class Worker
    {
        public Worker()
        {
            this.Id = Guid.NewGuid().ToString();
        }

        public string Id { get; private set; }

        /// <summary>
        /// This works like the id of the resource
        /// Eg.: NortTile_WestTitle_X_Y
        /// </summary>
        public string ResourceAssignedLocation { get; set; }
    }
}
