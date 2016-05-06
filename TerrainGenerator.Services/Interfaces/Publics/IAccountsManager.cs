using System;
using System.Collections.Generic;
using TerrainGenerator.Services.Contracts;

namespace TerrainGenerator.Services.Interfaces
{
    public interface IAccountsManager : IDisposable
    {
        Account GetAccount(string accountId);

        IEnumerable<Account> GetActiveAccounts();

        Account ActivateAccount(string activationId);

        void AddAccount(string accountId, string accountPassword, Uri activationUri);

        void UpdateAccount(Account accountNewValues);

        void UpsertAccount(Account account);

    }
}
