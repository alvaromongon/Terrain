[assembly: WebActivator.PostApplicationStartMethod(typeof(Tribes.Configuration.WebApi.App_Start.SimpleInjectorWebApiInitializer), "Initialize")]

namespace Tribes.Configuration.WebApi.App_Start
{
    using System.Web.Http;
    using SimpleInjector;
    using SimpleInjector.Integration.WebApi;
    using DataSource.Zookeeper;
    using DataSource;
    using Manager;

    public static class SimpleInjectorWebApiInitializer
    {
        /// <summary>Initialize the container and register it as Web API Dependency Resolver.</summary>
        public static void Initialize()
        {
            var container = new Container();
            container.Options.DefaultScopedLifestyle = new WebApiRequestLifestyle();
            
            InitializeContainer(container);

            container.RegisterWebApiControllers(GlobalConfiguration.Configuration);
       
            container.Verify();
            
            GlobalConfiguration.Configuration.DependencyResolver =
                new SimpleInjectorWebApiDependencyResolver(container);
        }
     
        private static void InitializeContainer(Container container)
        {            
            container.Register<IZookeeperClient, ZookeeperClient>(Lifestyle.Scoped);
            container.RegisterInitializer<IZookeeperClient>(handlerToInitialize =>
            {
                handlerToInitialize.ConnectionString = System.Configuration.ConfigurationManager.ConnectionStrings["ZookeeperConnection"].ConnectionString;
            });
            container.Register<IConfigurationManager, Manager.ConfigurationManager>(Lifestyle.Scoped);

            container.Register<IConfigurationDataSource, ZookeeperConfigurationDataSource>(Lifestyle.Scoped);
        }
    }
}