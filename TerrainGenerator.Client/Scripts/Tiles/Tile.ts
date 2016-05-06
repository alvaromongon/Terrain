module Terrain.Tiles {

    export class Tile {

        public static HalfGridSize: number;

        private north: number;
        private west: number;
        private name: string;     
        private tileSize: number;
        private gridSize: number;   

        private isCenteredTile: boolean;

        private countDownEvent: Terrain.Utilities.CountDownEvent;

        private surroundedTiles: Array<Terrain.Tiles.Tile>;
        public vegetation: Array<Terrain.Environment.Tree>;
        public animals: Array<Terrain.Environment.Animal>;
        
        private mesh: BABYLON.GroundMesh;
        private cellGrid: Array<Terrain.Tiles.ITileCell>;

        public GetNorthLatitude(): number {
            return this.north;
        }

        public GetWestLongitude(): number {
            return this.west;
        }

        public GetName(): string {
            return this.name;
        }

        public GetPosition(): BABYLON.Vector3 {
            return this.mesh.position;
        }
        
        public Show(): void {
            for (var i = 0; i < this.vegetation.length; i++) {
                this.vegetation[i].Show();
            }
            for (var i = 0; i < this.animals.length; i++) {
                this.animals[i].Show();
            }
            this.mesh.isVisible = true;
        }

        public Hide(): void {
            for (var i = 0; i < this.vegetation.length; i++) {
                this.vegetation[i].Hide();
            }
            for (var i = 0; i < this.animals.length; i++) {
                this.animals[i].Hide();
            }
            this.mesh.isVisible = false;
        }   

        public GetIsCenteredTile(): boolean {
            return this.isCenteredTile;
        }

        public SetIsCenteredTile(value: boolean): void {
            this.isCenteredTile = value;
        }

        public SetSurroundedTiles(surroundedTiles: Array<Terrain.Tiles.Tile>): void {
            this.surroundedTiles = surroundedTiles;
        }

        public GetCellGrid(): Array<Terrain.Tiles.ITileCell> {
            return this.cellGrid;
        }

        constructor(north: number, west: number, name: string, tileSize: number, gridSize: number, mesh: BABYLON.GroundMesh) {
            this.mesh = mesh;

            this.north = north;
            this.west = west;
            this.tileSize = tileSize;
            this.gridSize = gridSize;
            this.setPositionZNorth(tileSize, gridSize);
            this.setPositionXWest(tileSize, gridSize);
            this.isCenteredTile = false;

            this.vegetation = new Array<Terrain.Environment.Tree>();
            this.animals = new Array<Terrain.Environment.Animal>();

            if (name) {
                this.name = name;
            }                                    
        }

        public static LoadCenteredTile(tile: Tile): void {
            tile.LoadTile(null);
        }

        public LoadTile(countDownEvent: Terrain.Utilities.CountDownEvent): void {

            this.countDownEvent = countDownEvent;

            if (this.cellGrid) {
                if (this.countDownEvent != null) {
                    this.countDownEvent.Signal();
                }
            } else {
                console.log("Requesting a new tile: North: " + this.north + " - West: " + this.west + " - GridSize : " + this.gridSize + " - TileSize : " + this.tileSize);

                var tilesHttpClient = Terrain.HttpClients.TilesHttpClient.GetInstance();
                tilesHttpClient.GetTileData({ NorthLalitude: this.north, WestLongitude: this.west }, TilesManager.GetExistingInstance().OntileLoaded);
            }
        }

        public IsEqualTo(other: Tile): boolean {
            return (this.north == other.north && this.west == other.west);
        }        

        public IsPositionIntoTile(position: BABYLON.Vector3): boolean {
            return ((position.x > this.mesh.position.x - Tile.HalfGridSize && position.x < this.mesh.position.x + Tile.HalfGridSize)
                && (position.z > this.mesh.position.z - Tile.HalfGridSize && position.z < this.mesh.position.z + Tile.HalfGridSize))
        }

        public GetPositonHeight(position: BABYLON.Vector3): number {
            return this.mesh.getHeightAtCoordinates(position.x, position.z);
        }

        public TileLoaded(data: any): void {
            if (data) {

                var dataParsed = null;
                if (Object.prototype.toString.call(data) === '[object Array]') {
                    dataParsed = data;
                } else {
                    dataParsed = <Array<ITileCell>>jQuery.parseJSON(data);
                }

                this.mesh._setReady(false);

                this.cellGrid = dataParsed;

                this.LoadBasicHeightMapFromCellGrid(this.mesh, Terrain.Tiles.TilesManager.maxMinHeight, false);
            }
        }

        private setPositionXWest(tileSize: number, gridSize: number): void {
            this.mesh.position.x = CoordinateSystemHelps.CalculateWestEastOffSet(this.west, tileSize, gridSize);
        }

        private setPositionZNorth(tileSize: number, gridSize: number): void {
            this.mesh.position.z = CoordinateSystemHelps.CalculateNorthSouthOffSet(this.north, tileSize, gridSize);
        }
        
        private LoadBasicHeightMapFromCellGrid(destinyMesh: BABYLON.GroundMesh, maxMinHeight: number, updatable: boolean): void {
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

            //La primera fila duplica la segunda y el primero elementos de las filas sucesivas duplica el segundo elemento
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
        }        

        private AddVegetation(meshPosition: BABYLON.Vector3, position: BABYLON.Vector3, content: number): void {

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
        }

        private AddAnimal(meshPosition: BABYLON.Vector3, position: BABYLON.Vector3): void {

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
        }

        //TODO: move to better location
        private RandonIntegerNumber(min: number, max: number): number {
            if (min === max) {
                return (min);
            }

            var random = Math.random();

            return Math.round((random * (max - min)) + min);
        }
    }
}  
