module Terrain.Synchronizer {

    export class SynchronizerManager {

        private static customInternvalInMiliseconds: number;
        private static instance: SynchronizerManager;
        private intervalInMiliseconds: number;
        private static fire: number;

        constructor(internalInMiliseconds: number) {
            if (internalInMiliseconds == null || internalInMiliseconds < 1000) {
                this.intervalInMiliseconds = 10000; //Default value 10 seconds
            }

            this.synchronize(this);
            SynchronizerManager.fire = setInterval(this.synchronize, this.intervalInMiliseconds, this);
        }

        public static Initialize(intervalInMiliseconds: number): void {

            SynchronizerManager.customInternvalInMiliseconds = intervalInMiliseconds;

            var systemHttpClient = Terrain.HttpClients.SystemHttpClient.GetInstance();
            systemHttpClient.GetStocks(null, SynchronizerManager.OnGetStocks);
        }

        public static Stop(): void {
            clearInterval(SynchronizerManager.fire);
        }

        public synchronize(synchronizer: SynchronizerManager): void {

            var actions = Terrain.Actions.ActionsQueue.GetInstance().GetPendingActions();
            //var workerAllocations = WorkersManager.GetInstance().GetWorkersAllocations();

            var systemHttpClient = Terrain.HttpClients.SystemHttpClient.GetInstance();
            systemHttpClient.PostSynchronization(actions, SynchronizerManager.OnSynchronization);  

            //var promise = $.post("api/Resources", actions);
            //promise.done((data: ISynchronizeResponse) => synchronizer.ProcessResponse(data));
        }

        public static OnGetStocks(data: any): void {
            SynchronizerManager.OnSynchronization(data);
            SynchronizerManager.instance = new SynchronizerManager(SynchronizerManager.customInternvalInMiliseconds);
        }

        public static OnSynchronization(data: any): void {
            if (data) {
                var response = <ISynchronizeResponse>data;

                if (response) {
                    if (response.Resources) {
                        response.Resources.forEach(resource => Terrain.Resources.ResourcesManager.GetInstance().AddUpdateResource(resource));                        
                    }                    

                    if (response.Actions) {
                        response.Actions.forEach(action => Terrain.Tiles.TilesManager.GetInstance().UpdateCell(action));                        
                    }                    

                    //WorkersManager.GetInstance().UpdateWorkers(response.Workers);
                } else {
                    console.log("OnSynchronization, response produced a bad data parse error");
                }
            }
        }  
    }
}   