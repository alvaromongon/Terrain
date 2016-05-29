using System;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace Tribes.Configuration.DataSource.Zookeeper.Tests
{
    [TestClass]
    public class ZookeeperClientUnitTests
    {
        [TestMethod]
        public void getDataAsync_IfNotConnect_TryToConnect()
        {
            //TODO: How can test this method.
            // Should I inject ZooKeeper? 
            // In which case, should I configure the container in this library? (WebApi should not now anything about zooKeeper, right?)
        }
    }
}
