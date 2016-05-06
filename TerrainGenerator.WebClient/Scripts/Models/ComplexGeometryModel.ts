module Terrain.Models {

    export class ComplexGeometryModel extends BaseModel {     
        meshes: Array<BABYLON.AbstractMesh>;   
        
        constructor(name: string, meshes: Array<BABYLON.AbstractMesh>, scene: BABYLON.Scene) {
            super(name, scene);
            this.meshes = meshes;
        } 
        
        public CreateMeshes(name: string, size: number): Array<BABYLON.AbstractMesh> {            

            var meshes: Array<BABYLON.AbstractMesh> = new Array<BABYLON.AbstractMesh>();

            for (var i = 0; i < this.meshes.length; i++) {
                var instanceMesh = (<BABYLON.Mesh>this.meshes[i]).createInstance(name + i);// + position.x + position.z);

                //instance.position = position;

                var rotationAngleOverYAxis = Math.random() * Math.PI * 2;;
                instanceMesh.rotate(BABYLON.Axis.Y, rotationAngleOverYAxis, BABYLON.Space.WORLD);

                meshes.push(instanceMesh);

                //var instance = (<BABYLON.Mesh>model.meshes[0]).createInstance(name + position.x + position.z);
                //instance.position = position;
                //instance.rotate(BABYLON.Axis.Y, rotationAngleOverYAxis, BABYLON.Space.WORLD);
                //instanceMeshes.push(instance);
            }

            return meshes;
        }    
    }
}  
