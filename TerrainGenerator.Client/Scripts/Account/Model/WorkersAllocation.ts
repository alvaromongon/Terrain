module Terrain.Account {
    export class WorkersAllocation implements IWorkersAllocation {
        resourceAssignedLocation: string; // NortTile_WestTitle_X_Y
        workers: Array<string>;

        constructor(resourceAssignedLocation: string, worker: string) {
            this.resourceAssignedLocation = resourceAssignedLocation;
            this.workers = new Array<string>();

            this.workers.push(worker);
        }

        public Equal(other: IWorkersAllocation): boolean {
            if (this.resourceAssignedLocation.length > 0) {
                return this.resourceAssignedLocation == other.resourceAssignedLocation;
            }
        }
    }
}