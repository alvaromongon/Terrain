using org.apache.zookeeper;
using org.apache.zookeeper.data;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Tribes.Configuration.DataSource.Zookeeper
{
    public interface IZookeeperClient
    {
        string ConnectionString { set; }

        Task<Stat> existsAsync(string path, WatcherEventHandler watcher);
        Task<Stat> existsAsync(string path, bool watch = false);
        Task<string> createAsync(string path, byte[] data, List<ACL> acl, CreateMode createMode);
        Task<Stat> setDataAsync(string path, byte[] data, int version = -1);
        Task<DataResult> getDataAsync(string path, bool watch = false);
    }
}
