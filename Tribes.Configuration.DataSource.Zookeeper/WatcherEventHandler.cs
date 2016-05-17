using org.apache.zookeeper;

namespace Tribes.Configuration.DataSource.Zookeeper
{
    using System.Threading.Tasks;

    internal class WatcherEventHandler : Watcher
    {
        public override Task process(WatchedEvent @event)
        {
            
        }
    }
}
