var Terrain;
(function (Terrain) {
    var Tiles;
    (function (Tiles) {
        var Tile = (function () {
            function Tile(north, west, name, tileSize, gridSize, maxMinHeight, mesh) {
                this.mesh = mesh;
                this.north = north;
                this.west = west;
                this.tileSize = tileSize;
                this.gridSize = gridSize;
                this.maxMinHeight = maxMinHeight;
                this.setPositionZNorth(tileSize, gridSize);
                this.setPositionXWest(tileSize, gridSize);
                this.isCenteredTile = false;
                this.maxX = this.mesh.position.x + Tile.HalfGridSize;
                this.minX = this.mesh.position.x - Tile.HalfGridSize;
                this.maxZ = this.mesh.position.z + Tile.HalfGridSize;
                this.minZ = this.mesh.position.z - Tile.HalfGridSize;
                this.models = new Terrain.Utilities.Dictionary();
                this.requestedModels = new Terrain.Utilities.Dictionary();
                if (name) {
                    this.name = name;
                }
            }
            Tile.prototype.GetNorthLatitude = function () {
                return this.north;
            };
            Tile.prototype.GetWestLongitude = function () {
                return this.west;
            };
            Tile.prototype.GetName = function () {
                return this.name;
            };
            Tile.prototype.GetPosition = function () {
                return this.mesh.position;
            };
            Tile.prototype.GetMaxZ = function () {
                return this.maxZ;
            };
            Tile.prototype.GetMinZ = function () {
                return this.minZ;
            };
            Tile.prototype.GetMaxX = function () {
                return this.maxX;
            };
            Tile.prototype.GetMinX = function () {
                return this.minX;
            };
            Tile.prototype.IsSameMesh = function (otherMesh) {
                return this.mesh == otherMesh;
            };
            Tile.prototype.Show = function () {
                for (var i = 0; i < this.models.length(); i++) {
                    this.models.getByIndex(i).Show();
                }
                this.mesh.isVisible = true;
            };
            Tile.prototype.Hide = function () {
                for (var i = 0; i < this.models.length(); i++) {
                    this.models.getByIndex(i).Hide();
                }
                this.mesh.isVisible = false;
            };
            Tile.prototype.GetIsCenteredTile = function () {
                return this.isCenteredTile;
            };
            Tile.prototype.SetIsCenteredTile = function (value) {
                this.isCenteredTile = value;
                this.mesh.isPickable = this.isCenteredTile;
            };
            Tile.prototype.SetSurroundedTiles = function (surroundedTiles) {
                this.surroundedTiles = surroundedTiles;
            };
            Tile.LoadCenteredTile = function (tile) {
                tile.LoadTile(null);
            };
            Tile.prototype.LoadTile = function (countDownEvent) {
                this.countDownEvent = countDownEvent;
                if (this.mesh.isReady()) {
                    if (this.countDownEvent != null) {
                        this.countDownEvent.Signal();
                    }
                }
                else {
                    console.log("Requesting a new tile: North: " + this.north + " - West: " + this.west + " - GridSize : " + this.gridSize + " - TileSize : " + this.tileSize);
                    var systemHttpClient = Terrain.HttpClients.SystemHttpClient.GetInstance();
                    systemHttpClient.GetTileData({ NorthLalitude: this.north, WestLongitude: this.west }, Tiles.TilesManager.GetInstance().OntileLoaded);
                }
            };
            Tile.prototype.IsEqualTo = function (other) {
                return (this.north == other.north && this.west == other.west);
            };
            Tile.prototype.IsPositionIntoTile = function (position) {
                return ((position.x > this.minX && position.x < this.maxX)
                    && (position.y > this.minZ && position.y < this.maxZ));
            };
            Tile.prototype.GetPositonHeight = function (position) {
                return this.mesh.getHeightAtCoordinates(position.x, position.y);
            };
            Tile.prototype.TileLoaded = function (data) {
                if (data) {
                    var dataParsed = null;
                    if (Object.prototype.toString.call(data) === '[object Array]') {
                        dataParsed = data;
                    }
                    else {
                        dataParsed = jQuery.parseJSON(data);
                    }
                    this.mesh._setReady(false);
                    this.LoadBasicHeightMapFromCellGrid(this.mesh, dataParsed, this.maxMinHeight, false);
                }
            };
            Tile.prototype.GetModelByPosition = function (names) {
                for (var i = 0; i < names.length; i++) {
                    var result = this.GetModelExact(names[i]);
                    if (result) {
                        return result;
                    }
                }
                return null;
            };
            Tile.prototype.RequestPositionedModelCreation = function (position, finishMapElementType) {
                var index = this.CalculateIndex(position);
                //console.log("RequestPositionedModelCreation, Position: X : " + position.x + " - Y : " + position.y + " - Z : " + position.z);
                if (this.requestedModels.getByKey(index.toString())) {
                    console.log("RequestPositionedModelCreation, requested the creation of a model on a position that has been already requested: X: " + position.x + " Z: " + position.z);
                    return false;
                }
                if (!this.CanPositionedModelOn(position, index, finishMapElementType)) {
                    console.log("RequestPositionedModelCreation, requested the creation of a model on a position that is not feasible for this type of resource: X: " + position.x + " Z: " + position.z + " map element: " + finishMapElementType.toString());
                    return false;
                }
                var result = Terrain.Models.PositionedElementedResourcedInstanceModel.RequestCreation(this.north, this.west, index, finishMapElementType);
                if (result) {
                    this.requestedModels.add(index.toString(), position);
                }
                return result;
            };
            Tile.prototype.UpdateCell = function (cell) {
                var model = this.GetModelByIndex(cell.Index);
                if (model == null && cell.FinishMapElementType == Terrain.MapElement.MapElementType.empty) {
                    console.log("UpdateCell, requested to remove a model but there is no model to be removed, map elment type: " + cell.InitialMapElementType.toString());
                }
                if (model != null && cell.FinishMapElementType != model.GetMapElementType()) {
                    this.RemoveModelByIndex(cell.Index);
                }
                this.AddRequestedModel(cell.Index, cell.FinishMapElementType);
            };
            Tile.prototype.AddRequestedModel = function (index, mapElementType) {
                if (mapElementType != Terrain.MapElement.MapElementType.empty) {
                    var position = this.requestedModels.getByKey(index.toString());
                    if (!position) {
                        console.log("AddRequestedModel, index not found: " + index);
                        return;
                    }
                    this.requestedModels.remove(index.toString());
                    this.AddModel(index, position, mapElementType, true);
                }
            };
            Tile.prototype.RemoveModelByIndex = function (index) {
                var result = this.GetModelByIndex(index);
                if (result != null) {
                    result.LaunchParticles();
                    setTimeout(function () { result.Dispose(); }, 1000);
                    this.models.remove(name);
                }
            };
            Tile.prototype.GetModelExact = function (name) {
                return this.models.getByKey(name);
            };
            Tile.prototype.GetModelByIndex = function (index) {
                var result = this.models.getValues().filter(function (positionedModel) { return positionedModel.GetIndex() == index; });
                if (result.length > 0) {
                    return result[0];
                }
            };
            Tile.prototype.setPositionXWest = function (tileSize, gridSize) {
                this.mesh.position.x = Tiles.CoordinateSystemHelps.CalculateWestEastOffSet(this.west, tileSize, gridSize);
            };
            Tile.prototype.setPositionZNorth = function (tileSize, gridSize) {
                this.mesh.position.z = Tiles.CoordinateSystemHelps.CalculateNorthSouthOffSet(this.north, tileSize, gridSize);
            };
            Tile.prototype.LoadBasicHeightMapFromCellGrid = function (destinyMesh, cellGrid, maxMinHeight, updatable) {
                var indices = [];
                var positions = [];
                var normals = [];
                var uvs = [];
                var types = [];
                var row, col;
                this.sideSize = Math.sqrt(cellGrid.length);
                var subdivisions = this.sideSize;
                var width = subdivisions;
                var height = subdivisions;
                //La primera fila duplica la segunda y el primero elementos de las filas sucesivas duplica el segundo elemento
                for (row = 0; row <= subdivisions; row++) {
                    for (col = 0; col <= subdivisions; col++) {
                        //First one should be: position.x: -subdivision/2 / position.z: +subdivision/2 / position 0
                        var position = new BABYLON.Vector3((col * width) / subdivisions - (width / 2.0), 0, ((subdivisions - row) * height) / subdivisions - (height / 2.0));
                        var pos = this.CalculateIndex(position, width, height);
                        position.y = maxMinHeight * cellGrid[pos].a; //altitud
                        positions.push(position.x, position.y, position.z);
                        normals.push(0, 0, 0);
                        uvs.push(col / subdivisions, 1.0 - row / subdivisions);
                        types.push(cellGrid[pos].t);
                        this.AddModel(pos, new BABYLON.Vector3(position.x + destinyMesh.position.x, position.y, position.z + destinyMesh.position.z), cellGrid[pos].c);
                    }
                }
                for (row = 0; row < subdivisions; row++) {
                    for (col = 0; col < subdivisions; col++) {
                        indices.push(col + 1 + (row + 1) * (subdivisions + 1));
                        indices.push(col + 1 + row * (subdivisions + 1));
                        indices.push(col + row * (subdivisions + 1));
                        indices.push(col + (row + 1) * (subdivisions + 1));
                        indices.push(col + 1 + (row + 1) * (subdivisions + 1));
                        indices.push(col + row * (subdivisions + 1));
                    }
                }
                BABYLON.VertexData.ComputeNormals(positions, indices, normals);
                var vertexData = new BABYLON.VertexData();
                vertexData.indices = indices;
                vertexData.positions = positions;
                vertexData.normals = normals;
                vertexData.uvs = uvs;
                vertexData.applyToMesh(destinyMesh, updatable);
                destinyMesh.setVerticesData("type", types, updatable, 1); //Set the type of the vertice    
                destinyMesh.computeWorldMatrix(true);
                console.log('Loaded Tile North: ' + this.north + ' - West : ' + this.west + ' located in (center point)  X: ' + destinyMesh.position.x + ' - Z: ' + destinyMesh.position.z);
                destinyMesh._setReady(true);
                if (this.countDownEvent != null) {
                    this.countDownEvent.Signal();
                }
            };
            Tile.prototype.AddModel = function (index, position, mapElementType, launchParticles) {
                if (launchParticles === void 0) { launchParticles = false; }
                if (mapElementType != Terrain.MapElement.MapElementType.empty) {
                    var positionedModel = Terrain.Models.MasterModelsContainer.GetInstance().GetPositionedElementedResourcedInstanceModel(this.north, this.west, index, position, mapElementType);
                    if (positionedModel != null) {
                        this.models.add(positionedModel.GetName(), positionedModel);
                        if (launchParticles) {
                            positionedModel.LaunchParticles();
                        }
                    }
                    else {
                        console.log("AddModel, Error creation positioned model with map element type " + mapElementType);
                    }
                }
            };
            Tile.prototype.CalculateIndex = function (position, width, height) {
                if (width === void 0) { width = -1; }
                if (height === void 0) { height = -1; }
                width = width < 0 ? this.sideSize : width;
                height = height < 0 ? this.sideSize : height;
                var heightMapX = (((position.x + width / 2) / width) * (width - 1)) | 0;
                var heightMapY = ((1.0 - (position.z + height / 2) / height) * (height - 1)) | 0;
                return (heightMapX + heightMapY * height);
            };
            Tile.prototype.CanPositionedModelOn = function (position, index, mapElementType) {
                // TODO: implement this!            
                // If already in used NO            
                // Basic rules. more to be enforced in server side???????
                // If under water NO
                if (this.GetPositonHeight(new BABYLON.Vector2(position.x, position.z)) < 0) {
                    return false;
                }
                var cellType = this.mesh.getVerticesData("type", false)[index];
                console.log("cell type from vertices data: " + cellType);
                // If sloopy terain NO
                if (cellType % 10 == 1.0) {
                    return false;
                }
                return true;
            };
            //TODO: move to better location
            Tile.prototype.RandonIntegerNumber = function (min, max) {
                if (min === max) {
                    return (min);
                }
                var random = Math.random();
                return Math.round((random * (max - min)) + min);
            };
            return Tile;
        })();
        Tiles.Tile = Tile;
    })(Tiles = Terrain.Tiles || (Terrain.Tiles = {}));
})(Terrain || (Terrain = {}));
//# sourceMappingURL=Tile.js.map