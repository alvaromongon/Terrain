namespace Tribes.Configuration.DataSource.Zookeeper
{
    using org.apache.zookeeper;
    using org.apache.zookeeper.data;
    using System;
    using System.Collections.Generic;
    using System.Text;
    using System.Threading.Tasks;
    public class ZookeeperConfigurationDataSource : IConfigurationDataSource
    {        
        private readonly IZookeeperClient zooKeeperClient;

        /// <summary>
        /// Created in order to be able to test ListenAsync method in a pseudo unit test enviroment.
        /// </summary>
        public static WatcherEventHandler LastWatcher { get; set; }

        public ZookeeperConfigurationDataSource(IZookeeperClient zookeeperClient)
        {
            this.zooKeeperClient = zookeeperClient;
        }

        /// <summary>
        /// Create in the specified path a resource with the specified data.
        /// If the path already exisit, the data will be overriden.
        /// </summary>
        /// <param name="path">path to store the data</param>
        /// <param name="data">data to be store</param>
        /// <returns></returns>
        public async Task CreateAsync(string path, string data)
        {
            if (this.zooKeeperClient.existsAsync(path).Result == null)
            {
                await this.zooKeeperClient.createAsync(path, Encoding.ASCII.GetBytes(data), ZooDefs.Ids.OPEN_ACL_UNSAFE, CreateMode.PERSISTENT);
            }
            else
            {
                await this.zooKeeperClient.setDataAsync(path, Encoding.ASCII.GetBytes(data));
            }
        }

        /// <summary>
        /// Listen for any change in the specified path.
        /// Once something has been changed, the new data stored in the path is returned
        /// </summary>
        /// <param name="path">path to listen for changes in</param>
        /// <returns>New data stored in the listenning path</returns>
        public async Task<string> ListenAsync(string path)
        {
            using (var watcher = new WatcherEventHandler())
            {
                LastWatcher = watcher; // For testing
                await this.zooKeeperClient.existsAsync(path, watcher);
                watcher.waitToComplete();
            }

            var dataResult = await this.zooKeeperClient.getDataAsync(path);

            return dataResult == null ? null : Encoding.ASCII.GetString(dataResult.Data);
        }

        /// <summary>
        /// Delete the specified path and the data contained in the path for any change in the specified path.
        /// </summary>
        /// <param name="path">path to listen for changes in</param>
        public Task DeleteAsync(string path)
        {
            var result = this.zooKeeperClient.existsAsync(path).Result;
            if (result == null)
            {
                return this.zooKeeperClient.deleteAsync(path);
            }
            return Task.CompletedTask;
        }
    }
}
