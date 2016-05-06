using System;
using System.Configuration;
using System.Threading;
using TerrainGenerator.Contracts;
using TerrainGenerator.Services.Contracts;
using TerrainGenerator.Services.Interfaces;
using TerrainGenerator.Services.Interfaces.Internals;
using TerrainGenerator.Services.Utils;

namespace TerrainGenerator.Services.Workers
{
    public static class AccountsSynchronizationWorker
    {
        private static Timer timer;

        public static void Initizalize(TimeSpan dueTimeSeconds, TimeSpan periodSeconds)
        {
            // Create an event to signal the timeout count threshold in the
            // timer callback.
            var autoEvent = new AutoResetEvent(false);

            // Create an inferred delegate that invokes methods for the timer.
            TimerCallback tcb = AccountsSynchronizationWorker.DoWork;

            // Create a timer that signals the delegate to invoke 
            // CheckStatus after one second, and every 1/4 second 
            // thereafter.
            //Console.WriteLine("{0} Creating timer.\n", DateTime.Now.ToString("h:mm:ss.fff"));
            timer = new Timer(tcb, autoEvent, dueTimeSeconds, periodSeconds);

            // When autoEvent signals, change the period to every 1/2 second.
            //autoEvent.WaitOne(5000, false);
            //stateTimer.Change(0, 500);
            //Console.WriteLine("\nChanging period.\n");

            // When autoEvent signals the second time, dispose of the timer.
            //autoEvent.WaitOne(5000, false);
            //stateTimer.Dispose();
            //Console.WriteLine("\nDestroying timer.");
        }

        private static void DoWork(Object stateInfo)
        {
            var accountSynchronizationService = ServicesFactory.Build(typeof(IAccountSynchronizationService)) as IAccountSynchronizationService;

            if (accountSynchronizationService != null)
            {
                accountSynchronizationService.SynchronizeAll();
            }
            else
            {
                var logger = ServicesFactory.Build(typeof(ILogger)) as ILogger;
                if (logger == null) throw new ArgumentNullException("logger");
                logger.Log("AccountsSynchronizationWorker, Impossible to create an instance of the account synchronization service object", logLevel.Verbose);
            }
        }
    }
}
