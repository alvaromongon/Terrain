using System.Threading.Tasks;
using org.apache.zookeeper;
using System.Collections.Generic;
using System.Text;


namespace Tribes.Configuration.DataSource.Zookeeper
{
    using org.apache.zookeeper.data;

    internal class ZookeeperConfigurationDataSource : IConfigurationDataSource
    {
        private const string ZNodeToBeWatched = "/configuration/";

        private readonly ZooKeeper zooKeeper;

        public ZookeeperConfigurationDataSource(string connectionString)
        {            
            this.zooKeeper = new ZooKeeper(connectionString + ZNodeToBeWatched, 3000, null);
        }

        public async Task CreateAsync(string path, string data)
        {
            var stat = await this.zooKeeper.existsAsync(path);
            if (stat == null)
            {
                await this.zooKeeper.createAsync(path, Encoding.ASCII.GetBytes(data), new List<ACL>(), CreateMode.PERSISTENT).ConfigureAwait(false);
            }
            else
            {
                await this.zooKeeper.setDataAsync(path, Encoding.ASCII.GetBytes(data)).ConfigureAwait(false);
            }            
        }

        public async Task<string> ListenAsync(string path)
        {
            using (var watcher = new WatcherEventHandler())
            {
                await this.zooKeeper.existsAsync(path, watcher).ConfigureAwait(false);
                await watcher.waitToComplete().ConfigureAwait(false);
            }

            var dataResult = await this.zooKeeper.getDataAsync(path).ConfigureAwait(false);

            return Encoding.ASCII.GetString(dataResult.Data);
        }
    }
}
