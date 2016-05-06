/// <reference path="../typings/jquery/jquery.d.ts"/>
var Terrain;
(function (Terrain) {
    (function (Account) {
        var WorkersAllocationsManager = (function () {
            function WorkersAllocationsManager() {
                this.workersAllocations = new Array();
            }
            WorkersAllocationsManager.GetInstance = function () {
                if (WorkersAllocationsManager.instance == null) {
                    WorkersAllocationsManager.instance = new WorkersAllocationsManager();
                }

                return WorkersAllocationsManager.instance;
            };

            WorkersAllocationsManager.prototype.StartWorkersAllocation = function (workersAllocation) {
                if (this.Exist(workersAllocation)) {
                    return false;
                }

                this.workersAllocations.push(workersAllocation);
                return true;
            };

            WorkersAllocationsManager.prototype.CancelWorkersAllocation = function (workersAllocation) {
                this.workersAllocations = this.workersAllocations.filter(function (item) {
                    return !item.Equal(workersAllocation);
                });
            };

            WorkersAllocationsManager.prototype.GetWorkersAllocations = function () {
                return this.workersAllocations;
            };

            WorkersAllocationsManager.prototype.Exist = function (workersAllocation) {
                var result = this.workersAllocations.filter(function (item) {
                    return !item.Equal(workersAllocation);
                });

                return result.length > 0;
            };
            return WorkersAllocationsManager;
        })();
        Account.WorkersAllocationsManager = WorkersAllocationsManager;
    })(Terrain.Account || (Terrain.Account = {}));
    var Account = Terrain.Account;
})(Terrain || (Terrain = {}));
