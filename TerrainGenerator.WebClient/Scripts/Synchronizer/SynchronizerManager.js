var Terrain;
(function (Terrain) {
    var Synchronizer;
    (function (Synchronizer) {
        var SynchronizerManager = (function () {
            function SynchronizerManager(internalInMiliseconds) {
                if (internalInMiliseconds == null || internalInMiliseconds < 1000) {
                    this.intervalInMiliseconds = 10000; //Default value 10 seconds
                }
                this.synchronize(this);
                SynchronizerManager.fire = setInterval(this.synchronize, this.intervalInMiliseconds, this);
            }
            SynchronizerManager.Initialize = function (intervalInMiliseconds) {
                SynchronizerManager.customInternvalInMiliseconds = intervalInMiliseconds;
                var systemHttpClient = Terrain.HttpClients.SystemHttpClient.GetInstance();
                systemHttpClient.GetStocks(null, SynchronizerManager.OnGetStocks);
            };
            SynchronizerManager.Stop = function () {
                clearInterval(SynchronizerManager.fire);
            };
            SynchronizerManager.prototype.synchronize = function (synchronizer) {
                var actions = Terrain.Actions.ActionsQueue.GetInstance().GetPendingActions();
                //var workerAllocations = WorkersManager.GetInstance().GetWorkersAllocations();
                var systemHttpClient = Terrain.HttpClients.SystemHttpClient.GetInstance();
                systemHttpClient.PostSynchronization(actions, SynchronizerManager.OnSynchronization);
                //var promise = $.post("api/Resources", actions);
                //promise.done((data: ISynchronizeResponse) => synchronizer.ProcessResponse(data));
            };
            SynchronizerManager.OnGetStocks = function (data) {
                SynchronizerManager.OnSynchronization(data);
                SynchronizerManager.instance = new SynchronizerManager(SynchronizerManager.customInternvalInMiliseconds);
            };
            SynchronizerManager.OnSynchronization = function (data) {
                if (data) {
                    var response = data;
                    if (response) {
                        if (response.Resources) {
                            response.Resources.forEach(function (resource) { return Terrain.Resources.ResourcesManager.GetInstance().AddUpdateResource(resource); });
                        }
                        if (response.Actions) {
                            response.Actions.forEach(function (action) { return Terrain.Tiles.TilesManager.GetInstance().UpdateCell(action); });
                        }
                    }
                    else {
                        console.log("OnSynchronization, response produced a bad data parse error");
                    }
                }
            };
            return SynchronizerManager;
        })();
        Synchronizer.SynchronizerManager = SynchronizerManager;
    })(Synchronizer = Terrain.Synchronizer || (Terrain.Synchronizer = {}));
})(Terrain || (Terrain = {}));
//# sourceMappingURL=SynchronizerManager.js.map