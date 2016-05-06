using System;
using System.Configuration;
using System.Web.Http;
using TerrainGenerator.Services;
using TerrainGenerator.Services.Contracts;

namespace TerrainGenerator.WebApi.Controllers
{
    [Authorize]
    public class TilesController : ApiController
    {
        private readonly ITilesManager _tilesService;
        public TilesController(ITilesManager tilesService)
        {
            _tilesService = tilesService;
        }

        public IHttpActionResult Get([FromUri] TilePosition tilePosition)
        {
            try
            {
                var tileData = _tilesService.GetTileDataFor(new TileMetadata
                {
                    TilePosition = tilePosition,
                    GridSize = int.Parse(ConfigurationManager.AppSettings.Get(ConfigurationKeys.GridSize)),
                    TileSize = decimal.Parse(ConfigurationManager.AppSettings.Get(ConfigurationKeys.TileSize)),
                    TilesMatrixSideSize = 1 //only one tile
                });

                var result = new
                {
                    tilePosition = tilePosition,
                    data = tileData
                };

                return Ok(result);
            }
            catch (Exception ex)
            {
                return InternalServerError(ex);
            }                       
        }
    }
}
