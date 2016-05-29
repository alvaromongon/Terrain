using System.Collections.Generic;
using System.Threading.Tasks;
using org.apache.zookeeper;
using org.apache.zookeeper.data;

namespace Tribes.Configuration.DataSource.Zookeeper
{
    public class ZookeeperClient : IZookeeperClient
    {
        private const string ZNodeToBeWatched = "/configuration";        
        private ZooKeeper zooKeeper;

        private string _connectionString;
        public string ConnectionString {
            get
            {
                return this._connectionString;
            }
            set {
                if (string.IsNullOrEmpty(value))
                {
                    throw new System.ArgumentNullException();
                }

                this._connectionString = value;
            }
        }

        public Task<Stat> existsAsync(string path, WatcherEventHandler watcher)
        {
            if (!this.IsConnected())
            {
                this.Connect();
            }
            return this.zooKeeper.existsAsync(path, watcher);
        }

        public Task<Stat> existsAsync(string path, bool watch = false)
        {
            if (!this.IsConnected())
            {
                this.Connect();
            }
            return this.zooKeeper.existsAsync(path, watch);
        }

        public Task<string> createAsync(string path, byte[] data, List<ACL> acl, CreateMode createMode)
        {
            if (!this.IsConnected())
            {
                this.Connect();
            }
            return this.zooKeeper.createAsync(path, data, acl, createMode);
        }

        public Task<Stat> setDataAsync(string path, byte[] data, int version = -1)
        {
            if (!this.IsConnected())
            {
                this.Connect();
            }
            return this.setDataAsync(path, data, version);
        }

        public Task<DataResult> getDataAsync(string path, bool watch = false)
        {
            if (!this.IsConnected())
            {
                this.Connect();
            }
            return this.zooKeeper.getDataAsync(path, watch);
        }

        private bool IsConnected()
        {
            return zooKeeper != null && zooKeeper.getState() == ZooKeeper.States.CONNECTED;
        }

        private void Connect()
        {
            this.zooKeeper = new ZooKeeper(this.ConnectionString + ZNodeToBeWatched, 3000, null);
        }
    }
}
