[assembly: WebActivator.PostApplicationStartMethod(typeof(Tribes.Configuration.WebApi.App_Start.GlobalExceptionHandlerConfig), "Initialize")]

namespace Tribes.Configuration.WebApi.App_Start
{
    using System.Web.Http;
    using System.Web.Http.ExceptionHandling;
    using Tribes.Configuration.WebApi.Pipeline;

    public class GlobalExceptionHandlerConfig
    {
        public static void Initialize()
        {
            GlobalConfiguration.Configuration.Services.Replace(typeof(IExceptionHandler), new UnExpectedExceptionHandler());
        }
    }
}