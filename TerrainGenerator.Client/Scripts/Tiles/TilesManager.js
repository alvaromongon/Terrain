var Terrain;
(function (Terrain) {
    var Tiles;
    (function (Tiles) {
        var TilesManager = (function () {
            function TilesManager(scene, sun, material, tileSize, gridSize, tilesMatrixSideSize, centerNorthLalitude, centerWestLongitude, miniMap) {
                this.scene = scene;
                this.sun = sun;
                this.material = material;
                this.tileSize = tileSize;
                this.tileSizeDecimalPrecision = (tileSize % 1).toString().length - 2;
                this.gridSize = gridSize;
                this.amplitud = gridSize * tilesMatrixSideSize;
                this.initialCenterNorthLalitude = centerNorthLalitude;
                this.initialCenterWestLongitude = centerWestLongitude;
                this.tileMatrixSideSize = tilesMatrixSideSize;
                TilesManager.isLoading = false;
                this.createdTilesArray = new Array();
                this.visibleTilesArray = new Array();
                Terrain.Tiles.Tile.HalfGridSize = this.gridSize / 2;
                // Initialize image on minimap with first tile
                this.tileImage = new Tiles.TileImage(this.tileSize, this.gridSize, miniMap);
                Tiles.CoordinateSystemHelps.SetOrigin(this.initialCenterNorthLalitude, this.initialCenterWestLongitude, this.tileSize, this.gridSize);
            }
            TilesManager.GetInstance = function (scene, sun, material, tileSize, gridSize, tilesMatrixSideSize, centerNorthLalitude, centerWestLongitude, miniMap) {
                if (TilesManager.instance == null) {
                    TilesManager.instance = new TilesManager(scene, sun, material, tileSize, gridSize, tilesMatrixSideSize, centerNorthLalitude, centerWestLongitude, miniMap);
                }
                return TilesManager.instance;
            };
            TilesManager.GetExistingInstance = function () {
                return TilesManager.instance;
            };
            TilesManager.prototype.LoadNeededData = function (currentPosition) {
                if (!TilesManager.isLoading) {
                    var centerTiletem = this.GetCenterTileItem();
                    var currentCenterTiletem = this.GetTileItemByPosition(currentPosition);
                    if (!centerTiletem || !currentCenterTiletem) {
                        console.log("New center tile item: North: " + this.initialCenterNorthLalitude + " - West: " + this.initialCenterWestLongitude);
                        this.PopulateVisisbleTilesArray(this.initialCenterNorthLalitude, this.initialCenterWestLongitude);
                        this.LoadVisibleTilesArrayAsync();
                        this.tileImage.LoadTileImage(this.initialCenterNorthLalitude, this.initialCenterWestLongitude);
                        return true;
                    }
                    else if (!currentCenterTiletem.IsEqualTo(centerTiletem)) {
                        TilesManager.isLoading = true;
                        var centerNorthLalitude = currentCenterTiletem.GetNorthLatitude();
                        var centerWestLongitude = currentCenterTiletem.GetWestLongitude();
                        console.log("New center tile item: North: " + centerNorthLalitude + " - West: " + centerWestLongitude);
                        this.PopulateVisisbleTilesArray(centerNorthLalitude, centerWestLongitude);
                        this.LoadVisibleTilesArrayAsync();
                        this.tileImage.LoadTileImage(centerNorthLalitude, centerWestLongitude);
                        return true;
                    }
                }
                return false;
            };
            TilesManager.prototype.GetPositonAltitude = function (position) {
                var tileItem = this.GetTileItemByPosition(position);
                return tileItem != null ? tileItem.GetPositonHeight(position) : 0;
            };
            TilesManager.prototype.GetCenterTilePosition = function () {
                return this.GetCenterTileItem().GetPosition();
            };
            TilesManager.prototype.GetAmplitud = function () {
                return this.amplitud;
            };
            TilesManager.prototype.GetSideSize = function () {
                return this.tileMatrixSideSize;
            };
            TilesManager.prototype.GetTileName = function (latitude, longitude) {
                return 'TileMesh_' + latitude + '-' + longitude;
            };
            TilesManager.prototype.GetTileByName = function (name) {
                return this.GetTileFromTileListByName(name, this.createdTilesArray);
            };
            TilesManager.prototype.OntileLoaded = function (tileData) {
                if (tileData) {
                    var tilesManager = TilesManager.GetExistingInstance();
                    var name = tilesManager.GetTileName(tileData.tilePosition.NorthLalitude, tileData.tilePosition.WestLongitude);
                    var tile = tilesManager.GetTileByName(name);
                    tile.TileLoaded(tileData.data);
                }
            };
            TilesManager.prototype.GetCenterTileItem = function () {
                var index = (((this.tileMatrixSideSize * this.tileMatrixSideSize) / 2) | 0);
                return this.visibleTilesArray.length > index ? this.visibleTilesArray[index] : null;
            };
            TilesManager.prototype.GetTileItemByPosition = function (position) {
                for (var i = 0, tot = this.visibleTilesArray.length; i < tot; i++) {
                    if (this.visibleTilesArray[i].IsPositionIntoTile(position)) {
                        return this.visibleTilesArray[i];
                    }
                }
                return null;
            };
            TilesManager.prototype.GetTileFromTileListByName = function (name, tileList) {
                var result = tileList.filter(function (tile) { return tile.GetName() == name; });
                if (result.length > 0) {
                    return result[0];
                }
                else {
                    return null;
                }
            };
            TilesManager.prototype.PopulateVisisbleTilesArray = function (northLalitude, westLongitude) {
                var _this = this;
                var base = (this.tileMatrixSideSize / 2) | 0;
                var previousVisibleTilesArray = this.visibleTilesArray.slice();
                this.visibleTilesArray.length = 0;
                for (var i = 0; i < this.tileMatrixSideSize; i++) {
                    for (var j = 0; j < this.tileMatrixSideSize; j++) {
                        var latitude = Tiles.CoordinateSystemHelps.CheckLalitude(northLalitude + (this.tileSize * (base - i)), this.tileSizeDecimalPrecision);
                        var longitude = Tiles.CoordinateSystemHelps.CheckLongitude(westLongitude + (this.tileSize * (j - base)), this.tileSizeDecimalPrecision);
                        var name = this.GetTileName(latitude, longitude);
                        var tileItem = this.GetTileFromTileListByName(name, this.createdTilesArray);
                        if (tileItem == null) {
                            var mesh = this.CreateGroundMeshByName(name);
                            tileItem = new Tiles.Tile(latitude, longitude, name, this.tileSize, this.gridSize, mesh);
                            this.createdTilesArray.push(tileItem);
                        }
                        tileItem.Show();
                        this.visibleTilesArray.push(tileItem);
                        if (latitude == northLalitude && longitude == westLongitude) {
                            tileItem.SetIsCenteredTile(true);
                        }
                        else {
                            tileItem.SetIsCenteredTile(false);
                        }
                    }
                }
                //Hide not visible any more tiles
                var notVisibleAnyMoreTilesArray = previousVisibleTilesArray.filter(function (tile) { return _this.GetTileFromTileListByName(tile.GetName(), _this.visibleTilesArray) == null; });
                notVisibleAnyMoreTilesArray.forEach(function (tile) { return tile.Hide(); });
                previousVisibleTilesArray = null;
                notVisibleAnyMoreTilesArray = null;
            };
            TilesManager.prototype.LoadVisibleTilesArrayAsync = function () {
                var _this = this;
                this.visibleTilesArray.forEach(function (tile) { return tile.SetSurroundedTiles(_this.visibleTilesArray); });
                var toLoad = [0, 2, 6, 8];
                TilesManager.countDownEventLoader = new Terrain.Utilities.CountDownEvent(4, this.visibleTilesArray, this.LoadVisibleTilesArraySecondStepAsync);
                this.visibleTilesArray.filter(function (tile) { return toLoad.indexOf(_this.visibleTilesArray.indexOf(tile)) != -1; }).forEach(function (tile) {
                    tile.LoadTile(TilesManager.countDownEventLoader);
                });
            };
            TilesManager.prototype.LoadVisibleTilesArraySecondStepAsync = function (tilesArrayToLoad) {
                var toLoad = [1, 3, 5, 7];
                var centeredTile = tilesArrayToLoad.filter(function (tile) { return tile.GetIsCenteredTile(); })[0];
                TilesManager.countDownEventLoader = new Terrain.Utilities.CountDownEvent(4, centeredTile, function (data) {
                    Tiles.Tile.LoadCenteredTile(data);
                    TilesManager.isLoading = false;
                });
                tilesArrayToLoad.filter(function (tile) { return toLoad.indexOf(tilesArrayToLoad.indexOf(tile)) != -1; }).forEach(function (tile) {
                    tile.LoadTile(TilesManager.countDownEventLoader);
                });
            };
            TilesManager.prototype.CreateGroundMeshByName = function (name) {
                var mesh = new BABYLON.GroundMesh(name, this.scene);
                //mesh._subdivisions = this._subdivisions;
                mesh.checkCollisions = true;
                mesh.showBoundingBox = true;
                mesh.material = this.material;
                //mesh.useOctreeForCollisions = true;
                //mesh.useOctreeForRenderingSelection = true;
                //if ((<any>this.material).AddToRenderList) {
                //    (<any>this.material).AddToRenderList(mesh);
                //}
                return mesh;
            };
            TilesManager.maxMinHeight = 50;
            return TilesManager;
        })();
        Tiles.TilesManager = TilesManager;
    })(Tiles = Terrain.Tiles || (Terrain.Tiles = {}));
})(Terrain || (Terrain = {}));
