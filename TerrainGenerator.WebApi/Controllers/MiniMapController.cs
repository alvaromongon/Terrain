using System;
using System.Configuration;
using System.Web.Http;
using TerrainGenerator.Services;
using TerrainGenerator.Services.Contracts;

namespace TerrainGenerator.WebApi.Controllers
{
    [Authorize]
    public class MiniMapController : ApiController
    {
        private readonly ITilesManager _tilesService;
        public MiniMapController(ITilesManager tilesService)
        {
            _tilesService = tilesService;
        }

        public IHttpActionResult Get([FromUri] TilePosition tilePosition)
        {            
            var gridSize = int.Parse(ConfigurationManager.AppSettings.Get(ConfigurationKeys.GridSize));
            var tileSize = decimal.Parse(ConfigurationManager.AppSettings.Get(ConfigurationKeys.TileSize));
            var tilesMatrixSideSize = int.Parse(ConfigurationManager.AppSettings.Get(ConfigurationKeys.TilesMatrixSideSize));

            if (tilesMatrixSideSize%2 == 0)
            {
                throw new ConfigurationErrorsException("tilesMatrixSideSize has to be an odd number but seems to be even.");
            }

            tilePosition.NorthLalitude = tilePosition.NorthLalitude + ((int)((tilesMatrixSideSize - 1) / 2) * tileSize);
            tilePosition.WestLongitude = tilePosition.WestLongitude - ((int)((tilesMatrixSideSize - 1) / 2) * tileSize);

            tilePosition.NorthLalitude = CoordinateSystemHelper.CheckLalitude(tilePosition.NorthLalitude);
            tilePosition.WestLongitude = CoordinateSystemHelper.CheckLongitude(tilePosition.WestLongitude);

            var imageResult =
                _tilesService.GetTileImageFor(new TileMetadata
                        {
                            TilePosition = tilePosition,
                            GridSize = gridSize,
                            TileSize = tileSize,
                            TilesMatrixSideSize = tilesMatrixSideSize
                        });

            var imageBase64String = Convert.ToBase64String(imageResult);

            return Ok(imageBase64String);
        }
    }
}
