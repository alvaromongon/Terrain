namespace Tribes.Configuration.Manager
{
    using DataSource;
    using System;
    using System.Threading.Tasks;

    public class ConfigurationManager : IConfigurationManager
    {
        private readonly IConfigurationDataSource _configurationDataSource;
        public ConfigurationManager(IConfigurationDataSource configurationDataSource)
        {
            this._configurationDataSource = configurationDataSource;
        }

        public Task CreatePathValuePairAsync(string path, string data)
        {
            return this._configurationDataSource.CreateAsync(path, data);
        }

        /// <summary>
        /// This method will get blocked until new updates are being done
        /// </summary>
        /// <param name="path">path of the configuration to listen to</param>
        /// <returns>Updated value once something has changed</returns>
        public Task<string> ListenToUpdatesOnPathAsync(string path)
        {
            return this._configurationDataSource.ListenAsync(path);
        }
    }
}
