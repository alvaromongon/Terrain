var Terrain;
(function (Terrain) {
    var Account;
    (function (Account) {
        var WorkersManager = (function () {
            function WorkersManager() {
                this.workersAllocations = new Array();
                this.workers = new Array();
                this.CreateTag();
            }
            WorkersManager.GetInstance = function () {
                if (WorkersManager.instance == null) {
                    WorkersManager.instance = new WorkersManager();
                }
                return WorkersManager.instance;
            };
            WorkersManager.prototype.UpdateWorkers = function (workers) {
                var _this = this;
                var workingWorkers = 0;
                workers.forEach(function (worker) {
                    var localWorker = _this.GetWorker(worker);
                    if (localWorker == null) {
                        localWorker = new Account.Worker(worker.Id, worker.ResourceAssignedLocation);
                        if (localWorker.ResourceAssignedLocation != null && localWorker.ResourceAssignedLocation.length > 0) {
                            localWorker.ShowWorker();
                            workingWorkers++;
                        }
                        _this.workers.push(localWorker);
                    }
                    else {
                        localWorker.ResourceAssignedLocation = worker.ResourceAssignedLocation;
                        if (localWorker.ResourceAssignedLocation != null && localWorker.ResourceAssignedLocation.length > 0) {
                            localWorker.ShowWorker();
                            workingWorkers++;
                        }
                        else {
                            localWorker.HideWorker();
                        }
                    }
                });
                this.UpdateTag(workingWorkers);
            };
            WorkersManager.prototype.StartWorkersAllocation = function (workersAllocation) {
                if (this.ExistAllocation(workersAllocation)) {
                    return false;
                }
                this.workersAllocations.push(workersAllocation);
                return true;
            };
            WorkersManager.prototype.CancelWorkersAllocation = function (workersAllocation) {
                this.workersAllocations = this.workersAllocations.filter(function (item) { return !item.Equal(workersAllocation); });
            };
            WorkersManager.prototype.GetWorkersAllocations = function () {
                return this.workersAllocations;
            };
            WorkersManager.prototype.ExistAllocation = function (workersAllocation) {
                var result = this.workersAllocations.filter(function (item) { return !item.Equal(workersAllocation); });
                return result.length > 0;
            };
            WorkersManager.prototype.GetWorker = function (worker) {
                var result = this.workers.filter(function (item) { return item.Equal(worker); });
                if (result.length > 0) {
                    return result[0];
                }
                else {
                    null;
                }
            };
            WorkersManager.prototype.UpdateTag = function (workingWorkers) {
                this.CreateTag();
                this.tag.innerHTML = workingWorkers.toString() + "/" + this.workers.length.toString();
            };
            WorkersManager.prototype.CreateTag = function () {
                if (!this.tag) {
                    this.tag = document.getElementById(WorkersManager.tagNane);
                }
            };
            WorkersManager.tagNane = "population";
            return WorkersManager;
        })();
        Account.WorkersManager = WorkersManager;
    })(Account = Terrain.Account || (Terrain.Account = {}));
})(Terrain || (Terrain = {}));
