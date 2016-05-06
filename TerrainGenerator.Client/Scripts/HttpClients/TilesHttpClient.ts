module Terrain.HttpClients {

    export class TilesHttpClient extends BaseHttpClient {

        private static instance: TilesHttpClient;

        constructor() {
            super();
            TilesHttpClient.instance = this;
        }

        public static GetInstance(): TilesHttpClient {
            if (TilesHttpClient.instance == null) {
                TilesHttpClient.instance = new TilesHttpClient();
            }

            return TilesHttpClient.instance;
        }

        public GetTilesConfiguration(success: (data: any) => void, failure?: (textStatus: string, errorThrown: string) => void): boolean {

            return this._doRequestJson("GET", "api/v1/TilesConfiguration", null, success, failure);
        }

        public GetTileData(data: any, success: (data: any) => void, failure?: (textStatus: string, errorThrown: string) => void): boolean {

            return this._doRequestJson("GET", "api/v1/Tiles", data, success, failure);
        }

        public GetTileImage(data: any, success: (data: any) => void, failure?: (textStatus: string, errorThrown: string) => void): boolean {
            
            return this._doRequest("GET", "api/v1/MiniMap", data, success, failure);
        }
    }
}  