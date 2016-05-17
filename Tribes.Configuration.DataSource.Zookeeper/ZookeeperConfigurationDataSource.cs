using System.Threading.Tasks;
using org.apache.zookeeper;


namespace Tribes.Configuration.DataSource.Zookeeper
{    

    internal class ZookeeperConfigurationDataSource : IConfigurationDataSource
    {
        private const string ZNodeToBeWatched = "/configuration/";

        private readonly WatcherEventHandler watcher;

        private readonly ZooKeeper zooKeeper;

        public ZookeeperConfigurationDataSource(string connectionString)
        {
            this.watcher = new WatcherEventHandler();
            this.zooKeeper = new ZooKeeper(connectionString + ZNodeToBeWatched, 3000, this.watcher);
        }

        public Task CreateStaticAsync(string path, string data)
        {
            throw new System.NotImplementedException();
        }

        public Task CreateDynamicAsync(string path, string data)
        {
            throw new System.NotImplementedException();
        }

        public Task<string> ListenAsync(string path)
        {
            throw new System.NotImplementedException();
        }
    }
}
