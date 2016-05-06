using System;
using System.IO;
using TerrainGenerator.Services.Utils;

namespace TerrainGenerator.Services.Implementations.Storage
{
    delegate string BuildFolderPathMethod();

    class BaseFileStorage
    {
        private static readonly Object LockedObject = new Object();
        protected string file;
        protected string folder;
        
        public BaseFileStorage()
        {            
        }

        protected string GetFullFilePath()
        {
            return FilePathsFactory.BuildFilePath(this.folder, this.file);
        }

        protected void CreateDirectory()
        {
            lock (LockedObject)
            {
                if (!Directory.Exists(FilePathsFactory.BuildFolderPath(this.folder)))
                {
                    Directory.CreateDirectory(FilePathsFactory.BuildFolderPath(this.folder));
                }
            }
        }
    }
}
