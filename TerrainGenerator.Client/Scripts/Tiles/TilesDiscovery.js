/// <reference path="../typings/jquery/jquery.d.ts"/>
var Terrain;
(function (Terrain) {
    (function (Tiles) {
        var TilesDiscovery = (function () {
            function TilesDiscovery() {
            }
            TilesDiscovery.onGetTilesConfiguration = function (loadable) {
                var promise = $.getJSON("api/TilesConfiguration");
                promise.done(function (data) {
                    return loadable._load(data);
                });
            };

            TilesDiscovery.onGetTileData = function (tilePosition, loadable) {
                var promise = $.getJSON("api/Tiles", tilePosition);
                promise.done(function (data) {
                    return loadable._load(data);
                });
            };

            TilesDiscovery.onGetTileImage = function (tilePosition, loadable) {
                var promise = $.get("api/MiniMap", tilePosition);
                promise.done(function (data) {
                    return loadable._load(data);
                });
            };
            return TilesDiscovery;
        })();
        Tiles.TilesDiscovery = TilesDiscovery;
    })(Terrain.Tiles || (Terrain.Tiles = {}));
    var Tiles = Terrain.Tiles;
})(Terrain || (Terrain = {}));
