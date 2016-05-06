module Terrain.Models {

    export class BaseModel {
        name: string;        

        private static particleSystem: BABYLON.ParticleSystem;

        constructor(name: string, scene: BABYLON.Scene) {
            this.name = name;            
        }

        public CreateMeshes(name: string, size: number, scaling: BABYLON.Vector3 = new BABYLON.Vector3(1, 1, 1)): Array<BABYLON.AbstractMesh> { return null; }
    }
}  
