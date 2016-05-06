using System;
using System.Configuration;
using System.IO;
using System.Text;
using TerrainGenerator.Services.Interfaces.Internals;
using TerrainGenerator.Services.Utils;

namespace TerrainGenerator.Services.Implementations.Storage
{
    internal class LoggerFileStorage : BaseFileStorage, ILogger
    {

        public LoggerFileStorage(string fileName) : base()
        {
            this.file = fileName;
            this.folder = ConfigurationManager.AppSettings.Get(ConfigurationKeys.LogsFolder);
            CreateDirectory();
        }

        public void Log(string message, logLevel level, string category)
        {
            using (LockFactory.AdquireLock(this.GetFullFilePath()))
            {
                using (var streamWriter = new StreamWriter(this.GetFullFilePath(), true))
                {
                    var toWrite = new StringBuilder();

                    toWrite.Append("[" + level + "] -- ");

                    if (!string.IsNullOrEmpty(category))
                    {
                        toWrite.Append("[" + category + "] -- ");
                    }
                    toWrite.Append(DateTime.UtcNow.ToString("s") + " -- " + message);

                    streamWriter.WriteLine(toWrite);
                }
            }
        }
    }
}
