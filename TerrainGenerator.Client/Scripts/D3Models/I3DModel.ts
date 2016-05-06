module Terrain.D3Models {

    export interface I3DModel {
        name: string;
        isLoaded: boolean;
        meshes: BABYLON.AbstractMesh[];        
    }
}  
