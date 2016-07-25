using System.Collections.Generic;
using System.Threading.Tasks;
using org.apache.zookeeper;
using org.apache.zookeeper.data;
using System.Text;
using System;
using System.Threading;

namespace Tribes.Configuration.DataSource.Zookeeper
{
    /// <summary>
    /// https://zookeeper.apache.org/doc/r3.1.2/javaExample.html#sc_executor
    /// </summary>
    public class ZookeeperExecutor : Watcher, IDataMonitorListener, IDisposable
    {
        private bool disposed = false;
        private const int CONNECTION_TIMEOUT = 60000;
        private string _connectionString;
        private string _rootZNode = null;
        private ZooKeeper _client;
        private ZookeeperDataMonitor _dataMonitor;

        public ZookeeperExecutor(string connectionString, string rootZNode)
        {
            if (string.IsNullOrEmpty(connectionString))
            {
                throw new System.ArgumentNullException();
            }

            this._connectionString = connectionString;
            this._client = new ZooKeeper(connectionString, CONNECTION_TIMEOUT, this);
            this._dataMonitor = new ZookeeperDataMonitor(this._client, rootZNode, null, this);
        }

        public IConfigurationDataSource Execute()
        {
            try
            {
                Monitor.Enter(this);

                try
                {
                    while (!this._dataMonitor.IsDeath)
                    {
                        // (this._connectionString + _rootZNode, CONNECTION_TIMEOUT, new WatcherEventHandler());
                        Monitor.Wait(this);
                    }
                }
                finally
                {
                    Monitor.Exit(this);
                }
                
            }
            catch (AggregateException e)
            {
                String msg = String.Empty;
                foreach (var ie in e.InnerExceptions)
                {
                    Console.WriteLine("{0}", ie.GetType().Name);
                    if (!msg.Contains(ie.Message))
                        msg += ie.Message + Environment.NewLine;
                }
                Console.WriteLine("\nException Message(s):");
                Console.WriteLine(msg);
            }
            return this._dataMonitor as IConfigurationDataSource;
        }

        public override Task process(WatchedEvent @event)
        {
            return this._dataMonitor.process(@event);
        }

        public void exists(byte[] data)
        {
            try
            {
                Monitor.Enter(this);

                try
                {
                    if (data == null)
                    {
                        this.Dispose();
                        Console.WriteLine("Killing process");                        
                    }
                    else
                    {
                        this.Dispose();

                        // TODO: This should not work, because execute return an object
                        this.Execute();       
                        Console.WriteLine("Starting child");                        
                    }
                }
                finally
                {
                    Monitor.Exit(this);
                }
            }
            catch (AggregateException e)
            {
                String msg = String.Empty;
                foreach (var ie in e.InnerExceptions)
                {
                    Console.WriteLine("{0}", ie.GetType().Name);
                    if (!msg.Contains(ie.Message))
                        msg += ie.Message + Environment.NewLine;
                }
                Console.WriteLine("\nException Message(s):");
                Console.WriteLine(msg);
            }
        }

        public void closing(int reasonCode)
        {
            try
            {
                Monitor.Enter(this);

                try
                {
                    Monitor.PulseAll(this);
                }
                finally
                {
                    Monitor.Exit(this);
                }
            }
            catch (AggregateException e)
            {
                String msg = String.Empty;
                foreach (var ie in e.InnerExceptions)
                {
                    Console.WriteLine("{0}", ie.GetType().Name);
                    if (!msg.Contains(ie.Message))
                        msg += ie.Message + Environment.NewLine;
                }
                Console.WriteLine("\nException Message(s):");
                Console.WriteLine(msg);
            }
        }

        public void Dispose()
        {
            Dispose(true);
            GC.SuppressFinalize(this);
        }

        // Protected implementation of Dispose pattern.
        protected virtual void Dispose(bool disposing)
        {
            if (disposed)
            {
                return;
            }

            if (disposing)
            {
                this.closeConnection().Wait();
            }

            disposed = true;
        }

        private bool isConnected()
        {
            return _client != null && 
                (_client.getState() == ZooKeeper.States.CONNECTED 
                || _client.getState() == ZooKeeper.States.CONNECTING 
                || _client.getState() == ZooKeeper.States.CONNECTEDREADONLY);
        }

        private Task closeConnection()
        {
            if (this.isConnected())
            {
                return this._client.closeAsync();
            }
            return Task.CompletedTask;
        }        
    }
}
