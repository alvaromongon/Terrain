using org.apache.zookeeper;

namespace Tribes.Configuration.DataSource.Zookeeper
{
    using System;
    using System.Threading;
    using System.Threading.Tasks;

    internal class WatcherEventHandler : Watcher, IDisposable
    {
        private readonly CountdownEvent countDownEvent = new CountdownEvent(1);

        internal async Task waitToComplete()
        {
            this.countDownEvent.Wait();
            
            //The latest version of the .Net Framework (v4.6) adds just that with the Task.CompletedTask static property
            //Task.FromResult<object>(null);
        }

        public override async Task process(WatchedEvent @event)
        {
            this.countDownEvent.Signal();

            // TODO
            //The latest version of the .Net Framework (v4.6) adds just that with the Task.CompletedTask static property
            //return Task.FromResult<object>(null);
        }

        public void Dispose()
        {
            this.countDownEvent.Dispose();
        }
    }
}
