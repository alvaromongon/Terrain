module Terrain.Synchronizer {

    export interface ISynchronizeResponse {

        //Workers: Array<IWorker>;
        Resources: Array<Terrain.Resources.IResourceUpdate>;
        Actions: Array<Terrain.Actions.IAction>;
    }
}
 