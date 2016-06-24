namespace Tribes.Configuration.DataSource.Zookeeper.Tests
{
    using Xunit;
   
    public class ZookeeperClientUnitTests
    {
        [Fact]
        public void getDataAsync_IfNotConnect_TryToConnect()
        {
            //TODO: How can test this method.
            // Should I inject ZooKeeper? 
            // In which case, should I configure the container in this library? (WebApi should not now anything about zooKeeper, right?)
        }
    }
}
