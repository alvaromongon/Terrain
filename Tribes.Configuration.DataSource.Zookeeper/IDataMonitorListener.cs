using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Tribes.Configuration.DataSource.Zookeeper
{
    internal interface IDataMonitorListener
    {
        /// <summary>
        /// The existence status of the node has changed.
        /// </summary>
        /// <param name="data"></param>
        void exists(byte[] data);

        /// <summary>
        /// The ZooKeeper session is no longer valid.
        /// </summary>
        /// <param name="reasonCode">reason code</param>
        void closing(int reasonCode);
    }
}
