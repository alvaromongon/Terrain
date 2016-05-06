var Terrain;
(function (Terrain) {
    var Tiles;
    (function (Tiles) {
        var Tile = (function () {
            function Tile(north, west, name, tileSize, gridSize, mesh) {
                this.mesh = mesh;
                this.north = north;
                this.west = west;
                this.tileSize = tileSize;
                this.gridSize = gridSize;
                this.setPositionZNorth(tileSize, gridSize);
                this.setPositionXWest(tileSize, gridSize);
                this.isCenteredTile = false;
                this.vegetation = new Array();
                this.animals = new Array();
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
            Tile.prototype.Show = function () {
                for (var i = 0; i < this.vegetation.length; i++) {
                    this.vegetation[i].Show();
                }
                for (var i = 0; i < this.animals.length; i++) {
                    this.animals[i].Show();
                }
                this.mesh.isVisible = true;
            };
            Tile.prototype.Hide = function () {
                for (var i = 0; i < this.vegetation.length; i++) {
                    this.vegetation[i].Hide();
                }
                for (var i = 0; i < this.animals.length; i++) {
                    this.animals[i].Hide();
                }
                this.mesh.isVisible = false;
            };
            Tile.prototype.GetIsCenteredTile = function () {
                return this.isCenteredTile;
            };
            Tile.prototype.SetIsCenteredTile = function (value) {
                this.isCenteredTile = value;
            };
            Tile.prototype.SetSurroundedTiles = function (surroundedTiles) {
                this.surroundedTiles = surroundedTiles;
            };
            Tile.prototype.GetCellGrid = function () {
                return this.cellGrid;
            };
            Tile.LoadCenteredTile = function (tile) {
                tile.LoadTile(null);
            };
            Tile.prototype.LoadTile = function (countDownEvent) {
                this.countDownEvent = countDownEvent;
                if (this.cellGrid) {
                    if (this.countDownEvent != null) {
                        this.countDownEvent.Signal();
                    }
                }
                else {
                    console.log("Requesting a new tile: North: " + this.north + " - West: " + this.west + " - GridSize : " + this.gridSize + " - TileSize : " + this.tileSize);
                    var tilesHttpClient = Terrain.HttpClients.TilesHttpClient.GetInstance();
                    tilesHttpClient.GetTileData({ NorthLalitude: this.north, WestLongitude: this.west }, Tiles.TilesManager.GetExistingInstance().OntileLoaded);
                }
            };
            Tile.prototype.IsEqualTo = function (other) {
                return (this.north == other.north && this.west == other.west);
            };
            Tile.prototype.IsPositionIntoTile = function (position) {
                return ((position.x > this.mesh.position.x - Tile.HalfGridSize && position.x < this.mesh.position.x + Tile.HalfGridSize) && (position.z > this.mesh.position.z - Tile.HalfGridSize && position.z < this.mesh.position.z + Tile.HalfGridSize));
            };
            Tile.prototype.GetPositonHeight = function (position) {
                return this.mesh.getHeightAtCoordinates(position.x, position.z);
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
                    this.cellGrid = dataParsed;
                    this.LoadBasicHeightMapFromCellGrid(this.mesh, Terrain.Tiles.TilesManager.maxMinHeight, false);
                }
            };
            Tile.prototype.setPositionXWest = function (tileSize, gridSize) {
                this.mesh.position.x = Tiles.CoordinateSystemHelps.CalculateWestEastOffSet(this.west, tileSize, gridSize);
            };
            Tile.prototype.setPositionZNorth = function (tileSize, gridSize) {
                this.mesh.position.z = Tiles.CoordinateSystemHelps.CalculateNorthSouthOffSet(this.north, tileSize, gridSize);
            };
            Tile.prototype.LoadBasicHeightMapFromCellGrid = function (destinyMesh, maxMinHeight, updatable) {
                var indices = [];
                var positions = [];
                var normals = [];
                var uvs = [];
                var types = [];
                var row, col;
                var sideSize = Math.sqrt(this.cellGrid.length);
                var subdivisions = sideSize;
                var width = subdivisions;
                var height = subdivisions;
                for (row = 0; row <= subdivisions; row++) {
                    for (col = 0; col <= subdivisions; col++) {
                        //First one should be: position.x: -subdivision/2 / position.z: +subdivision/2 / position 0
                        var position = new BABYLON.Vector3((col * width) / subdivisions - (width / 2.0), 0, ((subdivisions - row) * height) / subdivisions - (height / 2.0));
                        var heightMapX = (((position.x + width / 2) / width) * (width - 1)) | 0;
                        var heightMapY = ((1.0 - (position.z + height / 2) / height) * (height - 1)) | 0;
                        var pos = (heightMapX + heightMapY * height);
                        position.y = maxMinHeight * this.cellGrid[pos].a; //altitud
                        positions.push(position.x, position.y, position.z);
                        normals.push(0, 0, 0);
                        uvs.push(col / subdivisions, 1.0 - row / subdivisions);
                        types.push(this.cellGrid[pos].t);
                        this.AddVegetation(destinyMesh.position, position, this.cellGrid[pos].c);
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
            Tile.prototype.AddVegetation = function (meshPosition, position, content) {
                if (content > 0) {
                    var vegetation = Terrain.D3Models.Vegetation3DModelsContainer.GetExistingInstance();
                    if (vegetation != null) {
                        var treePosition = new BABYLON.Vector3(position.x + meshPosition.x, position.y, position.z + meshPosition.z);
                        var rotationAngle = Math.random() * Math.PI * 2;
                        var tree = new Terrain.Environment.Tree();
                        tree.meshes = vegetation.Get3DModelInstance("tree_" + content, treePosition, rotationAngle);
                        if (tree.meshes.length > 0) {
                            this.vegetation.push(tree);
                        }
                    }
                }
            };
            Tile.prototype.AddAnimal = function (meshPosition, position) {
                var animals = Terrain.D3Models.Animal3DModelsContainer.GetExistingInstance();
                if (animals != null) {
                    var animalPosition = new BABYLON.Vector3(position.x + meshPosition.x, position.y, position.z + meshPosition.z);
                    var rotationAngle = Math.random() * Math.PI * 2;
                    var animal = new Terrain.Environment.Animal();
                    animal.meshes = animals.Get3DModelInstance("man", animalPosition, rotationAngle);
                    if (animal.meshes.length > 0) {
                        this.animals.push(animal);
                    }
                }
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
