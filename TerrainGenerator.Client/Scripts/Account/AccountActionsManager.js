/// <reference path="../typings/jquery/jquery.d.ts"/>
var Terrain;
(function (Terrain) {
    (function (Account) {
        var AccountActionsManager = (function () {
            function AccountActionsManager() {
                this.workersAllocations = new Array();
            }
            AccountActionsManager.GetInstance = function () {
                if (AccountActionsManager.instance == null) {
                    AccountActionsManager.instance = new AccountActionsManager();
                }

                return AccountActionsManager.instance;
            };

            AccountActionsManager.prototype.StartWorkersAllocation = function (workersAllocations) {
            };

            AccountActionsManager.prototype.CancelWorkersAllocation = function (workersAllocations) {
            };

            AccountActionsManager.prototype.GetWorkersAllocations = function () {
                return this.workersAllocations;
            };
            return AccountActionsManager;
        })();
        Account.AccountActionsManager = AccountActionsManager;
    })(Terrain.Account || (Terrain.Account = {}));
    var Account = Terrain.Account;
})(Terrain || (Terrain = {}));
