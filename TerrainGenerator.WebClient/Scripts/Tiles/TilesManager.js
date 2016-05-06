var Terrain;
(function (Terrain) {
    var Tiles;
    (function (Tiles) {
        var TilesManager = (function () {
            function TilesManager(scene, sun, material, tileSize, gridSize, tilesMatrixSideSize, centerNorthLalitude, centerWestLongitude, maxMinHeight, miniMap) {
                TilesManager.scene = scene;
                this.sun = sun;
                this.material = material;
                this.tileSize = tileSize;
                this.tileSizeDecimalPrecision = (tileSize % 1).toString().length - 2;
                this.gridSize = gridSize;
                this.amplitud = gridSize * tilesMatrixSideSize;
                this.initialCenterNorthLalitude = centerNorthLalitude;
                this.initialCenterWestLongitude = centerWestLongitude;
                this.tileMatrixSideSize = tilesMatrixSideSize;
                this.maxMinHeight = maxMinHeight;
                this.loadedTilesArray = new Array();
                this.visibleTilesArray = new Array();
                Terrain.Tiles.Tile.HalfGridSize = this.gridSize / 2;
                // Initialize image on minimap with first tile
                this.tileImage = new Tiles.TileImage(this.tileSize, this.gridSize, miniMap);
                Tiles.CoordinateSystemHelps.SetOrigin(this.initialCenterNorthLalitude, this.initialCenterWestLongitude, this.tileSize, this.gridSize);
            }
            TilesManager.InitializeInstance = function (scene, sun, material, tileSize, gridSize, tilesMatrixSideSize, centerNorthLalitude, centerWestLongitude, maxMinHeight, miniMap) {
                if (TilesManager.instance == null) {
                    TilesManager.instance = new TilesManager(scene, sun, material, tileSize, gridSize, tilesMatrixSideSize, centerNorthLalitude, centerWestLongitude, maxMinHeight, miniMap);
                }
                return TilesManager.instance;
            };
            TilesManager.GetInstance = function () {
                return TilesManager.instance;
            };
            TilesManager.prototype.LoadNeededData = function (currentPosition) {
                if (!TilesManager.isLoading) {
                    var centerTiletem = this.GetCenterTileItem();
                    var currentCenterTiletem = this.GetTileItemByPosition(currentPosition);
                    if (!centerTiletem || !currentCenterTiletem) {
                        this.LoadData(this.initialCenterNorthLalitude, this.initialCenterWestLongitude);
                    }
                    else if (!TilesManager.isLoading && !currentCenterTiletem.IsEqualTo(centerTiletem)) {
                        TilesManager.SetLoading(true, currentCenterTiletem);
                        this.LoadData(currentCenterTiletem.GetNorthLatitude(), currentCenterTiletem.GetWestLongitude());
                        return currentCenterTiletem.GetPosition();
                    }
                }
                return null;
            };
            TilesManager.prototype.LoadData = function (centerNorthLalitude, centerWestLongitude) {
                console.log("New center tile item: North: " + centerNorthLalitude + " - West: " + centerWestLongitude);
                Terrain.HttpClients.AccountHttpClient.GetInstance().UpdateLocation({ NorthLalitude: centerNorthLalitude, WestLongitude: centerWestLongitude }, null);
                this.PopulateVisisbleTilesArray(centerNorthLalitude, centerWestLongitude);
                this.LoadVisibleTilesArrayAsync();
                this.tileImage.LoadTileImage(centerNorthLalitude, centerWestLongitude);
            };
            TilesManager.prototype.IsLoading = function () {
                return TilesManager.isLoading;
            };
            TilesManager.SetLoading = function (isLoading, tile) {
                if (isLoading) {
                    if (tile != null) {
                        TilesManager.CreateInvisibleBorders(tile);
                    }
                }
                else {
                    TilesManager.RemoveInvisibleBorders();
                }
                TilesManager.isLoading = isLoading;
            };
            TilesManager.prototype.GetPositonAltitude = function (position) {
                var tileItem = this.GetTileItemByPosition(position);
                var altitude = tileItem != null ? tileItem.GetPositonHeight(position) : 0;
                return altitude;
            };
            TilesManager.prototype.GetModel = function (pickedInfo) {
                if (!pickedInfo.hit) {
                    return null;
                }
                var tileItem = this.GetCenterTileItem();
                if (!tileItem.IsSameMesh(pickedInfo.pickedMesh)) {
                    return null;
                }
                var model = this.GetCenterTileItem().GetModelByPosition(Terrain.Utilities.GetNearestPositionedModelNames(pickedInfo.pickedPoint));
                if (model == null) {
                    return null;
                }
                return model;
            };
            TilesManager.prototype.GetCenterTilePosition = function () {
                var centerTileItem = this.GetCenterTileItem();
                return centerTileItem ? centerTileItem.GetPosition() : null;
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
                return this.GetTileFromTileListByName(name, this.loadedTilesArray);
            };
            TilesManager.prototype.OntileLoaded = function (tileData) {
                if (tileData) {
                    var tilesManager = TilesManager.GetInstance();
                    var name = tilesManager.GetTileName(tileData.tilePosition.NorthLalitude, tileData.tilePosition.WestLongitude);
                    var tile = tilesManager.GetTileByName(name);
                    tile.TileLoaded(tileData.data);
                }
            };
            TilesManager.prototype.UpdateCell = function (cell) {
                var tile = this.GetTileFromCell(cell);
                if (tile != null) {
                    tile.UpdateCell(cell);
                }
            };
            TilesManager.prototype.RequestPositionedModelCreationFromPosition = function (position, mapElementType) {
                var tile = this.GetTileItemByPosition(new BABYLON.Vector2(position.x, position.z));
                if (tile != null) {
                    return tile.RequestPositionedModelCreation(position, mapElementType);
                }
            };
            TilesManager.prototype.GetTileFromCell = function (cell) {
                var result = this.loadedTilesArray.filter(function (tile) { return tile.GetNorthLatitude() == cell.North && tile.GetWestLongitude() == cell.West; });
                if (result.length == 0) {
                    return null;
                }
                return result[0];
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
                        var tileItem = this.GetTileFromTileListByName(name, this.loadedTilesArray);
                        if (tileItem == null) {
                            var mesh = this.CreateGroundMeshByName(name);
                            tileItem = new Tiles.Tile(latitude, longitude, name, this.tileSize, this.gridSize, this.maxMinHeight, mesh);
                            this.loadedTilesArray.push(tileItem);
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
                    TilesManager.SetLoading(false, null);
                });
                tilesArrayToLoad.filter(function (tile) { return toLoad.indexOf(tilesArrayToLoad.indexOf(tile)) != -1; }).forEach(function (tile) {
                    tile.LoadTile(TilesManager.countDownEventLoader);
                });
            };
            TilesManager.prototype.CreateGroundMeshByName = function (name) {
                var _this = this;
                var mesh = new BABYLON.GroundMesh(name, TilesManager.scene);
                mesh.checkCollisions = true;
                mesh.material = this.material;
                mesh.isPickable = true;
                //mesh.useOctreeForCollisions = true;
                //mesh.useOctreeForRenderingSelection = true;
                //mesh.renderingGroupId = 1;
                //if ((<any>this.material).AddToRenderList) {
                //    (<any>this.material).AddToRenderList(mesh);
                //}
                mesh._setReady(false);
                mesh.onReady = function () { mesh.optimize(_this.gridSize); };
                return mesh;
            };
            TilesManager.CreateInvisibleBorders = function (centertile) {
                TilesManager.borders = new Array();
                var size = (centertile.GetMaxX() - centertile.GetMinX()) * 2;
                var border = BABYLON.Mesh.CreateBox("border0", 1, this.scene);
                border.scaling = new BABYLON.Vector3(1, size, size);
                border.position.x = centertile.GetMinX() - 1;
                border.position.z = centertile.GetMaxZ();
                border.checkCollisions = true;
                border.isVisible = false;
                TilesManager.borders.push(border);
                border = BABYLON.Mesh.CreateBox("border1", 1, this.scene);
                border.scaling = new BABYLON.Vector3(1, size, size);
                border.position.x = centertile.GetMaxX() + 1;
                border.position.z = centertile.GetMinZ();
                border.checkCollisions = true;
                border.isVisible = false;
                TilesManager.borders.push(border);
                border = BABYLON.Mesh.CreateBox("border2", 1, this.scene);
                border.scaling = new BABYLON.Vector3(size, size, 1);
                border.position.x = centertile.GetMinX();
                border.position.z = centertile.GetMaxZ() + 1;
                border.checkCollisions = true;
                border.isVisible = false;
                TilesManager.borders.push(border);
                border = BABYLON.Mesh.CreateBox("border3", 1, this.scene);
                border.scaling = new BABYLON.Vector3(size, size, 1);
                border.position.x = centertile.GetMaxX();
                border.position.z = centertile.GetMinZ() - 1;
                border.checkCollisions = true;
                border.isVisible = false;
                TilesManager.borders.push(border);
            };
            TilesManager.RemoveInvisibleBorders = function () {
                if (TilesManager.borders) {
                    TilesManager.borders.forEach(function (border) { return border.dispose(); });
                }
            };
            TilesManager.isLoading = false;
            return TilesManager;
        })();
        Tiles.TilesManager = TilesManager;
    })(Tiles = Terrain.Tiles || (Terrain.Tiles = {}));
})(Terrain || (Terrain = {}));
//# sourceMappingURL=TilesManager.js.map