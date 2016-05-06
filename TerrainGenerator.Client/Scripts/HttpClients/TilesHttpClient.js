var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Terrain;
(function (Terrain) {
    var HttpClients;
    (function (HttpClients) {
        var TilesHttpClient = (function (_super) {
            __extends(TilesHttpClient, _super);
            function TilesHttpClient() {
                _super.call(this);
                TilesHttpClient.instance = this;
            }
            TilesHttpClient.GetInstance = function () {
                if (TilesHttpClient.instance == null) {
                    TilesHttpClient.instance = new TilesHttpClient();
                }
                return TilesHttpClient.instance;
            };
            TilesHttpClient.prototype.GetTilesConfiguration = function (success, failure) {
                return this._doRequestJson("GET", "api/v1/TilesConfiguration", null, success, failure);
            };
            TilesHttpClient.prototype.GetTileData = function (data, success, failure) {
                return this._doRequestJson("GET", "api/v1/Tiles", data, success, failure);
            };
            TilesHttpClient.prototype.GetTileImage = function (data, success, failure) {
                return this._doRequest("GET", "api/v1/MiniMap", data, success, failure);
            };
            return TilesHttpClient;
        })(HttpClients.BaseHttpClient);
        HttpClients.TilesHttpClient = TilesHttpClient;
    })(HttpClients = Terrain.HttpClients || (Terrain.HttpClients = {}));
})(Terrain || (Terrain = {}));
