/// <reference path="../typings/jquery/jquery.d.ts" />
var Terrain;
(function (Terrain) {
    var HttpClients;
    (function (HttpClients) {
        var BaseHttpClient = (function () {
            function BaseHttpClient() {
            }
            BaseHttpClient.prototype._doRequestJson = function (verb, route, data, success, failure) {
                var accountManager = Terrain.Account.AccountManager.GetInstance();
                var token = accountManager.GetToken();
                if (token.access_token == null) {
                    return false;
                }
                var isGet = true;
                if (verb != "GET") {
                    isGet = false;
                }
                var headers = {};
                headers[BaseHttpClient.AUTHORIZATION_HEADER] = BaseHttpClient.AUTHORIZATION_HEADER_AUTHENTICATED(token.access_token);
                //dataType: isGet ? "json" : null,
                var jQryAjxSetting = {
                    url: this.GetUrl(route),
                    type: verb,
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    async: true,
                    data: isGet ? data : JSON.stringify(data),
                    headers: headers,
                    error: function (jqXHR, textStatus, errorThrown) {
                        if (failure) {
                            failure(textStatus, errorThrown);
                        }
                    },
                    success: function (data, textStatus, jqXHR) { success(data); }
                };
                $.ajax(jQryAjxSetting);
                return true;
            };
            BaseHttpClient.prototype._doRequest = function (verb, route, data, success, failure) {
                var accountManager = Terrain.Account.AccountManager.GetInstance();
                var token = accountManager.GetToken();
                if (token.access_token == null) {
                    return false;
                }
                var headers = {};
                headers[BaseHttpClient.AUTHORIZATION_HEADER] = BaseHttpClient.AUTHORIZATION_HEADER_AUTHENTICATED(token.access_token);
                var jQryAjxSetting = {
                    url: this.GetUrl(route),
                    type: verb,
                    //contentType: "application/json; charset=utf-8",
                    //dataType: "json",
                    async: true,
                    data: data,
                    headers: headers,
                    error: function (jqXHR, textStatus, errorThrown) {
                        if (failure) {
                            failure(textStatus, errorThrown);
                        }
                    },
                    success: function (data, textStatus, jqXHR) { success(data); },
                };
                $.ajax(jQryAjxSetting);
                return true;
            };
            BaseHttpClient.prototype.GetUrl = function (route) {
                var protocol = "http://";
                if (BaseHttpClient.USE_SSL) {
                    protocol = "https://";
                }
                return protocol + BaseHttpClient.WEB_API_BASE_URL + route;
            };
            BaseHttpClient.USE_SSL = false;
            BaseHttpClient.WEB_API_BASE_URL = "localhost:54516"; //"wtwd.cloudapp.net/TerrainGenerator"; //"localhost/TerrainGenerator"; //"localhost:54516"
            BaseHttpClient.CSRF_TOKEN_KEY = "access_token";
            BaseHttpClient.CSRF_TOKEN_EXPIRATION_KEY = "access_token_expiration";
            BaseHttpClient.AUTHORIZATION_HEADER = "Authorization";
            BaseHttpClient.AUTHORIZATION_HEADER_AUTHENTICATED = function (accessToken) { return "Bearer " + accessToken; };
            return BaseHttpClient;
        })();
        HttpClients.BaseHttpClient = BaseHttpClient;
    })(HttpClients = Terrain.HttpClients || (Terrain.HttpClients = {}));
})(Terrain || (Terrain = {}));
//# sourceMappingURL=BaseHttpClient.js.map