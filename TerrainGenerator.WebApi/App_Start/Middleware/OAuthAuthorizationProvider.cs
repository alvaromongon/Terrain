using System;
using System.Configuration;
using Microsoft.AspNet.Identity.Owin;
using Microsoft.Owin.Security.OAuth;
using System.Collections.Generic;
using System.Net.Http;
using System.Security.Claims;
using System.Threading.Tasks;
using TerrainGenerator.Services.Contracts;
using TerrainGenerator.Services.Interfaces;

namespace TerrainGenerator.WebApi.Middleware
{
    public class OAuthAuthorizationProvider : OAuthAuthorizationServerProvider
    {
        public override Task MatchEndpoint(OAuthMatchEndpointContext context)
        {
            if (context.OwinContext.Request.Method == HttpMethod.Options.Method)
            {
                context.MatchesNothing();
            }

            return base.MatchEndpoint(context);
        }

        public override async Task ValidateClientAuthentication(OAuthValidateClientAuthenticationContext context)
        {
            try
            {
                string clientId;
                string clientSecret;
                var hasCredentials = context.TryGetBasicCredentials(out clientId, out clientSecret);

                if (hasCredentials)
                {
                    var accountsManager = context.OwinContext.GetUserManager<IAccountsManager>();

                    var demoAccountName = ConfigurationManager.AppSettings.Get(ConfigurationKeys.DemoAccount);

                    if (clientId.Equals(ConfigurationManager.AppSettings.Get(ConfigurationKeys.DemoAccount), StringComparison.InvariantCultureIgnoreCase))
                    {
                        var demoAccount = accountsManager.GetAccount(demoAccountName);

                        if (demoAccount == null)
                        {
                            demoAccount = new DemoAccount(demoAccountName);
                            accountsManager.UpsertAccount(demoAccount);
                        }
                        
                        context.OwinContext.Set<Account>("oauth:client", demoAccount);                                               
                        context.Validated();
                    }
                    else
                    {                        
                        var account = accountsManager.GetAccount(clientId);

                        if (account != null)
                        {
                            if (!account.Active)
                            {
                                context.SetError(
                                    "client_not_active",
                                    "Client account was found but account is not active");
                                context.Rejected();
                            }
                            else if (clientSecret != account.AccountPassword)
                            {
                                context.SetError(
                                    "invalid_client_password",
                                    "Client account was found but password is invalid");
                                context.Rejected();
                            }
                            else
                            {
                                account.SetLastAccess();
                                accountsManager.UpdateAccount(account);

                                context.OwinContext.Set<Account>("oauth:client", account);
                                context.Validated();
                            }
                        }
                        else
                        {
                            context.SetError(
                                "invalid_client",
                                "Client account was not found.");
                            context.Rejected();
                        }
                    }
                }
                else
                {
                    if (context.OwinContext.Request.Method == HttpMethod.Options.Method)
                    {
                        context.Validated();
                    }
                }
            }
            catch
            {
                // The client credentials could not be retrieved.
                context.SetError(
                    "invalid_client",
                    "Client credentials could not be retrieved through the Authorization header.");
                context.Rejected();
            }
        }

        public override async Task GrantResourceOwnerCredentials(OAuthGrantResourceOwnerCredentialsContext context)
        {
            context.OwinContext.Response.Headers.Add("Access-Control-Allow-Origin", new[] { "*" });

            try
            {
                var account = context.OwinContext.Get<Account>("oauth:client");

                if (account != null)
                {
                    // User is found. Signal this by calling context.Validated
                    var claims = new List<Claim>() { new Claim(ClaimTypes.Name, account.AccountId) };
                    var identity = new ClaimsIdentity(claims, OAuthDefaults.AuthenticationType);
                    context.Validated(identity);
                }
                else
                {
                    // The ClaimsIdentity could not be created by the UserManager.
                    context.SetError("server_error");
                    context.Rejected();
                }
            }
            catch
            {
                // The ClaimsIdentity could not be created by the UserManager.
                context.SetError("server_error");
                context.Rejected();
            }
        }
    }
}