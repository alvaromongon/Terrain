module Terrain.Account {

    export class WorkersManager implements IWorkersManager {

        private static instance: IWorkersManager;

        private static tagNane: string = "population";

        private workersAllocations: Array<IWorkersAllocation>;
        private workers: Array<IWorker>;

        private tag: HTMLElement;

        public static GetInstance(): IWorkersManager {
            if (WorkersManager.instance == null) {
                WorkersManager.instance = new WorkersManager();
            }

            return WorkersManager.instance;
        }

        constructor() {
            this.workersAllocations = new Array<IWorkersAllocation>();
            this.workers = new Array<IWorker>();

            this.CreateTag();
        }

        public UpdateWorkers(workers: Array<IWorker>): void {

            var workingWorkers = 0;

            workers.forEach(worker => {
                var localWorker = this.GetWorker(worker);

                if (localWorker == null) { //The worker is not registered.
                    localWorker = new Worker(worker.Id, worker.ResourceAssignedLocation);
                    if (localWorker.ResourceAssignedLocation != null && localWorker.ResourceAssignedLocation.length > 0) {
                        localWorker.ShowWorker();
                        workingWorkers++;
                    }
                    this.workers.push(localWorker);
                } else {
                    localWorker.ResourceAssignedLocation = worker.ResourceAssignedLocation;

                    if (localWorker.ResourceAssignedLocation != null && localWorker.ResourceAssignedLocation.length > 0) {
                        localWorker.ShowWorker();
                        workingWorkers++;
                    } else {
                        localWorker.HideWorker();
                    }
                }
            });

            this.UpdateTag(workingWorkers);
        }

        public StartWorkersAllocation(workersAllocation: IWorkersAllocation): boolean {
            if (this.ExistAllocation(workersAllocation)) {
                return false;
            }

            this.workersAllocations.push(workersAllocation);
            return true;
        }

        public CancelWorkersAllocation(workersAllocation: IWorkersAllocation): void {
            this.workersAllocations = this.workersAllocations.filter((item) => !item.Equal(workersAllocation));
        }

        public GetWorkersAllocations(): Array<IWorkersAllocation> {
            return this.workersAllocations;
        }

        private ExistAllocation(workersAllocation: IWorkersAllocation): boolean {
            var result = this.workersAllocations.filter((item) => !item.Equal(workersAllocation));

            return result.length > 0;
        }

        private GetWorker(worker: IWorker): IWorker {
            var result = this.workers.filter((item) => item.Equal(worker));

            if (result.length > 0) {
                return result[0];
            } else {
                null;
            }
        }

        private UpdateTag(workingWorkers : number): void {
            this.CreateTag();

            this.tag.innerHTML = workingWorkers.toString() + "/" + this.workers.length.toString();
        }

        private CreateTag(): void {
            if (!this.tag) {
                this.tag = document.getElementById(WorkersManager.tagNane);
            }
        }
    }
}    