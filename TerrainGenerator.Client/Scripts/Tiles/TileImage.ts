module Terrain.Tiles {

    export class TileImage {

        private static instance: TileImage;

        private north: number;
        private west: number;    
        private tileSize: number;
        private gridSize: number;  
        private miniMap: HTMLElement; 

        constructor(tileSize: number, gridSize: number, miniMap: HTMLElement) {
            this.tileSize = tileSize;
            this.gridSize = gridSize;
            this.miniMap = miniMap;

            TileImage.instance = this;
        }

        public static GetExistingInstance(): TileImage {
            return TileImage.instance;
        }

        public LoadTileImage(north: number, west: number): void {

            if (this.miniMap.tagName == "IMG" && !(this.north == north && this.west == west)) {
                this.north = north;
                this.west = west;

                console.log("Requesting a new image tile");

                var tilesHttpClient = Terrain.HttpClients.TilesHttpClient.GetInstance();
                tilesHttpClient.GetTileImage({ NorthLalitude: this.north, WestLongitude: this.west }, this.OnImageLoaded);  
            }            
        }

        private OnImageLoaded(data: any): void {
            if (data) {
                TileImage.GetExistingInstance().miniMap.setAttribute("src", "data:image/bmp;base64," + data);
            }
        }        
    }
}  
