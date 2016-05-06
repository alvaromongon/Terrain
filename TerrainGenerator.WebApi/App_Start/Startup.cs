using Microsoft.Owin;
using Microsoft.Owin.Security.OAuth;
using Owin;
using System;
using System.Web.Http;
using TerrainGenerator.Contracts;
using TerrainGenerator.Services.Interfaces;
using TerrainGenerator.Services.Workers;
using TerrainGenerator.WebApi.Middleware;

namespace TerrainGenerator.WebApi
{
    public class Startup
    {
        public static OAuthAuthorizationServerOptions OAuthOptions { get; private set; }

        public void Configuration(IAppBuilder app)
        {            
            //Oauth configuration
            app.CreatePerOwinContext(() => ServicesFactory.Build(typeof(IAccountsManager)) as IAccountsManager);

            OAuthOptions = new OAuthAuthorizationServerOptions
            {
                TokenEndpointPath = new PathString("/Token"),
                Provider = new OAuthAuthorizationProvider(),
                AccessTokenExpireTimeSpan = TimeSpan.FromDays(1),
                AllowInsecureHttp = true,
//#if DEBUG
//                AllowInsecureHttp = true,
//#endif
            };

            // Token Generation
            app.UseOAuthAuthorizationServer(OAuthOptions);
            app.UseOAuthBearerAuthentication(new OAuthBearerAuthenticationOptions());

            app.UseCors(Microsoft.Owin.Cors.CorsOptions.AllowAll);

            //Web Api configuration
            var config = new HttpConfiguration();
            WebApiConfig.Register(config);
            app.UseWebApi(config);         
   
            //Account Synchronizer
            AccountsSynchronizationWorker.Initizalize(new TimeSpan(0,0,0,30), new TimeSpan(0,0,0,30));
        }
    }
}