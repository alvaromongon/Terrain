module Terrain.Account {

    export interface IWorkersManager {

        UpdateWorkers(workers: Array<IWorker>): void;

        StartWorkersAllocation(workersAllocation: IWorkersAllocation): boolean;
        CancelWorkersAllocation(workersAllocation: IWorkersAllocation): void;

        GetWorkersAllocations(): Array<IWorkersAllocation>;

    }
}  
 