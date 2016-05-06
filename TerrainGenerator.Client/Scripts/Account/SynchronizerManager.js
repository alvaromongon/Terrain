var Terrain;
(function (Terrain) {
    var Account;
    (function (Account) {
        var SynchronizerManager = (function () {
            function SynchronizerManager(internalInMiliseconds) {
                if (internalInMiliseconds == null || internalInMiliseconds < 1000) {
                    this.intervalInMiliseconds = 60000; //Default value 1 minute
                }
                this.synchronize(this);
                SynchronizerManager.fire = setInterval(this.synchronize, this.intervalInMiliseconds, this);
            }
            SynchronizerManager.Initialize = function (intervalInMiliseconds) {
                SynchronizerManager.instance = new SynchronizerManager(intervalInMiliseconds);
            };
            SynchronizerManager.Stop = function () {
                clearInterval(SynchronizerManager.fire);
            };
            SynchronizerManager.prototype.synchronize = function (synchronizer) {
                var workerAllocations = Account.WorkersManager.GetInstance().GetWorkersAllocations();
                var promise = $.post("api/AccountShyncronizer", workerAllocations); //Should return ISynchronizerResponse
                promise.done(function (data) { return synchronizer.ProcessResponse(data); });
            };
            SynchronizerManager.prototype.ProcessResponse = function (response) {
                if (response) {
                    response.Resources.forEach(function (resource) { return Account.ResourceManager.GetInstance().AddUpdateResource(resource); });
                    Account.WorkersManager.GetInstance().UpdateWorkers(response.Workers);
                }
            };
            return SynchronizerManager;
        })();
        Account.SynchronizerManager = SynchronizerManager;
    })(Account = Terrain.Account || (Terrain.Account = {}));
})(Terrain || (Terrain = {}));
