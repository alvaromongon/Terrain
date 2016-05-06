var Terrain;
(function (Terrain) {
    var Account;
    (function (Account) {
        var AccountManager = (function () {
            function AccountManager() {
                AccountManager.instance = this;
            }
            AccountManager.GetInstance = function () {
                if (AccountManager.instance == null) {
                    AccountManager.instance = new AccountManager();
                }
                return AccountManager.instance;
            };
            AccountManager.prototype.IsLoggedIn = function () {
                return sessionStorage.getItem(AccountManager.accountKey) != null && sessionStorage.getItem(AccountManager.access_token) != null;
            };
            AccountManager.prototype.SetAccountId = function (accountId) {
                sessionStorage.setItem(AccountManager.accountKey, accountId);
            };
            AccountManager.prototype.GetAccountId = function () {
                return sessionStorage.getItem(AccountManager.accountKey);
            };
            AccountManager.prototype.SetToken = function (token) {
                sessionStorage.setItem(AccountManager.access_token, token.access_token);
                sessionStorage.setItem(AccountManager.token_type, token.token_type);
                sessionStorage.setItem(AccountManager.expires_in, token.expires_in.toString());
            };
            AccountManager.prototype.GetToken = function () {
                var token = {
                    access_token: sessionStorage.getItem(AccountManager.access_token),
                    token_type: sessionStorage.getItem(AccountManager.token_type),
                    expires_in: parseInt(sessionStorage.getItem(AccountManager.expires_in))
                };
                return token;
            };
            AccountManager.prototype.Clear = function () {
                sessionStorage.clear();
            };
            AccountManager.accountKey = "accountKey";
            AccountManager.access_token = "access_token";
            AccountManager.token_type = "token_type";
            AccountManager.expires_in = "expires_in";
            return AccountManager;
        })();
        Account.AccountManager = AccountManager;
    })(Account = Terrain.Account || (Terrain.Account = {}));
})(Terrain || (Terrain = {}));
