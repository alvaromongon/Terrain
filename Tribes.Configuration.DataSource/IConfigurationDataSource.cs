namespace Tribes.Configuration.DataSource
{
    using System.Threading.Tasks;

    public interface IConfigurationDataSource
    {
        /// <summary>
        /// Create in the specified path a resource with the specified data.
        /// If the path already exisit, the data will be overriden.
        /// </summary>
        /// <param name="path">path to store the data</param>
        /// <param name="data">data to be store</param>
        /// <returns></returns>
        Task CreateAsync(string path, string data);

        /// <summary>
        /// Listen for any change in the specified path.
        /// Once something has been changed, the new data stored in the path is returned
        /// </summary>
        /// <param name="path">path to listen for changes in</param>
        /// <returns>New data stored in the listenning path</returns>
        Task<string> ListenAsync(string path);

        /// <summary>
        /// Delete the specified path and the data contained in the path for any change in the specified path.
        /// </summary>
        /// <param name="path">path to listen for changes in</param>
        Task DeleteAsync(string path);
    }
}
