using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Script.Serialization;
using TerrainGenerator.Contracts;
using TerrainGenerator.Services.Contracts.AccountMetadata;
using TerrainGenerator.Services.Interfaces.Internals;
using TerrainGenerator.Services.Utils;

namespace TerrainGenerator.Services.Contracts
{
    public class Account
    {
        public Guid Id { get; set; }

        public string AccountId { get; set; }

        public string AccountPassword { get; set; }

        public DateTime LastAccess { get; set; }

        public TilePosition TilePosition { get; set; }

        public bool Active { get; set; }

        public Guid ActivationId { get; set; }

        [ScriptIgnore]
        public Queue<TimedAction> NewActions { get; set; }

        [ScriptIgnore]
        public Queue<TimedAction> InProgressActions { get; set; }
        
        [ScriptIgnore]
        public IList<TimedAction> FinishedActions { get; set; }

        [ScriptIgnore]
        private IDictionary<ResourceType,int> ResourceStocks { get; set; }

        public Account()
        {
            LoadInProgressActions();
            BuildResourcesWithDefaultValues();            
        }

        public Account(string accountId, string accountPassword) : this ()
        {
            if (string.IsNullOrEmpty(accountId))
            {
                throw new ArgumentNullException("accountId");
            }

            this.Id = Guid.NewGuid();
            this.AccountId = accountId;
            this.AccountPassword = accountPassword;
            this.SetLastAccess();
            this.Active = false;
            this.ActivationId = Guid.NewGuid();
        }

        public void CopyVariableDataFrom(Account account)
        {
            this.AccountPassword = account.AccountPassword;
            this.LastAccess = account.LastAccess;
            this.TilePosition = account.TilePosition;
            this.Active = account.Active;            
        }

        public void SetLastAccess()
        {
            this.LastAccess = DateTime.UtcNow;
        }

        public virtual bool IsDemoAccount()
        {
            return false;
        }        

        public int GetResourceStock(ResourceType resourceType)
        {
            return this.ResourceStocks[resourceType];
        }

        public void IncrementResourceStock(ResourceType resourceType, int stock)
        {
            if (!this.ResourceStocks.ContainsKey(resourceType))
            {
                return;
            }

            this.ResourceStocks[resourceType] += stock;

            if (resourceType == ResourceType.population)
            {
                this.UpdateManpowerStock();
            }
        }

        public void UpdateCalculatedResources()
        {
            this.UpdateManpowerStock();

            this.UpdateFoodStock();
        }

        public void EnqueueActions(IList<Action> actionList)
        {
            if (actionList.Count <= 0) return;

            foreach (var action in actionList)
            {
                this.NewActions.Enqueue(new TimedAction(DateTime.UtcNow, action));
            }            

            var accountSynchronizationService = ServicesFactory.Build(typeof(IAccountSynchronizationService)) as IAccountSynchronizationService;
            if (accountSynchronizationService == null) throw new ArgumentNullException("accountSynchronizationService");

            accountSynchronizationService.SynchronizeNewActions(this);
        }

        public IAccountSynchronization RetrieveCurrentState()
        {
            var logger = ServicesFactory.Build(typeof(ILogger)) as ILogger;
            if (logger == null) throw new ArgumentNullException("logger");            

            IList<ResourceStock> resourceStocks;
            IList<TimedAction> finishedActions;

            using (LockFactory.AdquireLock(this.AccountId))
            {
                logger.Log("RetrieveCurrentState, " + this.AccountId + " account locked");

                resourceStocks = this.ResourceStocks.Select(stock => new ResourceStock()
                {
                    ResourceType = stock.Key,
                    Stock = stock.Value
                }).ToList();

                finishedActions = FinishedActions;
                FinishedActions = new List<TimedAction>();               
            }

            logger.Log("RetrieveCurrentState, " + this.AccountId + " account UNlocked");

            return new AccountSynchronization()
            {
                Actions = finishedActions,
                Resources = resourceStocks,
            };
        }

        public bool ContabilizeAction(int manPowerNeeded)
        {
            var result = this.ResourceStocks[ResourceType.unemployedManpower] >= manPowerNeeded;

            if (result)
            {
                this.ResourceStocks[ResourceType.unemployedManpower] -= manPowerNeeded;
            }

            return result;
        }

        private void BuildResourcesWithDefaultValues()
        {
            // TODO: The default values should be defined in configuration, when storing information this will be changing over time
            this.ResourceStocks = new Dictionary<ResourceType, int> { { ResourceType.unemployedManpower, 0 }, { ResourceType.manpower, 0 }, { ResourceType.population, 5 }, { ResourceType.food, 0 }, { ResourceType.foodLimit, 0 }, { ResourceType.wood, 0 } };
            this.ResourceStocks[ResourceType.foodLimit] = this.CalculateFoodLimit();

            this.UpdateManpowerStock();
            this.UpdateFoodStock();
        }

        private void LoadInProgressActions()
        {
            // TODO: This potentially has to read the in progress actions, modify the terrain as appropiate... think about when storing account information
            // TODO: Update unemployed manpower
            NewActions = new Queue<TimedAction>();
            InProgressActions = new Queue<TimedAction>();
            FinishedActions = new List<TimedAction>();
        }

        private void UpdateManpowerStock()
        {
            var futureManpowerStock = (int) Math.Floor((decimal) this.ResourceStocks[ResourceType.population]/2);

            this.ResourceStocks[ResourceType.manpower] = futureManpowerStock;
            this.ResourceStocks[ResourceType.unemployedManpower] = futureManpowerStock;
        }

        private void UpdateFoodStock()
        {
            if (this.ResourceStocks[ResourceType.food] >= this.ResourceStocks[ResourceType.foodLimit])
            {
                this.ResourceStocks[ResourceType.food] = 0;                
                this.ResourceStocks[ResourceType.population] = this.ResourceStocks[ResourceType.population] + 1;
                this.ResourceStocks[ResourceType.foodLimit] = this.CalculateFoodLimit();
            }
        }

        private int CalculateFoodLimit()
        {
            return this.ResourceStocks[ResourceType.population] * 2;
            ;
        }
    }
}
