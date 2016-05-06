var Terrain;
(function (Terrain) {
    var Tiles;
    (function (Tiles) {
        var TileCell = (function () {
            function TileCell(altitude, type, content) {
                this.a = altitude;
                this.t = type;
                this.c = content;
            }
            return TileCell;
        })();
        Tiles.TileCell = TileCell;
    })(Tiles = Terrain.Tiles || (Terrain.Tiles = {}));
})(Terrain || (Terrain = {}));
//# sourceMappingURL=ITileCell.js.map