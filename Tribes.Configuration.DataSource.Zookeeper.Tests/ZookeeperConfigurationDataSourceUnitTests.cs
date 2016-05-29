using System;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Tribes.Configuration.DataSource.Zookeeper;
using Moq;
using System.Threading.Tasks;
using org.apache.zookeeper;
using org.apache.zookeeper.data;
using System.Threading;

namespace Tribes.Configuration.DataSource.Zookeeper.Tests
{
    [TestClass]
    public class ZookeeperConfigurationDataSourceUnitTests
    {
        [TestMethod]
        public async Task ListenAsync_WaitUntilSignaled()
        {
            var path = "somePath";
            var zookeeperClient = new Mock<IZookeeperClient>();
            zookeeperClient.Setup(zoo => zoo.existsAsync(path, It.IsNotNull<WatcherEventHandler>())).Returns(Task.FromResult<Stat>(null));
            zookeeperClient.Setup(zoo => zoo.getDataAsync(path, false)).Returns(Task.FromResult<DataResult>(null));
            var zookeeperDataSource = new ZookeeperConfigurationDataSource(zookeeperClient.Object);

            var listenResult = Task.Run(() => zookeeperDataSource.ListenAsync("somePath"));

            // TODO: How to wait until ListenAsync is waiting for signal?
            Thread.Sleep(1000);

            // Force call to process on watcher. This will fire a signal
            await ZookeeperConfigurationDataSource.LastWatcher.process(null);

            var result = await listenResult;

            Assert.IsNull(result);
        }
    }
}
