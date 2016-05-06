var Terrain;
(function (Terrain) {
    var Tiles;
    (function (Tiles) {
        var TileImage = (function () {
            function TileImage(tileSize, gridSize, miniMap) {
                this.tileSize = tileSize;
                this.gridSize = gridSize;
                this.miniMap = miniMap;
                TileImage.instance = this;
            }
            TileImage.GetExistingInstance = function () {
                return TileImage.instance;
            };
            TileImage.prototype.LoadTileImage = function (north, west) {
                if (this.miniMap.tagName == "IMG" && !(this.north == north && this.west == west)) {
                    this.north = north;
                    this.west = west;
                    console.log("Requesting a new image tile");
                    var systemHttpClient = Terrain.HttpClients.SystemHttpClient.GetInstance();
                    systemHttpClient.GetTileImage({ NorthLalitude: this.north, WestLongitude: this.west }, this.OnImageLoaded);
                }
            };
            TileImage.prototype.OnImageLoaded = function (data) {
                if (data) {
                    TileImage.GetExistingInstance().miniMap.setAttribute("src", "data:image/bmp;base64," + data);
                }
            };
            return TileImage;
        })();
        Tiles.TileImage = TileImage;
    })(Tiles = Terrain.Tiles || (Terrain.Tiles = {}));
})(Terrain || (Terrain = {}));
//# sourceMappingURL=TileImage.js.map