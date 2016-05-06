module Terrain.HttpClients {

    export class SystemHttpClient extends BaseHttpClient {

        private static instance: SystemHttpClient;

        constructor() {
            super();
            SystemHttpClient.instance = this;
        }

        public static GetInstance(): SystemHttpClient {
            if (SystemHttpClient.instance == null) {
                SystemHttpClient.instance = new SystemHttpClient();
            }

            return SystemHttpClient.instance;
        }

        public GetSystemConfiguration(success: (data: any) => void, failure?: (textStatus: string, errorThrown: string) => void): boolean {

            return this._doRequestJson("GET", "/api/SystemConfiguration", null, success, failure);
        }

        public GetTileData(data: any, success: (data: any) => void, failure?: (textStatus: string, errorThrown: string) => void): boolean {

            return this._doRequestJson("GET", "/api/Tiles", data, success, failure);
        }

        public GetTileImage(data: any, success: (data: any) => void, failure?: (textStatus: string, errorThrown: string) => void): boolean {
            
            return this._doRequest("GET", "/api/MiniMap", data, success, failure);
        }

        public GetTest(success: (data: any) => void, failure?: (textStatus: string, errorThrown: string) => void): boolean {

            return this._doRequestJson("GET", "/api/Test", null, success, failure);
        }

        public GetStocks(data: any, success: (data: any) => void, failure?: (textStatus: string, errorThrown: string) => void): boolean {

            return this._doRequestJson("GET", "/api/Resources", data, success, failure);
        }

        public PostSynchronization(data: any, success: (data: any) => void, failure?: (textStatus: string, errorThrown: string) => void): boolean {

            return this._doRequestJson("POST", "/api/Resources", data, success, failure);
        }
    }
}  