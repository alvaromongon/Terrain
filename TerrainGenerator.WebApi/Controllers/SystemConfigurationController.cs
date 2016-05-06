using System.Configuration;
using System.IO;
using System.Linq;
using System.Web.Http;
using TerrainGenerator.Services;
using TerrainGenerator.Services.Interfaces;
using TerrainGenerator.WebApi.Models;

namespace TerrainGenerator.WebApi.Controllers
{
    [Authorize]
    public class SystemConfigurationController : BaseController
    {
        private readonly IPositionService _positionService;
        private readonly IActionRulesStorage _actionRulesStorage;
        public SystemConfigurationController(IAccountsManager accountsManager, IPositionService positionService, IActionRulesStorage actionRulesStorage)
            : base(accountsManager)
        {
            _positionService = positionService;
            _actionRulesStorage = actionRulesStorage;
        }

        public IHttpActionResult Get()
        {
            var account = this.AccountsManager.GetAccount(User.Identity.Name);

            if (account == null)
            {
                throw new InvalidDataException("Unknown account");
            }

            var tileSize = decimal.Parse(ConfigurationManager.AppSettings.Get(ConfigurationKeys.TileSize));
            var gridSize = int.Parse(ConfigurationManager.AppSettings.Get(ConfigurationKeys.GridSize));
            var firstUse = false;

            if (account.TilePosition == null)
            {
                firstUse = true;                

                if (!account.IsDemoAccount())
                {
                    account.TilePosition = _positionService.GetInitialPosition(tileSize, gridSize);
                    this.AccountsManager.UpdateAccount(account);
                }
            }

            var actionRules = _actionRulesStorage.LoadActionRules();

            var rules =
                actionRules.Select(
                    actionRule =>
                        new Rule()
                        {
                            InitialActionType = actionRule.InitialActionType,
                            InitialMapElementType = actionRule.InitialMapElementType,
                            FinishMapElementType = actionRule.FinishMapElementType,
                            ManPowerNeeded = actionRule.ManPowerNeeded
                        });

            var tilePosition = account.TilePosition ?? _positionService.GetInitialPosition(tileSize, gridSize);

            var model = new SystemConfiguration()
            {
                FirstUse = firstUse,
                Rules = rules.ToArray(),
                TilePosition = tilePosition,
                TileSize = tileSize,
                GridSize = gridSize,
                TilesMatrixSideSize = int.Parse(ConfigurationManager.AppSettings.Get(ConfigurationKeys.TilesMatrixSideSize)),
                MaxMinHeight = int.Parse(ConfigurationManager.AppSettings.Get(ConfigurationKeys.MaxMinHeight)),
                MaxAllowedCameraAltitudeOverTerrain = int.Parse(ConfigurationManager.AppSettings.Get(ConfigurationKeys.MaxAllowedCameraAltitudeOverTerrain)),
                MinAllowedCameraAltitudeOverTerrain = int.Parse(ConfigurationManager.AppSettings.Get(ConfigurationKeys.MinAllowedCameraAltitudeOverTerrain)),
                ShelfLevel = decimal.Parse(ConfigurationManager.AppSettings.Get(ConfigurationKeys.ShelfLevel)),
                MaxTerrainAltitudeInMeters = int.Parse(ConfigurationManager.AppSettings.Get(ConfigurationKeys.MaxTerrainAltitudeInMeters)),
            };

            return Ok(model);
        }        
    }
}
