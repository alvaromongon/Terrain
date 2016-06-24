namespace Tribes.Configuration.DataSource.Zookeeper.Tests
{
    using System.Threading.Tasks;
    using System.Threading;
    using Xunit;
    using org.apache.zookeeper;
    using org.apache.zookeeper.data;
    using Moq;
    public class ZookeeperConfigurationDataSourceUnitTests
    {
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
