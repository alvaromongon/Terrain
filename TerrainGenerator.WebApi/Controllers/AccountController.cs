using System;
using System.Configuration;
using System.Data;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using System.Web.Http;
using TerrainGenerator.Services.Contracts;
using TerrainGenerator.Services.Interfaces;
using TerrainGenerator.WebApi.Controllers;
using TerrainGenerator.WebApi.Models;

namespace TerrainGenerator.WebApi.Pipeline.Controllers
{
    [Authorize]
    [RoutePrefix("api/Account")]
    public class AccountController : BaseController
    {
        public AccountController(IAccountsManager accountsManager) : base(accountsManager)
        {
        }

        //[AllowAnonymous]
        //[AcceptVerbs("OPTIONS")]
        //[Route("~/Token")]
        //public HttpResponseMessage TokenCors()
        //{
        //    var response = new HttpResponseMessage { StatusCode = HttpStatusCode.OK };
        //    response.Headers.Add("Access-Control-Allow-Origin", new[] { "*" });
        //    return response;
        //}

        [AllowAnonymous]
        [HttpPost]
        [Route("Register")]
        public IHttpActionResult Register([FromBody] RegisterModel model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var account = AccountsManager.GetAccount(model.Email);

            if (account != null)
            {
                ModelState.AddModelError("", new DuplicateNameException("The user name is already in use."));
                return BadRequest(ModelState);
            }

            try
            {
                // TODO: This can be done better
                AccountsManager.AddAccount(model.Email, model.Password, new Uri(Request.RequestUri.ToString().Replace("Register", "Activate"))); 
            }            
            catch (InsufficientMemoryException ime)
            {
                Trace.TraceWarning(ime.Message);
                ModelState.AddModelError("", new InsufficientMemoryException("The number of users as reach the comfigured limit. Please contact with alvaromontero@gmail.com to ask for access.", ime));
                return BadRequest(ModelState);
            }
            catch (Exception ex)
            {
                Trace.TraceWarning(ex.Message);
                ModelState.AddModelError("", new Exception("Unknown error registering the account.", ex));
                return BadRequest(ModelState);
            }

            return Ok();
        }

        [AllowAnonymous]
        [HttpGet]
        [Route("Activate/{id}")]
        public HttpResponseMessage Activate([FromUri] string id)
        {
            HttpResponseMessage response;

            if (string.IsNullOrEmpty(id))
            {
                response = Request.CreateResponse(HttpStatusCode.BadRequest);
                response.Content = new StringContent("<html><body>Invalid request</body></html>");
                response.Content.Headers.ContentType = new MediaTypeHeaderValue("text/html");
                return response;
            }

            var account = AccountsManager.ActivateAccount(id);

            if (account == null)
            {
                response = Request.CreateResponse(HttpStatusCode.BadRequest);
                response.Content = new StringContent("<html><body>Invalid activation key</body></html>");
                response.Content.Headers.ContentType = new MediaTypeHeaderValue("text/html");
                return response;
            }

            response = Request.CreateResponse(HttpStatusCode.OK);
            response.Content = new StringContent("<html><body>Your account has been activated</body></html>");
            response.Content.Headers.ContentType = new MediaTypeHeaderValue("text/html");
            return response;
        }

        [HttpPut]
        [Route("Location")]
        public async Task<IHttpActionResult> Location([FromBody] TilePosition tilePosition)
        {
            if (tilePosition == null)
            {
                throw new InvalidDataException("null location");
            }

            var account = this.AccountsManager.GetAccount(User.Identity.Name);

            if (account == null)
            {
                throw new InvalidDataException("Unknown account");
            }

            if (!account.IsDemoAccount())
            {
                // TODO: This has to be async
                account.TilePosition = tilePosition;
                this.AccountsManager.UpdateAccount(account);
            }            

            return Ok();
        }
    }
}
