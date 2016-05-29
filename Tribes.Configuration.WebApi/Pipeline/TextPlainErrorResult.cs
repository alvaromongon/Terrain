namespace Tribes.Configuration.WebApi.Pipeline
{
    using System.Net;
    using System.Net.Http;
    using System.Threading;
    using System.Threading.Tasks;
    using System.Web.Http;

    internal class TextPlainErrorResult : IHttpActionResult
    {
        public HttpRequestMessage Request { get; set; }

        public string Content { get; set; }

        public Task<HttpResponseMessage> ExecuteAsync(CancellationToken cancellationToken)
        {
            HttpResponseMessage response =
                             new HttpResponseMessage(HttpStatusCode.InternalServerError);
            response.Content = new StringContent(Content);
            response.RequestMessage = Request;
            return Task.FromResult(response);
        }
    }
}