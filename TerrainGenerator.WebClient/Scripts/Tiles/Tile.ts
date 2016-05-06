module Terrain.Tiles {

    export class Tile {

        public static HalfGridSize: number;

        private north: number;
        private west: number;
        private name: string;     
        private tileSize: number;
        private gridSize: number;   
        private sideSize: number;
        private maxMinHeight: number;

        private maxX: number;
        private minX: number;
        private maxZ: number;
        private minZ: number;

        private isCenteredTile: boolean;

        private countDownEvent: Terrain.Utilities.CountDownEvent;

        private surroundedTiles: Array<Terrain.Tiles.Tile>;
        public models: Terrain.Utilities.Dictionary<Terrain.Models.PositionedElementedResourcedInstanceModel>;
        private requestedModels: Utilities.Dictionary<BABYLON.Vector3>;
        
        private mesh: BABYLON.GroundMesh;

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

        public GetMaxZ(): number {
            return this.maxZ;
        }

        public GetMinZ(): number {
            return this.minZ;
        }

        public GetMaxX(): number {
            return this.maxX;
        }

        public GetMinX(): number {
            return this.minX;
        }

        public IsSameMesh(otherMesh: BABYLON.AbstractMesh): boolean {
            return this.mesh == otherMesh;
        }              

        public Show(): void {
            for (var i = 0; i < this.models.length(); i++) {
                this.models.getByIndex(i).Show();
            }
            this.mesh.isVisible = true;
        }

        public Hide(): void {
            for (var i = 0; i < this.models.length(); i++) {
                this.models.getByIndex(i).Hide();
            }
            this.mesh.isVisible = false;
        }   

        public GetIsCenteredTile(): boolean {
            return this.isCenteredTile;
        }

        public SetIsCenteredTile(value: boolean): void {
            this.isCenteredTile = value;

            this.mesh.isPickable = this.isCenteredTile;
        }

        public SetSurroundedTiles(surroundedTiles: Array<Terrain.Tiles.Tile>): void {
            this.surroundedTiles = surroundedTiles;
        }

        constructor(north: number, west: number, name: string, tileSize: number, gridSize: number, maxMinHeight: number, mesh: BABYLON.GroundMesh) {
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

            this.models = new Terrain.Utilities.Dictionary<Terrain.Models.PositionedElementedResourcedInstanceModel>();
            this.requestedModels = new Utilities.Dictionary<BABYLON.Vector3>();

            if (name) {
                this.name = name;
            }                                    
        }

        public static LoadCenteredTile(tile: Tile): void {
            tile.LoadTile(null);
        }

        public LoadTile(countDownEvent: Terrain.Utilities.CountDownEvent): void {

            this.countDownEvent = countDownEvent;

            if (this.mesh.isReady()) {
                if (this.countDownEvent != null) {
                    this.countDownEvent.Signal();
                }
            } else {
                console.log("Requesting a new tile: North: " + this.north + " - West: " + this.west + " - GridSize : " + this.gridSize + " - TileSize : " + this.tileSize);

                var systemHttpClient = Terrain.HttpClients.SystemHttpClient.GetInstance();
                systemHttpClient.GetTileData({ NorthLalitude: this.north, WestLongitude: this.west }, TilesManager.GetInstance().OntileLoaded);
            }
        }

        public IsEqualTo(other: Tile): boolean {
            return (this.north == other.north && this.west == other.west);
        }        

        public IsPositionIntoTile(position: BABYLON.Vector2): boolean {
            return ((position.x > this.minX && position.x < this.maxX)
                && (position.y > this.minZ && position.y < this.maxZ));
        }

        public GetPositonHeight(position: BABYLON.Vector2): number {
            return this.mesh.getHeightAtCoordinates(position.x, position.y);
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

                this.LoadBasicHeightMapFromCellGrid(this.mesh, dataParsed, this.maxMinHeight, false);
            }
        }

        public GetModelByPosition(names: Array<string>): Terrain.Models.PositionedElementedResourcedInstanceModel {
            for (var i = 0; i < names.length; i++) {
                var result = this.GetModelExact(names[i]);
                if (result) {
                    return result;
                }
            }
            return null;
        }    

        public RequestPositionedModelCreation(position: BABYLON.Vector3, finishMapElementType: MapElement.MapElementType): boolean {
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

            var result = Models.PositionedElementedResourcedInstanceModel.RequestCreation(this.north, this.west, index, finishMapElementType);

            if (result) {
                this.requestedModels.add(index.toString(), position);
            }

            return result;
        }
        
        public UpdateCell(cell: ICell): void {
            var model = this.GetModelByIndex(cell.Index);

            if (model == null && cell.FinishMapElementType == MapElement.MapElementType.empty) {
                console.log("UpdateCell, requested to remove a model but there is no model to be removed, map elment type: " + cell.InitialMapElementType.toString());
            }

            if (model != null && cell.FinishMapElementType != model.GetMapElementType()) {
                this.RemoveModelByIndex(cell.Index);
            }

            this.AddRequestedModel(cell.Index, cell.FinishMapElementType);
        }                           

        private AddRequestedModel(index: number, mapElementType: number): void {

            if (mapElementType != MapElement.MapElementType.empty) {
                var position = this.requestedModels.getByKey(index.toString());

                if (!position) {
                    console.log("AddRequestedModel, index not found: " + index);
                    return;
                }

                this.requestedModels.remove(index.toString());

                this.AddModel(index, position, mapElementType, true);    
            }                               
        }

        private RemoveModelByIndex(index: number): void {
            var result = this.GetModelByIndex(index);
            if (result != null) {
                result.LaunchParticles();
                setTimeout(() => { result.Dispose(); }, 1000);
                this.models.remove(name);
            }
        } 

        private GetModelExact(name: string): Terrain.Models.PositionedElementedResourcedInstanceModel {
            return this.models.getByKey(name);
        }

        private GetModelByIndex(index: number): Terrain.Models.PositionedElementedResourcedInstanceModel {
            var result = this.models.getValues().filter((positionedModel) => positionedModel.GetIndex() == index);

            if (result.length > 0) {
                return result[0];
            }
        }

        private setPositionXWest(tileSize: number, gridSize: number): void {
            this.mesh.position.x = CoordinateSystemHelps.CalculateWestEastOffSet(this.west, tileSize, gridSize);
        }

        private setPositionZNorth(tileSize: number, gridSize: number): void {
            this.mesh.position.z = CoordinateSystemHelps.CalculateNorthSouthOffSet(this.north, tileSize, gridSize);
        }
        
        private LoadBasicHeightMapFromCellGrid(destinyMesh: BABYLON.GroundMesh, cellGrid: Array<ITileCell>, maxMinHeight: number, updatable: boolean): void {
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
        }        

        private AddModel(index: number, position: BABYLON.Vector3, mapElementType: MapElement.MapElementType, launchParticles: boolean = false): void {            
            if (mapElementType != MapElement.MapElementType.empty) {
                var positionedModel = Models.MasterModelsContainer.GetInstance().GetPositionedElementedResourcedInstanceModel(this.north, this.west, index, position, mapElementType);

                if (positionedModel != null) {
                    this.models.add(positionedModel.GetName(), positionedModel);

                    if (launchParticles) {
                        positionedModel.LaunchParticles();
                    }
                } else {
                    console.log("AddModel, Error creation positioned model with map element type " + mapElementType);
                }                 
            }                  
        }                

        private CalculateIndex(position: BABYLON.Vector3, width: number = -1, height: number = -1): number {
            width = width < 0 ? this.sideSize : width;
            height = height < 0 ? this.sideSize : height;

            var heightMapX = (((position.x + width / 2) / width) * (width - 1)) | 0;
            var heightMapY = ((1.0 - (position.z + height / 2) / height) * (height - 1)) | 0;
            
            return (heightMapX + heightMapY * height);
        }

        private CanPositionedModelOn(position: BABYLON.Vector3, index: number, mapElementType: MapElement.MapElementType): boolean {
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
