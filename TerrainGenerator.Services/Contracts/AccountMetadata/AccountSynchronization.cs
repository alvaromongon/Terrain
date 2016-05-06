using System.Collections.Generic;

namespace TerrainGenerator.Services.Contracts.AccountMetadata
{
    public class AccountSynchronization : IAccountSynchronization
    {
        //public IEnumerable<Worker> Workers { get; set; }
        public IEnumerable<ResourceStock> Resources { get; set; }
        public IEnumerable<Action> Actions { get; set; }
    }
}
