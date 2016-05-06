module Terrain.Environment {

    export class Water {
        private name: string;

        public waterMesh: BABYLON.Mesh;
        private material: BABYLON.Material;
        private scene: BABYLON.Scene;

        constructor(name: string, scene: BABYLON.Scene, material: BABYLON.Material) {
            this.name = name;
            this.scene = scene;
            this.material = material;            
        }

        public Render(gridSize: number, multiplier: number): void {
            console.log('Rendering water with gridSize: ' + gridSize + ' - and multiplier: ' + multiplier);

            this.waterMesh = BABYLON.Mesh.CreateGround(this.name, gridSize * multiplier, gridSize * multiplier, 1, this.scene, false);
            this.waterMesh.isPickable = false;
            //this.waterMesh.renderingGroupId = 2;

            var types = [-1000.0, -1000.0, -1000.0, -1000.0];

            this.waterMesh.setVerticesData("type", types, false, 1); //Set the type of the vertice

            this.waterMesh.isPickable = false;
            this.waterMesh.material = this.material;
            //Follow the camera position
            //this.waterMesh.infiniteDistance = true
        }        

        public SetPosition(xCoordinate: number, zCoordinate: number): void {
            this.waterMesh.position = new BABYLON.Vector3(xCoordinate, this.waterMesh.position.y, zCoordinate);
        }
    }

} 