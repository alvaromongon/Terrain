module Terrain.Account {

    export class SynchronizerManager {

        private static instance: SynchronizerManager;
        private intervalInMiliseconds: number;
        private static fire: number;

        constructor(internalInMiliseconds: number) {
            if (internalInMiliseconds == null || internalInMiliseconds < 1000) {
                this.intervalInMiliseconds = 60000; //Default value 1 minute
            }

            this.synchronize(this);
            SynchronizerManager.fire = setInterval(this.synchronize, this.intervalInMiliseconds, this);
        }

        public static Initialize(intervalInMiliseconds: number): void {
            SynchronizerManager.instance = new SynchronizerManager(intervalInMiliseconds);
        }

        public static Stop(): void {
            clearInterval(SynchronizerManager.fire);
        }

        private synchronize(synchronizer: SynchronizerManager): void {

            var workerAllocations = WorkersManager.GetInstance().GetWorkersAllocations();
            var promise = $.post("api/AccountShyncronizer", workerAllocations); //Should return ISynchronizerResponse
            promise.done((data: IAccountSynchronizerResponse) => synchronizer.ProcessResponse(data));
        }

        private ProcessResponse(response: IAccountSynchronizerResponse) : void {
            if (response) {
                response.Resources.forEach(resource => ResourceManager.GetInstance().AddUpdateResource(resource));

                WorkersManager.GetInstance().UpdateWorkers(response.Workers);
            }
        }
    }
}   