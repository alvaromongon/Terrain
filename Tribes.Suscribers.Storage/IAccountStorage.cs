using System.Collections.Generic;

namespace Tribes.Suscribers.Storage
{
    interface IAccountStorage
    {
        IEnumerable<Account> LoadAccounts();

        void UpsertAccount(Account account);
    }
}
