namespace Tribes.Configuration.DataSource.Zookeeper.Tests
{
    using System.Threading.Tasks;
    using System.Threading;
    using Xunit;
    using org.apache.zookeeper;
    using org.apache.zookeeper.data;
    using Moq;
    using System.Collections.Generic;
    public class ZookeeperConfigurationDataSourceUnitTests
    {
        [Fact]
        public async Task CreateAsync_CallCreateWhenPathDoesNotExist()
        {
            var path = "somePath";
            var dataString = "dataString";
            var zookeeperClient = new Mock<IZookeeperClient>();
            zookeeperClient.Setup(zoo => zoo.existsAsync(path, It.IsNotNull<WatcherEventHandler>())).Returns(Task.FromResult<Stat>(null));
            zookeeperClient.Setup(zoo => zoo.createAsync(path, It.IsAny<byte[]>(), new List<ACL>(), CreateMode.PERSISTENT)).Returns(Task.FromResult<string>(null));            
            var zookeeperDataSource = new ZookeeperConfigurationDataSource(zookeeperClient.Object);

            await zookeeperDataSource.CreateAsync(path, dataString);

            zookeeperClient.Verify(zoo => zoo.createAsync(path, It.IsAny<byte[]>(), new List<ACL>(), CreateMode.PERSISTENT), Times.Once);
        }

        [Fact]
        public async Task CreateAsync_CallSetWhenPathtExist()
        {
            var path = "somePath";
            var dataString = "dataString";
            var zookeeperClient = new Mock<IZookeeperClient>();
            zookeeperClient.Setup(zoo => zoo.existsAsync(path, It.IsAny<bool>())).Returns(Task.FromResult<Stat>(new Stat()));
            zookeeperClient.Setup(zoo => zoo.setDataAsync(path, It.IsAny<byte[]>(), It.IsAny<int>())).Returns(Task.FromResult<Stat>(null));
            var zookeeperDataSource = new ZookeeperConfigurationDataSource(zookeeperClient.Object);

            await zookeeperDataSource.CreateAsync(path, dataString);

            zookeeperClient.Verify(zoo => zoo.setDataAsync(path, It.IsAny<byte[]>(), It.IsAny<int>()), Times.Once);
        }

        [Fact]
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

            Assert.Null(result);
        }
    }
}
