using System;
using System.Net;
using System.Net.Http;
using System.Security.Authentication;
using System.Web.Http;
using TerrainGenerator.Services.Interfaces;

namespace TerrainGenerator.WebApi.Controllers
{
    public class BaseController : ApiController
    {
        protected readonly IAccountsManager AccountsManager;

        public BaseController(IAccountsManager accountsManager)
        {
            AccountsManager = accountsManager;
        }

        protected IHttpActionResult GenerateHttpActionResultFromException(Exception ex)
        {
            try
            {
                throw ex;
            }
            catch (AuthenticationException)
            {
                throw this.CreateHttpResponseException(HttpStatusCode.Unauthorized, "invalid token");
            }
            catch (Exception)
            {
                throw this.CreateHttpResponseException(HttpStatusCode.BadRequest);
            }
        }

        private HttpResponseException CreateHttpResponseException(HttpStatusCode statusCode, string reasonPhrase = null)
        {
            if (string.IsNullOrWhiteSpace(reasonPhrase))
            {
                return new HttpResponseException(statusCode);
            }

            var responseMessage = new HttpResponseMessage(statusCode) {ReasonPhrase = reasonPhrase};
            return new HttpResponseException(responseMessage);
        }
    }
}
