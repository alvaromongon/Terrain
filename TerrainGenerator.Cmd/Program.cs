using System;
using System.IO;
using System.Linq;
using System.Runtime.InteropServices;

namespace TerrainGenerator.Cmd
{
    class Program
    {
        [DllImport("ComplexTerrain.dll", EntryPoint = "SetBaseDirectory", CallingConvention = CallingConvention.Cdecl)]
        extern static void SetBaseDirectory(string absolutePathDirectory);

        [DllImport("ComplexTerrain.dll", EntryPoint = "BuildDataPlanetFiles", CallingConvention = CallingConvention.Cdecl)]
        extern static int BuildDataPlanetFiles(float northCoord, float westCoord, int widthTileSize, int heightTileSize, float deltaNorthCoord, float deltaWestCoord, int width, int height, string destinyDirectory);

        [DllImport("ComplexTerrain.dll", EntryPoint = "BuildImagePlanetFiles", CallingConvention = CallingConvention.Cdecl)]
        extern static int BuildImagePlanetFiles(float northCoord, float westCoord, int widthTileSize, int heightTileSize, float deltaNorthCoord, float deltaWestCoord, int width, int height, string destinyDirectory);

        private const string SetBaseDirectoryCommand = "SetBaseDirectory";
        private const string BuildDataPlanetFilesCommand = "BuildDataPlanetFiles";
        private const string BuildImagePlanetFilesCommand = "BuildImagePlanetFiles";
        private const string WrongNumberArgumentsText = "Wrong number of arguments";
        private const string UnknownCommandText = "Unknown command";
        private const string DirectoryDoesNotExistText = "Directory does not exist";

        static int Main(string[] args)
        {
            // TODO: this is a good way of creating a console
            //http://www.codeproject.com/Articles/816301/Csharp-Building-a-Useful-Extensible-NET-Console-Ap

            try
            {
                if (!args.Any())
                {
                    throw new ArgumentException(WrongNumberArgumentsText);
                }

                var startDateTime = DateTime.Now;

                switch (args[0])
                {
                    case SetBaseDirectoryCommand:
                        if (args.Count() < 2)
                        {
                            throw new ArgumentException(WrongNumberArgumentsText);
                        }
                        ExecuteSetBaseDirectoryCommand(args);
                        break;
                    case BuildDataPlanetFilesCommand:
                    case BuildImagePlanetFilesCommand:
                        if (args.Count() < 10)
                        {
                            throw new ArgumentException(WrongNumberArgumentsText);
                        }                        
                        ExecuteBuildPlanetFilesCommand(args);
                        break;
                    default:
                        throw new ArgumentException(UnknownCommandText);
                }

                var endDataTime = DateTime.Now;

                Console.WriteLine("Command executed successfully! :)");
                Console.WriteLine("Time elapsed: {0} seconds", endDataTime.Subtract(startDateTime).TotalSeconds);
                return 0;
            }
            catch (ArgumentException ex)
            {
                Console.WriteLine(ex.Message);
                if (ex.InnerException != null)
                {
                    Console.WriteLine(ex.InnerException.Message);
                }                
                Console.WriteLine(GetUsageText());
                return 1;
            }
            catch (ExternalException ex)
            {
                Console.WriteLine("Command executed unsuccessfully... :(");
                Console.WriteLine(ex.Message);
                return 2;
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return 3;
            }
        }

        private static string GetUsageText()
        {
            return "Usage:" + Environment.NewLine + 
                "Command SetBaseDirectory: " + Environment.NewLine +
                "   SetBaseDirectory {absolutePathDirectory}" + Environment.NewLine +
                "Command BuildDataPlanetFiles: " + Environment.NewLine +
                "   BuildDataPlanetFiles {northCoord} {westCood} {widthTileSize} {heightTileSize} {deltaNorthCoord} {deltaWestCoord} {width} {height} {destinyDirectory}" + Environment.NewLine +
                "Command BuildImagePlanetFiles: " + Environment.NewLine +
                "   BuildImagePlanetFiles {northCoord} {westCood} {widthTileSize} {heightTileSize} {deltaNorthCoord} {deltaWestCoord} {width} {height} {destinyDirectory}" + Environment.NewLine;
        }

        private static void ExecuteSetBaseDirectoryCommand(string[] args)
        {
            try
            {
                if (!Directory.Exists(@args[1]))
                {
                    throw new ArgumentException(DirectoryDoesNotExistText);
                }
                SetBaseDirectory(args[1]);                 
            }
            catch (ArgumentException ex)
            {
                throw new ArgumentException("Error parsing data for build data files command", ex);
            }
            catch (Exception ex)
            {
                throw new ExternalException(ex.Message);
            }
        }

        private static void ExecuteBuildPlanetFilesCommand(string[] args)
        {           
            try
            {
                if (!Directory.Exists(@args[9]))
                {
                    throw new Exception(DirectoryDoesNotExistText);
                }
                var northCoord = float.Parse(args[1]);
                var westCoord = float.Parse(args[2]);
                var widthTileSize = int.Parse(args[3]);
                var heightTileSize = int.Parse(args[4]);
                var deltaNorthCoord = float.Parse(args[5]);
                var deltaWestCoord = float.Parse(args[6]);
                var width = int.Parse(args[7]);
                var height = int.Parse(args[8]);
                var destinyDirectory = @args[9];

                var result = 1;
                switch (args[0])
                {
                    case BuildDataPlanetFilesCommand:
                        result = BuildDataPlanetFiles(northCoord, westCoord, widthTileSize, heightTileSize, deltaNorthCoord, deltaWestCoord, width, height, destinyDirectory);
                        break;
                    case BuildImagePlanetFilesCommand:
                        result = BuildImagePlanetFiles(northCoord, westCoord, widthTileSize, heightTileSize, deltaNorthCoord, deltaWestCoord, width, height, destinyDirectory);
                        break;
                }
                if (result != 0)
                {
                    throw new ExternalException();
                }
            }
            catch (ExternalException)
            {                
                throw;
            }
            catch (Exception ex)
            {
                throw new ArgumentException("Error parsing data for build data files command",ex);
            }
        }
    }
}
