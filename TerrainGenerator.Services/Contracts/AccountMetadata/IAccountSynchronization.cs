using System.Collections.Generic;

namespace TerrainGenerator.Services.Contracts.AccountMetadata
{
    public interface IAccountSynchronization
    {
        //IEnumerable<Worker> Workers { get; set; }
        IEnumerable<ResourceStock> Resources { get; set; }
        IEnumerable<Action> Actions { get; set; }
    }
}
