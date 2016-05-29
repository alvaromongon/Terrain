using org.apache.zookeeper;

namespace Tribes.Configuration.DataSource.Zookeeper
{
    using System;
    using System.Threading;
    using System.Threading.Tasks;

    public class WatcherEventHandler : Watcher, IDisposable
    {
        private readonly CountdownEvent countDownEvent = new CountdownEvent(1);

        internal void waitToComplete()
        {
            this.countDownEvent.Wait();        
        }

        public override Task process(WatchedEvent @event)
        {
            this.countDownEvent.Signal();
            return Task.FromResult(0);
        }

        public void Dispose()
        {
            this.countDownEvent.Dispose();
        }
    }
}
