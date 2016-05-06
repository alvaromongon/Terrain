module Terrain.Account {

    export class Worker {

        Id: string;
        ResourceAssignedLocation: string;
        tag: HTMLElement;

        constructor(id: string, resourceAssignedLocation: string) {
            this.Id = id;
            this.ResourceAssignedLocation = resourceAssignedLocation;
        }

        public ShowWorker(): void {
            //TODO: Link with 3d model and tile to show/draw the worker in the right position
        }

        public HideWorker(): void {
            //TODO: Link with 3d model and tile to hide the worker in the right position
        }

        public Equal(other: IWorker): boolean {
            return (this.Id == other.Id);
        }        
    }
}
 