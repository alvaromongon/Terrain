# Terrain
Terrain generator + web client viewer and game

This is a project to help me test new technologies and at the same time do something I like it.

The idea is generate a terrain thhat includes vegetation and rivers and display it on a web client. From there, you can build your own online game.

Technologies overview:
- Terrain Generation based on c++ lib noise library: http://libnoise.sourceforge.net/
- C# Implementation of services to access the generated terrain
- WebApi implementation to access C# services throught the internet
- Typescript implementation of the web client using babylon.js (http://www.babylonjs.com/) for 3d support


Projects details:
- ComplexTerrain: 
  * VC++ Directories / Library Directories: F:\Personal\git\Terrain\noise\win32\Release;$(LibraryPath)
- TerrainGenerator.WebClient:
  * Typescript 1.6 
