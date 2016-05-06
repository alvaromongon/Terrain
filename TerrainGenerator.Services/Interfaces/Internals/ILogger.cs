namespace TerrainGenerator.Services.Interfaces.Internals
{
    internal enum logLevel
    {
        Verbose,
        Infomation,
        Warning,
        Error,
    }

    interface ILogger
    {
        void Log(string message, logLevel level = logLevel.Verbose, string category = "");
    }
}
