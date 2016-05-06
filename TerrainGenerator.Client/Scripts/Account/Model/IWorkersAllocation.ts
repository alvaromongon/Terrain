module Terrain.Account {

    export interface IWorkersAllocation {

        resourceAssignedLocation: string; // NortTile_WestTitle_X_Y

        workers: Array<string>;

        Equal(other: IWorkersAllocation): boolean;
    }
}  
  