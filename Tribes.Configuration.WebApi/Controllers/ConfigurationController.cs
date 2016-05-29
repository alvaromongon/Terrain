using System;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;
using Tribes.Configuration.Manager;

namespace Tribes.Configuration.WebApi.Controllers
{
    public class ConfigurationController : ApiController
    {
        private readonly IConfigurationManager _configurationManager;

        public ConfigurationController(IConfigurationManager configurationManager)
        {
            if (configurationManager == null)
            {
                throw new ArgumentNullException("configurationManager");
            }

            this._configurationManager = configurationManager;
        }

        public async Task<HttpResponseMessage> PostAsync(string path, [FromBody]string data)
        {
            if (string.IsNullOrEmpty(path) || string.IsNullOrEmpty(data))
            {
                return this.Request.CreateResponse(HttpStatusCode.BadRequest);
            }

            await this._configurationManager.CreatePathValuePairAsync(path, data);

            return this.Request.CreateResponse(HttpStatusCode.Created);
        }

        public async Task<HttpResponseMessage> GetAsync(string path)
        {
            if (string.IsNullOrEmpty(path))
            {
                return this.Request.CreateResponse(HttpStatusCode.NotFound);
            }

            // TODO: data could not exist or be null, but still listening is valid
            var data = await this._configurationManager.ListenToUpdatesOnPathAsync(path);

            return this.Request.CreateResponse(HttpStatusCode.OK, data);
        }

    }
}
