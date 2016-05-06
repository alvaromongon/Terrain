var Terrain;
(function (Terrain) {
    (function (Tiles) {
        var TileImage = (function () {
            function TileImage(north, west, tileSize, gridSize, miniMap) {
                this.north = north;
                this.west = west;
                this.tileSize = tileSize;
                this.gridSize = gridSize;
                this.miniMap = miniMap;
            }
            TileImage.prototype.LoadTileImage = function (north, west) {
                if (this.miniMap.hasAttribute("src") && !(this.north == north && this.west == west)) {
                    this.north = north;
                    this.west = west;

                    console.log("Requesting a new image tile: North: " + this.north + " - West: " + this.west + " - GridSize : " + this.gridSize + " - TileSize : " + this.tileSize);

                    Tiles.TilesDiscovery.onGetTileImage({ NorthLalitude: this.north, WestLongitude: this.west }, this);
                }
            };

            TileImage.prototype._load = function (data) {
                if (data) {
                    //document.getElementById("imageMiniMap").src = "data:image/bmp;base64," + YourByte;
                    //$("#emimage").attr("src", "http://localhost:4208/api/Employee/" + EmpNo);
                    this.miniMap.setAttribute("src", "data:image/bmp;base64," + data);
                }
            };
            return TileImage;
        })();
        Tiles.TileImage = TileImage;
    })(Terrain.Tiles || (Terrain.Tiles = {}));
    var Tiles = Terrain.Tiles;
})(Terrain || (Terrain = {}));
