var Terrain;
(function (Terrain) {
    (function (Tiles) {
        // Wrapper class with pointers to the surrounded tiles of a give tile
        var SurroundedTiles = (function () {
            function SurroundedTiles() {
            }
            return SurroundedTiles;
        })();
        Tiles.SurroundedTiles = SurroundedTiles;
    })(Terrain.Tiles || (Terrain.Tiles = {}));
    var Tiles = Terrain.Tiles;
})(Terrain || (Terrain = {}));
//# sourceMappingURL=SurroundedTiles.js.map
