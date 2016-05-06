module Terrain.Environment {

    export class Tree {
        private name: string;

        public meshes: Array<BABYLON.InstancedMesh>;

        constructor() {
            this.meshes = new Array<BABYLON.InstancedMesh>();
        }

        public Hide(): void {
            for (var i = 0; i < this.meshes.length; i++) {
                this.meshes[i].isVisible = false;
            }
        }

        public Show(): void {
            for (var i = 0; i < this.meshes.length; i++) {
                this.meshes[i].isVisible = true;
            }
        }
    }

} 