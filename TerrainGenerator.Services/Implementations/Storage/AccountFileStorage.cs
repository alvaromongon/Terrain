using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Configuration;
using System.IO;
using System.Linq;
using System.Web.Script.Serialization;
using TerrainGenerator.Services.Contracts;
using TerrainGenerator.Services.Interfaces;
using TerrainGenerator.Services.Utils;

namespace TerrainGenerator.Services.Implementations.Storage
{
    class AccountFileStorage : BaseFileStorage, IAccountStorage
    {
        private readonly JavaScriptSerializer _serializer = new JavaScriptSerializer();

        public AccountFileStorage() : base()
        {
            this.file = "accounts.json";
            this.folder = ConfigurationManager.AppSettings.Get(ConfigurationKeys.StorageFolder);
            CreateDirectory();
        }
       
        public IEnumerable<Account> LoadAccounts()
        {
            var filePath = this.GetFullFilePath();
            var accountsSerialized = string.Empty;

            using (LockFactory.AdquireLock(filePath))
            {
                if (File.Exists(filePath))
                {
                    accountsSerialized = File.ReadAllText(filePath);
                }
            }

            if (string.IsNullOrEmpty(accountsSerialized))
            {
                return new Collection<Account>();
            }

            return _serializer.Deserialize<IEnumerable<Account>>(accountsSerialized);
        }

        public void UpsertAccount(Account account)
        {
            var filePath = this.GetFullFilePath();

            using (LockFactory.AdquireLock(filePath))
            {
                var accounts = LoadAccounts().ToList();

                var previousAccount = accounts.SingleOrDefault(acc => acc.Id == account.Id);

                if (previousAccount == null)
                {
                    accounts.Add(account);
                }
                else
                {
                    previousAccount.CopyVariableDataFrom(account);
                }

                File.WriteAllText(filePath, _serializer.Serialize(accounts));
            }            
        }
    }
}
