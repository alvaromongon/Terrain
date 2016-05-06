var Terrain;
(function (Terrain) {
    var Account;
    (function (Account) {
        var Worker = (function () {
            function Worker(id, resourceAssignedLocation) {
                this.Id = id;
                this.ResourceAssignedLocation = resourceAssignedLocation;
            }
            Worker.prototype.ShowWorker = function () {
                //TODO: Link with 3d model and tile to show/draw the worker in the right position
            };
            Worker.prototype.HideWorker = function () {
                //TODO: Link with 3d model and tile to hide the worker in the right position
            };
            Worker.prototype.Equal = function (other) {
                return (this.Id == other.Id);
            };
            return Worker;
        })();
        Account.Worker = Worker;
    })(Account = Terrain.Account || (Terrain.Account = {}));
})(Terrain || (Terrain = {}));
