namespace Tribes.Configuration.DataSource
{
    using System.Threading.Tasks;

    public interface IConfigurationDataSource
    {
        Task CreateAsync(string path, string data);

        Task<string> ListenAsync(string path);
    }
}
