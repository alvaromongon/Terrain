module Terrain.D3Models {

    export interface I3DModelsContainer {

        Get3DModel(name: string): BABYLON.AbstractMesh[]

        Get3DModelInstance(name: string, position: BABYLON.Vector3, rotationAngleOverYAxis: number): BABYLON.InstancedMesh[]

    }
}  
