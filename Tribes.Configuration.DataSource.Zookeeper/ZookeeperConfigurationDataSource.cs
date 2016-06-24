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

        public async Task CreateAsync(string path, string data)
        {
            var stat = await this.zooKeeperClient.existsAsync(path);
            if (stat == null)
            {
                await this.zooKeeperClient.createAsync(path, Encoding.ASCII.GetBytes(data), new List<ACL>(), CreateMode.PERSISTENT).ConfigureAwait(false);
            }
            else
            {
                await this.zooKeeperClient.setDataAsync(path, Encoding.ASCII.GetBytes(data)).ConfigureAwait(false);
            }
        }

        public async Task<string> ListenAsync(string path)
        {
            using (var watcher = new WatcherEventHandler())
            {
                LastWatcher = watcher; // For testing
                await this.zooKeeperClient.existsAsync(path, watcher).ConfigureAwait(false);
                watcher.waitToComplete();
            }

            var dataResult = await this.zooKeeperClient.getDataAsync(path).ConfigureAwait(false);

            return dataResult == null ? null : Encoding.ASCII.GetString(dataResult.Data);
        }
    }
}
