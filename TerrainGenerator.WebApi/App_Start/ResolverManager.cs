using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Http.Dependencies;
using TerrainGenerator.Contracts;
using TerrainGenerator.Services;
using TerrainGenerator.Services.Interfaces;
using TerrainGenerator.WebApi.Controllers;
using TerrainGenerator.WebApi.Pipeline.Controllers;

namespace TerrainGenerator.WebApi
{
    public class ResolverManager : IDependencyResolver
    {
        private static readonly IDictionary<Type, Type[]> ControllerServicesMapper = new Dictionary<Type, Type[]>()
        {
            {typeof(SystemConfigurationController), new []{typeof(IAccountsManager), typeof(IPositionService), typeof(IActionRulesStorage)}},
            {typeof(TilesController), new []{typeof(ITilesManager)}},
            {typeof(MiniMapController), new []{typeof(ITilesManager)}},
            {typeof(ResourcesController), new []{typeof(IAccountsManager)}},
            {typeof(AccountController), new []{typeof(IAccountsManager)}}
        };

        public object GetService(Type serviceType)
        {
            if (!ControllerServicesMapper.ContainsKey(serviceType))
            {
                return null;
            }

            var paramsObject = ControllerServicesMapper[serviceType].Select(ServicesFactory.Build).ToArray();

            return Activator.CreateInstance(serviceType,paramsObject);
        }
        public IEnumerable<object> GetServices(Type serviceType)
        {
            return new List<object>();
        }
        public IDependencyScope BeginScope()
        {
            return this;
        }
        public void Dispose()
        {

        }
    }
}