module Terrain.D3Models {

    export class Base3DModelsContainer implements I3DModelsContainer {

        private scene: BABYLON.Scene;

        private resources: I3DModel[];

        constructor(scene: BABYLON.Scene) {
            this.scene = scene;
            this.resources = [];
        }

        public Import3DModel(name: string, rootUrl: string, sceneFilename: string, scale: number): void {
            BABYLON.SceneLoader.ImportMesh("", rootUrl, sceneFilename, this.scene, (newMeshes) => {

                for (var i = 0; i < newMeshes.length; i++) {
                    if (newMeshes[i].material) {
                        newMeshes[i].material.backFaceCulling = false;
                    }
                    newMeshes[i].isVisible = false;
                    newMeshes[i].scaling.x = scale;
                    newMeshes[i].scaling.y = scale;
                    newMeshes[i].scaling.z = scale;
                }

                var resource: I3DModel = {
                    name: name,
                    meshes: newMeshes,
                    isLoaded: false
            };

                this.resources.push(resource);
            });
        }

        public Get3DModel(name: string): BABYLON.AbstractMesh[] {
            var result = this.resources.filter((resource: Terrain.D3Models.I3DModel) => resource.name == name);

            if (result && result.length > 0) {
                return result[0].meshes;
            }

            return null;
        }

        public Get3DModelInstance(name: string, position: BABYLON.Vector3, rotationAngleOverYAxis: number): BABYLON.InstancedMesh[] {
            var instanceMeshes: BABYLON.InstancedMesh[] = [];

            var meshes = this.Get3DModel(name);

            if (meshes != null) {
                for (var i = 0; i < meshes.length; i++) {
                    var instance = (<BABYLON.Mesh>meshes[i]).createInstance(name + i + position.x + position.z);
                    instance.position = position;
                    instance.rotate(BABYLON.Axis.Y, rotationAngleOverYAxis, BABYLON.Space.WORLD);
                    instanceMeshes.push(instance);
                }                
            }            

            return instanceMeshes;
        }
    }

} 