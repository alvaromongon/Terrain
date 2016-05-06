var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
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
                    url: this.GetUrl('/api/Account/Register'),
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
                    },
                };
                $.ajax(jQryAjxSetting);
            };
            AccountHttpClient.prototype.LogIn = function (accountEmail, accountPassword, success, failure) {
                var accountManager = Terrain.Account.AccountManager.GetInstance();
                accountManager.Clear();
                var headers = {};
                headers["Authorization"] = AccountHttpClient.AUTHORIZATION_HEADER_LOGGING_IN(btoa(accountEmail + ":" + accountPassword));
                var jQryAjxSetting = {
                    url: this.GetUrl('/Token'),
                    type: "POST",
                    contentType: "application/json; charset=utf-8",
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
                        accountManager.SetAccountEmail(accountEmail);
                        accountManager.SetToken(data);
                        success(data);
                    },
                };
                $.ajax(jQryAjxSetting);
            };
            AccountHttpClient.prototype.UpdateLocation = function (data, success, failure) {
                this._doRequestJson("PUT", "/api/Account/Location", data, success, failure);
            };
            AccountHttpClient.LOGGING_DATA = { grant_type: 'password' };
            AccountHttpClient.AUTHORIZATION_HEADER_LOGGING_IN = function (accountLoggingIn) { return "Basic " + accountLoggingIn; };
            return AccountHttpClient;
        })(HttpClients.BaseHttpClient);
        HttpClients.AccountHttpClient = AccountHttpClient;
    })(HttpClients = Terrain.HttpClients || (Terrain.HttpClients = {}));
})(Terrain || (Terrain = {}));
//# sourceMappingURL=AccountHttpClient.js.map