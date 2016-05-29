namespace Tribes.Configuration.WebApi.Pipeline
{
    using System.Web.Http.ExceptionHandling;

    public class UnExpectedExceptionHandler : ExceptionHandler
    {
        private const string GentlyErrorMessage = "Ops! something when wrong while processing your request.";

        public override void Handle(ExceptionHandlerContext context)
        {
            context.Result = new TextPlainErrorResult
            {
                Request = context.ExceptionContext.Request,
                Content = GentlyErrorMessage
            };
        }

        public override bool ShouldHandle(ExceptionHandlerContext context)
        {
           return base.ShouldHandle(context);
           //return context.ExceptionContext.CatchBlock.IsTopLevel;
        }
    }
}