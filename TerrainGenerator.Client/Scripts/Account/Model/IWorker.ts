module Terrain.Account {

    export interface IWorker {

        Id: string; 
        ResourceAssignedLocation: string;

        ShowWorker(): void;

        HideWorker(): void;

        Equal(other: IWorker): boolean;
    }
}
