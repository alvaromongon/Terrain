namespace Tribes.Configuration.WebApi.Pipeline
{
    using System;
    using System.Net;
    using System.Net.Http;
    using System.Web.Http.Filters;

    /// <summary>
    /// This class can be use as a template to create more granular exception handlers.
    /// </summary>
    [AttributeUsage(AttributeTargets.Class, Inherited = false, AllowMultiple = false)]
    public class SpecificExceptionFilterAttribute : ExceptionFilterAttribute
    {
        private const string GentlyErrorMessage = "I am a gently error message for an specific exception.";

        public override void OnException(HttpActionExecutedContext context)
        {
            // Check the exception type and act if needed
            //context.Response = new HttpResponseMessage(HttpStatusCode.InternalServerError)
            //{
            //    Content = new StringContent(GentlyErrorMessage)
            //};
        }
    }
}