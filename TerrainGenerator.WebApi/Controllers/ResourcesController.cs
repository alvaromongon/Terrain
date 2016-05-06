using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web.Http;
using TerrainGenerator.Services.Interfaces;

namespace TerrainGenerator.WebApi.Controllers
{
    /// <summary>
    /// Calculate the amount of resources that the user receive
    /// </summary>
    [Authorize]
    public class ResourcesController : BaseController
    {        
        public ResourcesController(IAccountsManager accountsManager): base(accountsManager)
        {
        }

        public IHttpActionResult Get()
        {
            try
            {
                var account = this.AccountsManager.GetAccount(User.Identity.Name);

                if (account == null)
                {
                    throw new InvalidDataException("Unknown account");
                }

                return Ok(account.RetrieveCurrentState());
            }
            catch (Exception ex)
            {
                return this.GenerateHttpActionResultFromException(ex);
            }
        }

        public IHttpActionResult Post([FromBody]IEnumerable<Services.Contracts.Action> actions)
        {
            try
            {
                var account = this.AccountsManager.GetAccount(User.Identity.Name);

                if (account == null)
                {
                    throw new InvalidDataException("Unknown account");
                }

                if (actions == null)
                {
                    return Ok();
                }

                var actionList = actions as IList<Services.Contracts.Action> ?? actions.ToList();

                account.EnqueueActions(actionList);

                var result = account.RetrieveCurrentState();
                
                return Ok(result);
            }
            catch (Exception ex)
            {
                return this.GenerateHttpActionResultFromException(ex);
            }
        }
    }
}
