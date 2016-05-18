namespace Tribes.Configuration.Manager
{
    using System.Threading.Tasks;

    public interface IConfigurationManager
    {
        Task CreatePathValuePairAsync(string path, string data);

        Task<string> ListenToUpdatesOnPathAsync(string path);
    }
}
