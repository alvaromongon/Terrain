module Terrain.Models {

    export enum TextPosition {
        center = 0,
        centerLeft = 1,
        centerRight = 2,
        topleft = 3,
        top = 4,
        topRight = 5
    }

    export class BaseInstanceModel {
        public name: string;        
        private meshes: Array<BABYLON.AbstractMesh>; 
        public _size: number;
        private geometry: GeometryType;
        // The position of a mesh identify the center of an object. But the system position elements on the center bottom.
        // The originaly position will be modified to position the center bottom of the object on the requested position.
        // But when retrieving the position with a "GetPosition" the real requested position of the object should be provided.
        private originalPosition: BABYLON.Vector3 = null;

        constructor(meshes: Array<BABYLON.AbstractMesh>, size: number, geometry: GeometryType) {

            if (meshes.length == 0) {
                throw "Meshes argument needs at least one mesh";
            }

            this.meshes = meshes;
            this._size = size;
            this.geometry = geometry;
        }

        public SetPosition(position: BABYLON.Vector3) {

            if (position == null) {
                console.log("SetPosition, position parameter cannot be null");
                return;
            }

            this.name = this.meshes[0].name;
            this.originalPosition = position.clone();
            position = position.clone(); //Create new object to avoid changing value by reference

            switch (this.geometry) {
                case GeometryType.Plane:
                case GeometryType.Cylinder:
                case GeometryType.Torus:                  
                    position.y += (this.meshes[0].scaling.y * this._size) / 2;
                    break;                
            }
                
            this.meshes.forEach(mesh => { mesh.position = position; });
        }

        public GetName(): string {
            return this.name;
        }

        public GetPosition(): BABYLON.Vector3 {
            return this.originalPosition == null ? null : this.originalPosition.clone();
        }

        public IsSameMesh(mesh: BABYLON.AbstractMesh): boolean {
            return this.meshes[0] == mesh;
        }

        public Hide() {
            //console.log("Hide instance model : " + this.name);
            this.meshes.forEach(mesh => { mesh.isVisible = false; });
        }

        public Show() {
            //console.log("Show instance model : " + this.name);
            this.meshes.forEach(mesh => { mesh.isVisible = true; });
        }

        public LaunchParticles() {
            var particleSystem = new BABYLON.ParticleSystem("particles", 4000, this.meshes[0].getScene());
            particleSystem.particleTexture = new BABYLON.Texture("Assets/Icons/Flare.png", this.meshes[0].getScene());
            particleSystem.minAngularSpeed = -4.5;
            particleSystem.maxAngularSpeed = 4.5;
            particleSystem.minSize = 0.5;
            particleSystem.maxSize = 4.0;
            particleSystem.minLifeTime = 0.5;
            particleSystem.maxLifeTime = 2.0;
            particleSystem.minEmitPower = 0.5;
            particleSystem.maxEmitPower = 1.0;
            particleSystem.emitRate = 400;
            particleSystem.blendMode = BABYLON.ParticleSystem.BLENDMODE_ONEONE;
            particleSystem.minEmitBox = new BABYLON.Vector3(0, 0, 0);
            particleSystem.maxEmitBox = new BABYLON.Vector3(0, 0, 0);
            particleSystem.direction1 = new BABYLON.Vector3(0, 1, 0);
            particleSystem.direction2 = new BABYLON.Vector3(0, 1, 0);
            particleSystem.color1 = new BABYLON.Color4(0, 0, 1, 1);
            particleSystem.color2 = new BABYLON.Color4(1, 1, 1, 1);
            particleSystem.gravity = new BABYLON.Vector3(0, 5, 0);
            particleSystem.manualEmitCount = 0;
            particleSystem.emitter = new BABYLON.Vector3(0, 0, 0);
            particleSystem.start();


            particleSystem.emitter = this.meshes[0];
            particleSystem.manualEmitCount += 400;
        }

        public IsHighLighted() {
            var standardMaterial = <BABYLON.StandardMaterial>this.meshes[0].material;

            if (standardMaterial) {
                return standardMaterial.emissiveColor.r == 1.0 && standardMaterial.emissiveColor.g == 1.0 && standardMaterial.emissiveColor.b == 1.0;
            };

            return false;
        }

        public HighLight() {
            this.meshes.forEach(mesh => {
                var standardMaterial = <BABYLON.StandardMaterial>mesh.material;

                if (standardMaterial) {
                    standardMaterial.emissiveColor = new BABYLON.Color3(1.0, 1.0, 1.0);
                };
            });
        }

        public DeHighLight() {
            this.meshes.forEach(mesh => {
                var standardMaterial = <BABYLON.StandardMaterial>mesh.material;

                if (standardMaterial) {
                    standardMaterial.emissiveColor = new BABYLON.Color3(0.0, 0.0, 0.0);
                };
            });
        }     

        public Dispose(): void {
            //console.log("Dispose instance model : " + this.name);
            this.meshes.forEach(mesh => { mesh.dispose(); });
            this.meshes = null;
        }

        public WriteText(text: string) {
            this.meshes.forEach(mesh => {
                if (mesh.material instanceof BABYLON.StandardMaterial && (<BABYLON.StandardMaterial>mesh.material).diffuseTexture instanceof BABYLON.DynamicTexture) {
                    var texture = <BABYLON.DynamicTexture>(<BABYLON.StandardMaterial>mesh.material).diffuseTexture;
                    var context = texture.getContext();

                    var clearColor = "gray";
                    var font = "40px Segoe UI";
                    var invertY = true;
                    var color = "white";

                    var size = texture.getSize();

                    //Background
                    if (clearColor) {
                        context.fillStyle = clearColor;
                        context.fillRect(0, 0, size.width, size.height);
                    }

                    //Text
                    context.font = font;
                    context.fillStyle = color;
                    context.textBaseline = "top";
                    //context.fillText(text, 10, 10);
                    context.wrapText(text, 5, 5, size.width - 10, 50);

                    texture.update(invertY);
                } else {
                    console.log("Trying to write text on a model instance but the material is not StandardMaterial or the diffuseTexture is not DynamicTexture");
                }
            });
        }
    }
}  
