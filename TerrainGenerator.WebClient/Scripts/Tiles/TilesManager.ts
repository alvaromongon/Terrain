module Terrain.Tiles {

    export class TilesManager implements ITilesManager {

        private static instance: ITilesManager;        

        private static scene: BABYLON.Scene;
        private sun: BABYLON.PointLight;
        private material: BABYLON.Material;

        public maxMinHeight: number;

        private tileSize: number;
        private tileSizeDecimalPrecision: number;

        private gridSize: number;

        private amplitud: number;
        
        private initialCenterNorthLalitude: number;
        private initialCenterWestLongitude: number;
        
        private tileMatrixSideSize: number; //must be an odd number to left a tile in the center

        private static isLoading: boolean = false;
        private static borders: Array<BABYLON.Mesh>;

        private static countDownEventLoader: Utilities.CountDownEvent;
        
        private loadedTilesArray: Array<Terrain.Tiles.Tile>;
        private visibleTilesArray: Array<Terrain.Tiles.Tile>;
        private tileImage: TileImage;        

        public static InitializeInstance(scene: BABYLON.Scene, sun: BABYLON.PointLight, material: BABYLON.Material, tileSize: number, gridSize: number, tilesMatrixSideSize: number, centerNorthLalitude: number, centerWestLongitude: number, maxMinHeight: number, miniMap: HTMLElement): ITilesManager {
            if (TilesManager.instance == null) {
                TilesManager.instance = new TilesManager(scene, sun, material, tileSize, gridSize, tilesMatrixSideSize, centerNorthLalitude, centerWestLongitude, maxMinHeight, miniMap);
            }

            return TilesManager.instance;
        }

        public static GetInstance(): ITilesManager {
            return TilesManager.instance;
        }

        constructor(scene: BABYLON.Scene, sun: BABYLON.PointLight, material: BABYLON.Material, tileSize: number, gridSize: number, tilesMatrixSideSize: number, centerNorthLalitude: number, centerWestLongitude: number, maxMinHeight: number, miniMap: HTMLElement) {
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

            this.loadedTilesArray = new Array<Terrain.Tiles.Tile>();
            this.visibleTilesArray = new Array<Terrain.Tiles.Tile>();            

            Terrain.Tiles.Tile.HalfGridSize = this.gridSize / 2;

            // Initialize image on minimap with first tile
            this.tileImage = new TileImage(this.tileSize, this.gridSize, miniMap);            

            CoordinateSystemHelps.SetOrigin(this.initialCenterNorthLalitude, this.initialCenterWestLongitude, this.tileSize, this.gridSize);
        }

        public LoadNeededData(currentPosition: BABYLON.Vector2): BABYLON.Vector3 {
            if (!TilesManager.isLoading) {
                var centerTiletem = this.GetCenterTileItem();
                var currentCenterTiletem = this.GetTileItemByPosition(currentPosition);

                if (!centerTiletem || !currentCenterTiletem) {                    

                    this.LoadData(this.initialCenterNorthLalitude, this.initialCenterWestLongitude);                  

                } else if (!TilesManager.isLoading && !currentCenterTiletem.IsEqualTo(centerTiletem)) {

                    TilesManager.SetLoading(true, currentCenterTiletem);
                    this.LoadData(currentCenterTiletem.GetNorthLatitude(), currentCenterTiletem.GetWestLongitude());
                    return currentCenterTiletem.GetPosition();
                }
            }
            return null;
        }

        private LoadData(centerNorthLalitude: number, centerWestLongitude: number): void {
            console.log("New center tile item: North: " + centerNorthLalitude + " - West: " + centerWestLongitude);            

            Terrain.HttpClients.AccountHttpClient.GetInstance().UpdateLocation({ NorthLalitude: centerNorthLalitude, WestLongitude: centerWestLongitude }, null);

            this.PopulateVisisbleTilesArray(centerNorthLalitude, centerWestLongitude);

            this.LoadVisibleTilesArrayAsync();

            this.tileImage.LoadTileImage(centerNorthLalitude, centerWestLongitude);
        }

        public IsLoading(): boolean {
            return TilesManager.isLoading;
        }

        public static SetLoading(isLoading: boolean, tile: Terrain.Tiles.Tile): void {
            if (isLoading) {
                if (tile != null) {
                    TilesManager.CreateInvisibleBorders(tile);                    
                }                
            } else {
                TilesManager.RemoveInvisibleBorders();
            }

            TilesManager.isLoading = isLoading;
        }

        public GetPositonAltitude(position: BABYLON.Vector2): number {
            var tileItem = this.GetTileItemByPosition(position);
            var altitude = tileItem != null ? tileItem.GetPositonHeight(position) : 0;

            return altitude;
        }

        public GetModel(pickedInfo: BABYLON.PickingInfo): Terrain.Models.PositionedElementedResourcedInstanceModel {

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
        }

        public GetCenterTilePosition(): BABYLON.Vector3 {
            var centerTileItem = this.GetCenterTileItem();
            return centerTileItem ? centerTileItem.GetPosition() : null;
        }

        public GetAmplitud(): number {
            return this.amplitud;
        }

        public GetSideSize(): number {
            return this.tileMatrixSideSize;
        }

        public GetTileName(latitude: number, longitude: number): string {
            return 'TileMesh_' + latitude + '-' + longitude;
        }

        public GetTileByName(name: string): Tile {
            return this.GetTileFromTileListByName(name, this.loadedTilesArray);
        }

        public OntileLoaded(tileData: ITileData): void {
            if (tileData) {

                var tilesManager = TilesManager.GetInstance();

                var name = tilesManager.GetTileName(tileData.tilePosition.NorthLalitude, tileData.tilePosition.WestLongitude);

                var tile = tilesManager.GetTileByName(name);

                tile.TileLoaded(tileData.data);
            }
        } 
        
        public UpdateCell(cell: ICell): void {
            var tile = this.GetTileFromCell(cell);

            if (tile != null) {
                tile.UpdateCell(cell);
            }
        }

        public RequestPositionedModelCreationFromPosition(position: BABYLON.Vector3, mapElementType: MapElement.MapElementType): boolean {
            var tile = this.GetTileItemByPosition(new BABYLON.Vector2(position.x, position.z));
            if (tile != null) {
                return tile.RequestPositionedModelCreation(position, mapElementType);
            }
        }

        private GetTileFromCell(cell: ICell): Tiles.Tile {
            var result = this.loadedTilesArray.filter((tile) => tile.GetNorthLatitude() == cell.North && tile.GetWestLongitude() == cell.West);

            if (result.length == 0) {
                return null;
            }

            return result[0];
        }

        private GetCenterTileItem(): Terrain.Tiles.Tile {
            var index = (((this.tileMatrixSideSize * this.tileMatrixSideSize) / 2) | 0);

            return this.visibleTilesArray.length > index ? this.visibleTilesArray[index] : null;
        }

        private GetTileItemByPosition(position: BABYLON.Vector2): Terrain.Tiles.Tile {

            for (var i = 0, tot = this.visibleTilesArray.length; i < tot; i++) {
                if (this.visibleTilesArray[i].IsPositionIntoTile(position)) {
                    return this.visibleTilesArray[i];
                }                
            }

            return null;
        }

        private GetTileFromTileListByName(name: string, tileList: Terrain.Tiles.Tile[]): Terrain.Tiles.Tile {

            var result = tileList.filter(tile => tile.GetName() == name);

            if (result.length > 0) {
                return result[0];
            }
            else {
                return null;
            }
        }      

        private PopulateVisisbleTilesArray(northLalitude: number, westLongitude: number): void {

            var base = (this.tileMatrixSideSize / 2) | 0;

            var previousVisibleTilesArray: Terrain.Tiles.Tile[] = this.visibleTilesArray.slice();

            this.visibleTilesArray.length = 0;

            for (var i = 0; i < this.tileMatrixSideSize; i++) {
                for (var j = 0; j < this.tileMatrixSideSize; j++) {
                    var latitude = CoordinateSystemHelps.CheckLalitude(northLalitude + (this.tileSize * (base - i)), this.tileSizeDecimalPrecision);
                    var longitude = CoordinateSystemHelps.CheckLongitude(westLongitude + (this.tileSize * (j - base)), this.tileSizeDecimalPrecision);
                    var name = this.GetTileName(latitude, longitude);

                    var tileItem = this.GetTileFromTileListByName(name, this.loadedTilesArray);

                    if (tileItem == null) {
                        var mesh = this.CreateGroundMeshByName(name);

                        tileItem = new Tile(latitude, longitude, name, this.tileSize, this.gridSize, this.maxMinHeight, mesh);                        

                        this.loadedTilesArray.push(tileItem);
                    }

                    tileItem.Show();

                    this.visibleTilesArray.push(tileItem);                    

                    if (latitude == northLalitude && longitude == westLongitude) {
                        tileItem.SetIsCenteredTile(true);
                    } else {
                        tileItem.SetIsCenteredTile(false);
                    }
                }
            }

            //Hide not visible any more tiles
            var notVisibleAnyMoreTilesArray: Terrain.Tiles.Tile[] = previousVisibleTilesArray.filter(tile => this.GetTileFromTileListByName(tile.GetName(), this.visibleTilesArray) == null);
            notVisibleAnyMoreTilesArray.forEach(tile => tile.Hide());

            previousVisibleTilesArray = null;
            notVisibleAnyMoreTilesArray = null;
        }

        private LoadVisibleTilesArrayAsync(): void {

            this.visibleTilesArray.forEach(tile => tile.SetSurroundedTiles(this.visibleTilesArray));

            var toLoad = [0, 2, 6, 8];
            TilesManager.countDownEventLoader = new Terrain.Utilities.CountDownEvent(4, this.visibleTilesArray, this.LoadVisibleTilesArraySecondStepAsync);

            this.visibleTilesArray.filter(tile => toLoad.indexOf(this.visibleTilesArray.indexOf(tile)) != -1).forEach(tile => {
                tile.LoadTile(TilesManager.countDownEventLoader);
            });
        }

        private LoadVisibleTilesArraySecondStepAsync(tilesArrayToLoad: Array<Terrain.Tiles.Tile>): void {

            var toLoad = [1, 3, 5, 7];
            var centeredTile = tilesArrayToLoad.filter(tile => tile.GetIsCenteredTile())[0];
            TilesManager.countDownEventLoader = new Terrain.Utilities.CountDownEvent(4, centeredTile, (data) =>
            {
                Tile.LoadCenteredTile(data);
                TilesManager.SetLoading(false, null);
            });

            tilesArrayToLoad.filter(tile => toLoad.indexOf(tilesArrayToLoad.indexOf(tile)) != -1).forEach(tile => {
                tile.LoadTile(TilesManager.countDownEventLoader);
            });
        }

        private CreateGroundMeshByName(name: string): BABYLON.GroundMesh {
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
            mesh.onReady = () => {mesh.optimize(this.gridSize);}

            return mesh;
        }                

        private static CreateInvisibleBorders(centertile: Tile): void {

            TilesManager.borders = new Array<BABYLON.Mesh>();

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
        }

        private static RemoveInvisibleBorders(): void {

            if (TilesManager.borders) {
                TilesManager.borders.forEach(border => border.dispose());                
            }            
        }
    }
}  
