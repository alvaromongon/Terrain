module Terrain.Tiles {

    export class TilesManager implements ITilesManager {

        private static instance: ITilesManager;
        public static maxMinHeight: number = 50;

        private scene: BABYLON.Scene;
        private sun: BABYLON.PointLight;
        private material: BABYLON.Material;

        private tileSize: number;
        private tileSizeDecimalPrecision: number;

        private gridSize: number;

        private amplitud: number;
        
        private initialCenterNorthLalitude: number;
        private initialCenterWestLongitude: number;
        
        private tileMatrixSideSize: number; //must be an odd number to left a tile in the center

        private static isLoading: boolean;

        private static countDownEventLoader: Terrain.Utilities.CountDownEvent;

        private createdTilesArray: Array<Terrain.Tiles.Tile>;
        private visibleTilesArray: Array<Terrain.Tiles.Tile>;
        private tileImage: TileImage;

        public static GetInstance(scene: BABYLON.Scene, sun: BABYLON.PointLight, material: BABYLON.Material, tileSize: number, gridSize: number, tilesMatrixSideSize: number, centerNorthLalitude: number, centerWestLongitude: number, miniMap: HTMLElement): ITilesManager {
            if (TilesManager.instance == null) {
                TilesManager.instance = new TilesManager(scene, sun, material, tileSize, gridSize, tilesMatrixSideSize, centerNorthLalitude, centerWestLongitude, miniMap);
            }

            return TilesManager.instance;
        }

        public static GetExistingInstance(): ITilesManager {
            return TilesManager.instance;
        }

        constructor(scene: BABYLON.Scene, sun: BABYLON.PointLight, material: BABYLON.Material, tileSize: number, gridSize: number, tilesMatrixSideSize: number, centerNorthLalitude: number, centerWestLongitude: number, miniMap: HTMLElement) {
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

            this.createdTilesArray = new Array<Terrain.Tiles.Tile>();
            this.visibleTilesArray = new Array<Terrain.Tiles.Tile>();            

            Terrain.Tiles.Tile.HalfGridSize = this.gridSize / 2;

            // Initialize image on minimap with first tile
            this.tileImage = new TileImage(this.tileSize, this.gridSize, miniMap);

            CoordinateSystemHelps.SetOrigin(this.initialCenterNorthLalitude, this.initialCenterWestLongitude, this.tileSize, this.gridSize);
        }

        public LoadNeededData(currentPosition: BABYLON.Vector3): boolean {
            if (!TilesManager.isLoading) {
                var centerTiletem = this.GetCenterTileItem();
                var currentCenterTiletem = this.GetTileItemByPosition(currentPosition);

                if (!centerTiletem || !currentCenterTiletem) {
                    console.log("New center tile item: North: " + this.initialCenterNorthLalitude + " - West: " + this.initialCenterWestLongitude);

                    this.PopulateVisisbleTilesArray(this.initialCenterNorthLalitude, this.initialCenterWestLongitude);

                    this.LoadVisibleTilesArrayAsync();

                    this.tileImage.LoadTileImage(this.initialCenterNorthLalitude, this.initialCenterWestLongitude);

                    return true;
                } else if (!currentCenterTiletem.IsEqualTo(centerTiletem)) {
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
        }

        public GetPositonAltitude(position: BABYLON.Vector3): number {
            var tileItem = this.GetTileItemByPosition(position);
            return tileItem != null ? tileItem.GetPositonHeight(position) : 0;
        }

        public GetCenterTilePosition(): BABYLON.Vector3 {
            return this.GetCenterTileItem().GetPosition();
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
            return this.GetTileFromTileListByName(name, this.createdTilesArray);
        }

        public OntileLoaded(tileData: ITileData): void {
            if (tileData) {

                var tilesManager = TilesManager.GetExistingInstance();

                var name = tilesManager.GetTileName(tileData.tilePosition.NorthLalitude, tileData.tilePosition.WestLongitude);

                var tile = tilesManager.GetTileByName(name);

                tile.TileLoaded(tileData.data);
            }
        }

        private GetCenterTileItem(): Terrain.Tiles.Tile {
            var index = (((this.tileMatrixSideSize * this.tileMatrixSideSize) / 2) | 0);

            return this.visibleTilesArray.length > index ? this.visibleTilesArray[index] : null;
        }

        private GetTileItemByPosition(position: BABYLON.Vector3) {

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

                    var tileItem = this.GetTileFromTileListByName(name, this.createdTilesArray);

                    if (tileItem == null) {
                        var mesh = this.CreateGroundMeshByName(name);

                        tileItem = new Tile(latitude, longitude, name, this.tileSize, this.gridSize, mesh);                        

                        this.createdTilesArray.push(tileItem);
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
            TilesManager.countDownEventLoader = new Terrain.Utilities.CountDownEvent(4, centeredTile, (data) => { Tile.LoadCenteredTile(data); TilesManager.isLoading = false; });

            tilesArrayToLoad.filter(tile => toLoad.indexOf(tilesArrayToLoad.indexOf(tile)) != -1).forEach(tile => {
                tile.LoadTile(TilesManager.countDownEventLoader);
            });
        }

        private CreateGroundMeshByName(name: string): BABYLON.GroundMesh {
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
        }                
    }
}  
