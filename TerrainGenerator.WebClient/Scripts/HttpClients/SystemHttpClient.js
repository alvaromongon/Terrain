var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Terrain;
(function (Terrain) {
    var HttpClients;
    (function (HttpClients) {
        var SystemHttpClient = (function (_super) {
            __extends(SystemHttpClient, _super);
            function SystemHttpClient() {
                _super.call(this);
                SystemHttpClient.instance = this;
            }
            SystemHttpClient.GetInstance = function () {
                if (SystemHttpClient.instance == null) {
                    SystemHttpClient.instance = new SystemHttpClient();
                }
                return SystemHttpClient.instance;
            };
            SystemHttpClient.prototype.GetSystemConfiguration = function (success, failure) {
                return this._doRequestJson("GET", "/api/SystemConfiguration", null, success, failure);
            };
            SystemHttpClient.prototype.GetTileData = function (data, success, failure) {
                return this._doRequestJson("GET", "/api/Tiles", data, success, failure);
            };
            SystemHttpClient.prototype.GetTileImage = function (data, success, failure) {
                return this._doRequest("GET", "/api/MiniMap", data, success, failure);
            };
            SystemHttpClient.prototype.GetTest = function (success, failure) {
                return this._doRequestJson("GET", "/api/Test", null, success, failure);
            };
            SystemHttpClient.prototype.GetStocks = function (data, success, failure) {
                return this._doRequestJson("GET", "/api/Resources", data, success, failure);
            };
            SystemHttpClient.prototype.PostSynchronization = function (data, success, failure) {
                return this._doRequestJson("POST", "/api/Resources", data, success, failure);
            };
            return SystemHttpClient;
        })(HttpClients.BaseHttpClient);
        HttpClients.SystemHttpClient = SystemHttpClient;
    })(HttpClients = Terrain.HttpClients || (Terrain.HttpClients = {}));
})(Terrain || (Terrain = {}));
//# sourceMappingURL=SystemHttpClient.js.map