using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using TerrainGenerator.Services;
using TerrainGenerator.Services.Implementations;
using TerrainGenerator.Services.Implementations.Storage;
using TerrainGenerator.Services.Interfaces;
using TerrainGenerator.Services.Interfaces.Internals;

namespace TerrainGenerator.Contracts
{
    public class ServicesFactory
    {
        /// <summary>
        /// Dictionary of types and method to create the type. The boolean value indicate if the service should be static
        /// </summary>
        private static readonly IDictionary<Type, Tuple<Func<Object>,bool>> ServicesMapper = new Dictionary<Type, Tuple<Func<Object>, bool>>()
        {
            {typeof(ILogger), new Tuple<Func<object>, bool>(() => new LoggerFileStorage("services.log"), true)},
            {typeof(ITilesStorage), new Tuple<Func<object>, bool>(() => new TilesFileStorage(ServicesFactory.Build(typeof(ILogger)) as ILogger), true)},
            {typeof(IActionRulesStorage), new Tuple<Func<object>, bool>(() => new ActionRulesFileStorage(), true)},
            {typeof(ITilesManager), new Tuple<Func<object>, bool>(() => new TilesManager(new TilesGeneratorService(), new TileAdjustmentService(), ServicesFactory.Build(typeof(ITilesStorage)) as ITilesStorage, new MapColorGeneratorService()), true)},
            {typeof(IPositionService), new Tuple<Func<object>, bool>(() => new RandomPositionService(ServicesFactory.Build(typeof(ITilesManager)) as ITilesManager), true)},
            //{typeof(IPositionService), new Tuple<Func<object>, bool>(() => new ExistingTilesPositionService(ServicesFactory.Build(typeof(ITilesStorage)) as ITilesStorage, ServicesFactory.Build(typeof(ITilesManager)) as ITilesManager), true)},
            {typeof(IAccountsManager), new Tuple<Func<object>, bool>(() => new AccountsManager(new AccountFileStorage(), new AccountNotificationService()), true)},
            {typeof(IActionRulesService), new Tuple<Func<object>, bool>(() => new ActionRulesService(ServicesFactory.Build(typeof(IActionRulesStorage)) as IActionRulesStorage), true)},
            {typeof(IAccountSynchronizationService), new Tuple<Func<object>, bool>(() => new AccountSynchronizationService(ServicesFactory.Build(typeof(ILogger)) as ILogger, ServicesFactory.Build(typeof(IAccountsManager)) as IAccountsManager, ServicesFactory.Build(typeof(IActionRulesService)) as IActionRulesService, ServicesFactory.Build(typeof(ITilesManager)) as ITilesManager), true)}
        };

        /// <summary>
        /// Dictionary of types the services instantiated created for that type.
        /// </summary>
        private static readonly ConcurrentDictionary<Type, Object> StaticServicesInstantiated = new ConcurrentDictionary<Type, Object>();

        /// <summary>
        /// Return a new instance of a service or an existent one in the case of a static service
        /// </summary>
        /// <param name="serviceType">Type of the service to build</param>
        /// <returns>Instance of the service</returns>
        public static object Build(Type serviceType)
        {
            if (ServicesMapper.ContainsKey(serviceType) && ServicesMapper[serviceType].Item2)
            {
                if (StaticServicesInstantiated.ContainsKey(serviceType))
                {
                    return StaticServicesInstantiated[serviceType];
                }
                
                var service = ServicesMapper[serviceType].Item1.Invoke();
                StaticServicesInstantiated.AddOrUpdate(serviceType, service, (key, value) => service);

                return service;
            }

            return ServicesMapper.ContainsKey(serviceType) ? ServicesMapper[serviceType].Item1.Invoke() : null;
        }
    }
}
