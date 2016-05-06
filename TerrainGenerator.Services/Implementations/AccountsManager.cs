using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.IO;
using System.Linq;
using TerrainGenerator.Services.Contracts;
using TerrainGenerator.Services.Interfaces;
using TerrainGenerator.Services.Interfaces.Internals;

namespace TerrainGenerator.Services.Implementations
{
    internal class AccountsManager : IAccountsManager
    {
        private readonly IDictionary<string,Account> _accounts;
        private readonly IAccountStorage _accountStorage;
        private readonly IAccountNotificationService _accountNotificationService;

        public AccountsManager(IAccountStorage accountStorage, IAccountNotificationService accountNotificationService)
        {
            this._accountStorage = accountStorage;
            this._accountNotificationService = accountNotificationService;

            this._accounts = this._accountStorage.LoadAccounts().ToDictionary(acc1 => acc1.AccountId, acc2 => acc2);
        }

        public Account GetAccount(string accountId)
        {
            if (string.IsNullOrEmpty(accountId))
            {
                throw new ArgumentNullException("accountId");
            }

            Account foundAccount;
            _accounts.TryGetValue(accountId, out foundAccount);

            return foundAccount;
        }

        public IEnumerable<Account> GetActiveAccounts()
        {
            return _accounts.Values.Where(account => account.Active);
        }

        public Account ActivateAccount(string activationId)
        {
            if (string.IsNullOrEmpty(activationId))
            {
                throw new ArgumentNullException("activationId");
            }

            var foundAccount = _accounts.Values.SingleOrDefault(account => account.ActivationId == Guid.Parse(activationId));

            if (foundAccount != null)
            {
                if (foundAccount.Active)
                {
                    throw new DataMisalignedException("Account already active");
                }

                foundAccount.Active = true;
                _accountStorage.UpsertAccount(foundAccount);
            }

            return foundAccount;
        }

        public void AddAccount(string accountId, string accountPassword, Uri activationUri)
        {      
            if (string.IsNullOrEmpty(accountId))
            {
                throw new ArgumentNullException("accountId");
            }

            Account foundAccount;
            if (_accounts.TryGetValue(accountId, out foundAccount))
            {
                throw new DuplicateNameException(String.Format("An account with the same name already exist, name: {0}", accountId));
            }

            if (int.Parse(ConfigurationManager.AppSettings.Get(ConfigurationKeys.AccountsLimit)) <= _accounts.Values.Where(acc => acc.Active).ToList().Count)
            {
                throw new InsufficientMemoryException("The system has reach the limit of allowed accounts");
            }
              
            //TODO thread safe?
            var newAccount = new Account(accountId, accountPassword);
            _accountNotificationService.SendActivationRequest(newAccount, activationUri);            
            _accountStorage.UpsertAccount(newAccount);
            _accounts.Add(accountId, newAccount);            
        }

        public void UpdateAccount(Account accountNewValues)
        {
            if (accountNewValues == null)
            {
                throw new ArgumentNullException("accountNewValues");
            }

            var foundAccount = _accounts.Values.SingleOrDefault(account => account.Id == accountNewValues.Id);

            if (foundAccount == null)
            {
                throw new InvalidDataException(String.Format("An account with the id does not exist, Id: {0}", accountNewValues.Id));
            }

            if (foundAccount.AccountId != accountNewValues.AccountId)
            {
                throw new InvalidDataException(String.Format("The accountId (email) cannot be updated, Id: {0}", accountNewValues.Id));
            }

            //TODO thread safe?
            _accountStorage.UpsertAccount(accountNewValues);
            _accounts[accountNewValues.AccountId] = accountNewValues;
        }

        public void UpsertAccount(Account account)
        {
            if (account == null)
            {
                throw new ArgumentNullException("account");
            }

            _accounts[account.AccountId] = account;
        }

        public void Dispose()
        {
        }
    }
}
