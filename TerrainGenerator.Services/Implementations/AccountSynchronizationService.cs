using System;
using System.Collections.Generic;
using System.Configuration;
using TerrainGenerator.Services.Contracts;
using TerrainGenerator.Services.Interfaces;
using TerrainGenerator.Services.Interfaces.Internals;
using TerrainGenerator.Services.Utils;

namespace TerrainGenerator.Services.Implementations
{
    internal class AccountSynchronizationService : IAccountSynchronizationService
    {
        private readonly ILogger _logger;
        private readonly IAccountsManager _accountsManager;
        private readonly IActionRulesService _actonRulesService;
        private readonly ITilesManager _tilesManager;

        private readonly TileMetadata tileMetadata;

        public AccountSynchronizationService(ILogger logger, IAccountsManager accountsManager, IActionRulesService actonRulesService, ITilesManager tilesManager)
        {
            this._logger = logger;
            this._accountsManager = accountsManager;
            this._actonRulesService = actonRulesService;
            this._tilesManager = tilesManager;

            this.tileMetadata = new TileMetadata
            {
                //TilePosition = POSITION WILL BE DEFINED BY EACH ACTION
                GridSize = int.Parse(ConfigurationManager.AppSettings.Get(ConfigurationKeys.GridSize)),
                TileSize = decimal.Parse(ConfigurationManager.AppSettings.Get(ConfigurationKeys.TileSize)),
                TilesMatrixSideSize = 1
            };
        }

        public void SynchronizeAll()
        {
            var accounts = this._accountsManager.GetActiveAccounts();

            foreach (var account in accounts)
            {
                this.Synchronize(account);
            }
        }

        public void Synchronize(Account account)
        {
            using (LockFactory.AdquireLock(account.AccountId))
            {
                this._logger.Log("Synchronize, " + account.AccountId + " account locked", logLevel.Verbose);

                account.UpdateCalculatedResources();

                ProcessInProgressActions(account);

                ProcessNewActions(account);

                ProcessUnemployment(account);

                if (!account.IsDemoAccount())
                {
                    this._accountsManager.UpdateAccount(account);
                }
            }

            this._logger.Log("Synchronize, " + account.AccountId + " account UNlocked", logLevel.Verbose);
        }

        public void SynchronizeNewActions(Account account)
        {
            using (LockFactory.AdquireLock(account.AccountId))
            {
                this._logger.Log("SynchronizeNewActions, " + account.AccountId + " account locked", logLevel.Verbose);

                ProcessNewActions(account);

                if (!account.IsDemoAccount())
                {
                    this._accountsManager.UpdateAccount(account);
                }
            }

            this._logger.Log("SynchronizeNewActions, " + account.AccountId + " account UNlocked", logLevel.Verbose);
        }

        private void ProcessInProgressActions(Account account)
        {
            var unfinishedActions = new List<TimedAction>();

            while (account.InProgressActions.Count > 0)
            {
                //if (account.InProgressActions.Count > 0)
                //{                    
                //    logger.Log("ProcessInProgressActions, " + account.AccountId + " in progress action queue is empty when trying to peek.", logLevel.Verbose, "AccountsSynchronizationWorker");

                //    break;
                //}

                var action = account.InProgressActions.Peek();

                var rule = this._actonRulesService.GetApplicableRule(action);

                if (rule == null)
                {
                    account.InProgressActions.Dequeue();

                    this._logger.Log("ProcessInProgressActions, " + account.AccountId + " could not find rule to apply on in progress action: " + action.ActionType, logLevel.Error, "AccountsSynchronizationWorker");

                    continue;
                }

                if (account.InProgressActions.Count == 0)
                {
                    this._logger.Log("ProcessInProgressActions, " + account.AccountId + " in progress action queue is empty when trying to dequeue.", logLevel.Error, "AccountsSynchronizationWorker");

                    break;
                } // No in progress actions?
                action = account.InProgressActions.Dequeue();

                if (DateTime.UtcNow < action.InitialTime.Add(rule.Length))
                {
                    // not yet finished
                    account.ContabilizeAction(rule.ManPowerNeeded);
                    unfinishedActions.Add(action);
                    
                    continue;
                }

                // Finished                    

                // set position
                this.tileMetadata.TilePosition = new TilePosition()
                {
                    NorthLalitude = action.North,
                    WestLongitude = action.West
                };

                // get current cell
                var currentCell = this._tilesManager.GetCellDataFor(tileMetadata, action.Index);

                // does it match with initial map element type?
                if ((MapElementType)currentCell.c != action.InitialMapElementType)
                {
                    this._logger.Log("ProcessInProgressActions, " + account.AccountId + " current cell value does not match with action value: " + action.InitialMapElementType, logLevel.Warning, "AccountsSynchronizationWorker");

                    continue;
                }

                // set map element type
                currentCell.c = (int)action.FinishMapElementType;
                this._tilesManager.SetCellDataFor(tileMetadata, action.Index, currentCell);

                //Set resource stock
                account.IncrementResourceStock(rule.ProducedResouce, rule.ProducedQuantity);

                // set action type and add the action to the finished actions
                action.ActionType = rule.FinishActionType;
                account.FinishedActions.Add(action);
            }

            unfinishedActions.ForEach(action => account.InProgressActions.Enqueue(action));
        }

        private void ProcessNewActions(Account account)
        {
            while (account.NewActions.Count > 0)
            {
                //if (account.NewActions.Count == 0)
                //{
                //    logger.Log("ProcessNewActions, " + account.AccountId + " new action queue is empty when trying to peek.", logLevel.Verbose, "AccountsSynchronizationWorker");

                //    break;
                //}

                var action = account.NewActions.Peek();

                var rule = this._actonRulesService.GetApplicableRule(action);

                if (rule == null)
                {
                    account.NewActions.Dequeue();

                    this._logger.Log("ProcessNewActions, " + account.AccountId + " could not find rule to apply on new action: " + action.ActionType, logLevel.Warning, "AccountsSynchronizationWorker");

                    continue;
                }

                if (!account.ContabilizeAction(rule.ManPowerNeeded))
                {
                    this._logger.Log("ProcessNewActions, " + account.AccountId + " There is no enough manpower to apply action: " + action.ActionType, logLevel.Infomation, "AccountsSynchronizationWorker");

                    break; // No more manpower available
                }

                if (account.NewActions.Count == 0)
                {
                    this._logger.Log("ProcessNewActions, " + account.AccountId + " new action queue is empty when trying to dequeue", logLevel.Error, "AccountsSynchronizationWorker");

                    break; // No new actions?
                }

                action = account.NewActions.Dequeue();

                account.InProgressActions.Enqueue(action);
            }
        }

        private void ProcessUnemployment(Account account)
        {
            var manpowerAvailable = account.GetResourceStock(ResourceType.manpower);

            if (manpowerAvailable <= 0)
            {
                this._logger.Log("ProcessUnemployment, " + account.AccountId + " there is no unemployment ", logLevel.Verbose, "AccountsSynchronizationWorker");

                return;
            }

            var rule = this._actonRulesService.GetApplicableRule(new Contracts.Action
            {
                ActionType = ActionType.unemployed,
                InitialMapElementType = MapElementType.empty,
                FinishMapElementType = MapElementType.empty
            });

            while (manpowerAvailable >= rule.ManPowerNeeded)
            {
                account.IncrementResourceStock(rule.ProducedResouce, rule.ProducedQuantity);
                manpowerAvailable -= rule.ManPowerNeeded;
            }
        }
    }
}
