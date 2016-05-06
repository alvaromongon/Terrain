var Terrain;
(function (Terrain) {
    var Account;
    (function (Account) {
        var WorkersAllocation = (function () {
            function WorkersAllocation(resourceAssignedLocation, worker) {
                this.resourceAssignedLocation = resourceAssignedLocation;
                this.workers = new Array();
                this.workers.push(worker);
            }
            WorkersAllocation.prototype.Equal = function (other) {
                if (this.resourceAssignedLocation.length > 0) {
                    return this.resourceAssignedLocation == other.resourceAssignedLocation;
                }
            };
            return WorkersAllocation;
        })();
        Account.WorkersAllocation = WorkersAllocation;
    })(Account = Terrain.Account || (Terrain.Account = {}));
})(Terrain || (Terrain = {}));
