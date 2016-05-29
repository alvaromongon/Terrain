[assembly: WebActivator.PostApplicationStartMethod(typeof(Tribes.Configuration.WebApi.App_Start.LoggerConfig), "Initialize")]

namespace Tribes.Configuration.WebApi.App_Start
{
    using System.Web.Http;
    using System.Web.Http.ExceptionHandling;
    using Tribes.Configuration.WebApi.Pipeline;

    public class LoggerConfig
    {
        public static void Initialize()
        {
            // TODO: Use a different logger, for now using the default trace listener; debugger output window 
            // https://msdn.microsoft.com/en-us/library/system.diagnostics.defaulttracelistener(v=vs.110).aspx

            GlobalConfiguration.Configuration.Services.Add(typeof(IExceptionLogger), new TraceExceptionLogger());
        }
    }
}