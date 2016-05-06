using System.Collections.Generic;
using TerrainGenerator.Services.Contracts;

namespace TerrainGenerator.Services.Interfaces
{
    interface IAccountStorage
    {
        IEnumerable<Account> LoadAccounts();

        void UpsertAccount(Account account);
    }
}
