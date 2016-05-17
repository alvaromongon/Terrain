namespace Tribes.Configuration.DataSource
{
    using System.Threading.Tasks;

    public interface IConfigurationDataSource
    {
        Task CreateStaticAsync(string path, string data);

        Task CreateDynamicAsync(string path, string data);

        Task<string> ListenAsync(string path);
    }
}
