using System;
using System.Threading;

namespace Tribes.Common
{
    public class LockFactory : IDisposable
    {
        private static readonly object CacheLock = new object();
        private const string KeyPrefix = "LockFactory_";

        private LockFactory(string key)
        {
            HttpRuntime.Cache.Insert(key, this, null, Cache.NoAbsoluteExpiration, new TimeSpan(0, 5, 0));
        }

        public static IDisposable AdquireLock(string identifier)
        {
            LockFactory cachedItem;
            lock (CacheLock)
            {
                var key = BuildCacheKey(identifier);
                cachedItem = HttpRuntime.Cache[key] as LockFactory ?? new LockFactory(key);
            }
            Monitor.Enter(cachedItem);
            return cachedItem;
        }

        private static string BuildCacheKey(string identifier)
        {
            return KeyPrefix + identifier;
        }

        public void Dispose()
        {
            Monitor.Exit(this);
        }
    }
}
