# Terrain
Terrain generator + web client viewer and game

This is a project to help me test new technologies and at the same time do something I like it.

The idea is generate a terrain that includes vegetation and rivers and display it on a web client. From there, you can build your own online game.

Technologies overview:
- Terrain Generation based on c++ lib noise library: http://libnoise.sourceforge.net/
- Distributed system:
	- Configuration manager:
		* Restfull WebApi
		* https://simpleinjector.org/
		* https://github.com/shayhatsor/zookeeper
		* http://zookeeper.apache.org/
- Typescript implementation of the web client using babylon.js (http://www.babylonjs.com/) for 3d support

  
  
Researched web sites:
http://www.devtrends.co.uk/blog/how-not-to-do-dependency-injection-the-static-or-singleton-container
http://www.asp.net/web-api/overview/getting-started-with-aspnet-web-api/creating-api-help-pages
http://www.asp.net/web-api/overview/error-handling/web-api-global-error-handling
