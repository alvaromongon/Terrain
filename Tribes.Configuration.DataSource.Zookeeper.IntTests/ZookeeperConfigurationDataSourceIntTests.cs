using System.Threading.Tasks;
using Xunit;

namespace Tribes.Configuration.DataSource.Zookeeper.IntTests
{
    public class ZookeeperConfigurationDataSourceIntTests
    {
        [Fact]
        public async Task Create_And_ListenForChanges_HappyPath()
        {
            var baseZNode = "/Configuration";
            var path = "/testPath";
            var dataBeforeChange = "dataBeforeChange";
            var dataAfterChange = "dataAfterChange";


            var connectionString = "127.0.0.1:2181,localhost:2128";
            var client = new ZookeeperExecutor(connectionString, baseZNode);
            IConfigurationDataSource configurationDataSource = new ZookeeperConfigurationDataSource(client);

            await configurationDataSource.DeleteAsync(path);

            await configurationDataSource.CreateAsync(path, dataBeforeChange);

            var unawaitedResult = configurationDataSource.ListenAsync(path);

            await configurationDataSource.CreateAsync(path, dataAfterChange);

            var awaitedResult = await unawaitedResult;

            Assert.Equal(dataAfterChange, awaitedResult);
        }
    }
}
