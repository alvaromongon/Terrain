using org.apache.zookeeper;
using org.apache.zookeeper.data;
using System;
using System.Threading.Tasks;
using static org.apache.zookeeper.KeeperException;

namespace Tribes.Configuration.DataSource.Zookeeper
{
    internal class ZookeeperDataMonitor : Watcher, IConfigurationDataSource
    {
        internal bool IsDeath;

        private ZooKeeper _zk;
        private string _rootZNode;
        private Watcher _chainedWatcher;
        private IDataMonitorListener _dataMonitorListener;


        public ZookeeperDataMonitor(ZooKeeper zk, string rootZNode, Watcher chainedWatcher, IDataMonitorListener dataMonitorListener)
        {
            this._zk = zk;
            this._rootZNode = rootZNode;
            this._chainedWatcher = chainedWatcher;
            this._dataMonitorListener = dataMonitorListener;

            this._zk.existsAsync(this._rootZNode, this).Wait();
        }

        public override Task process(WatchedEvent @event)
        {
            Task peviousTask = null;

            string path = @event.getPath();
            if (@event.get_Type() == Event.EventType.None)
            {
                // We are are being told that the state of the
                // connection has changed
                switch (@event.getState())
                {
                    case Watcher.Event.KeeperState.SyncConnected:
                        // In this particular example we don't need to do anything
                        // here - watches are automatically re-registered with 
                        // server and any watches triggered while the client was 
                        // disconnected will be delivered (in order of course)
                        break;
                    case Watcher.Event.KeeperState.Expired:
                        // It's all over
                        this.IsDeath = true;
                        this._dataMonitorListener.closing((int)KeeperException.Code.SESSIONEXPIRED);
                        break;
                }
            }
            else
            {
                if (path != null && path.Equals(this._rootZNode))
                {
                    // Something has changed on the node, let's find out
                    peviousTask = this._zk.existsAsync(this._rootZNode, this);
                }
            }

            if (this._chainedWatcher != null)
            {
                if (peviousTask != null)
                {
                    peviousTask.Wait();
                }
                return this._chainedWatcher.process(@event);
            } 
            else
            {
               return peviousTask != null ? peviousTask : Task.CompletedTask;
            }
        }

        /// <summary>
        /// Don't confuse the completion callback with the watch callback. 
        /// The ZooKeeper.exists() completion callback, 
        /// which happens to be the method StatCallback.processResult() implemented in the DataMonitor object, 
        /// is invoked when the asynchronous setting of the watch operation (by ZooKeeper.exists()) completes on the server. 
        /// </summary>
        /// <param name="reasonCode"></param>
        /// <param name="path"></param>
        /// <param name="ctx"></param>
        /// <param name="stat"></param>
        public void processResult(int reasonCode, String path, Object ctx, Stat stat)
        {
            bool exists;

            switch ((Code)reasonCode)
            {
                case Code.OK:
                    exists = true;
                    break;
                case Code.NONODE:
                    exists = false;
                    break;
                case Code.SESSIONEXPIRED:
                case Code.NOAUTH:
                    this.IsDeath = true;
                    this._dataMonitorListener.closing(reasonCode);
                    return;
                default:
                    // Retry errors
                    this._zk.existsAsync(this._rootZNode, this).Wait();
                    return;
            }

            DataResult dataResult = null;
            if (exists)
            {
                try
                {
                    dataResult = this._zk.getDataAsync(this._rootZNode).Result;
                }
                catch (KeeperException e)
                {
                    // We don't need to worry about recovering now. The watch
                    // callbacks will kick off any exception handling
                    Console.WriteLine(e.StackTrace);
                }
                catch (Exception ex)
                {
                    Console.WriteLine("Unhandle: " + ex.StackTrace);
                    return;
                }
            }

            this._dataMonitorListener.exists(dataResult.Data);
        }

        public Task CreateAsync(string path, string data)
        {
            throw new NotImplementedException();
        }

        public Task DeleteAsync(string path)
        {
            throw new NotImplementedException();
        }

        public Task<string> ListenAsync(string path)
        {
            throw new NotImplementedException();
        }        
    }
}
