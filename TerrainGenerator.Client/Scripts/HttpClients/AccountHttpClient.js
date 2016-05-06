/// <reference path="../typings/jquery/jquery.d.ts" />
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
        var AccountHttpClient = (function (_super) {
            __extends(AccountHttpClient, _super);
            function AccountHttpClient() {
                AccountHttpClient.instance = this;
                _super.call(this);
            }
            AccountHttpClient.GetInstance = function () {
                if (AccountHttpClient.instance == null) {
                    AccountHttpClient.instance = new AccountHttpClient();
                }
                return AccountHttpClient.instance;
            };
            AccountHttpClient.prototype.Register = function (accountEmail, accountPassword, confirmAccountPassword, success, failure) {
                var accountManager = Terrain.Account.AccountManager.GetInstance();
                accountManager.Clear();
                var data = {
                    Email: accountEmail,
                    Password: accountPassword,
                    ConfirmPassword: confirmAccountPassword
                };
                var jQryAjxSetting = {
                    url: '/api/v1/Account/Register',
                    type: "POST",
                    contentType: "application/json; charset=utf-8",
                    //dataType: "json",
                    async: true,
                    data: JSON.stringify(data),
                    error: function (jqXHR, textStatus, errorThrown) {
                        if (failure) {
                            failure(textStatus, errorThrown);
                        }
                    },
                    success: function (data, textStatus, jqXHR) {
                        success(data);
                    }
                };
                $.ajax(jQryAjxSetting);
            };
            AccountHttpClient.prototype.LogIn = function (accountId, accountPassword, success, failure) {
                var accountManager = Terrain.Account.AccountManager.GetInstance();
                accountManager.Clear();
                var headers = {};
                headers["Authorization"] = AccountHttpClient.AUTHORIZATION_HEADER_LOGGING_IN(btoa(accountId + ":" + accountPassword));
                var jQryAjxSetting = {
                    url: '/Token',
                    type: "POST",
                    //contentType: "application/json; charset=utf-8",
                    //dataType: "json",
                    async: true,
                    data: AccountHttpClient.LOGGING_DATA,
                    headers: headers,
                    error: function (jqXHR, textStatus, errorThrown) {
                        if (failure) {
                            failure(textStatus, errorThrown);
                        }
                    },
                    success: function (data, textStatus, jqXHR) {
                        accountManager.SetAccountId(accountId);
                        accountManager.SetToken(data);
                        success(data);
                    }
                };
                $.ajax(jQryAjxSetting);
            };
            AccountHttpClient.LOGGING_DATA = { grant_type: 'password' };
            AccountHttpClient.AUTHORIZATION_HEADER_LOGGING_IN = function (accountLoggingIn) { return "Basic " + accountLoggingIn; };
            return AccountHttpClient;
        })(HttpClients.BaseHttpClient);
        HttpClients.AccountHttpClient = AccountHttpClient;
    })(HttpClients = Terrain.HttpClients || (Terrain.HttpClients = {}));
})(Terrain || (Terrain = {}));
