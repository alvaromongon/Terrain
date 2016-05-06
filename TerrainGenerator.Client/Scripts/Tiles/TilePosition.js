var Terrain;
(function (Terrain) {
    (function (Tiles) {
        var TilePosition = (function () {
            function TilePosition(north, west) {
                this.NorthLalitude = north;
                this.WestLongitude = west;
            }
            return TilePosition;
        })();
        Tiles.TilePosition = TilePosition;
    })(Terrain.Tiles || (Terrain.Tiles = {}));
    var Tiles = Terrain.Tiles;
})(Terrain || (Terrain = {}));
//# sourceMappingURL=TilePosition.js.map
