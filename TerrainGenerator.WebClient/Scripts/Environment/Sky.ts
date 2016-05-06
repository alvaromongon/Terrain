module Terrain.Environment {

    export enum SkyBoxType {
        CloudyLightRays,
        night,
        snow,
        TropicalSunnyDay
    }

    export class SkyBox {
        private name: string;
        private skyMesh: BABYLON.Mesh;
        private scene: BABYLON.Scene;

        constructor(name: string, scene: BABYLON.Scene) {
            this.name = name;
            this.scene = scene;
        }

        public RenderSkyBox(type: SkyBoxType, gridSize: number, multiplier: number): void {
            this.skyMesh = BABYLON.Mesh.CreateBox("skyBox", (gridSize * multiplier) * 1.5, this.scene);
            this.skyMesh.isPickable = false;

            //Follow the camera position
            this.skyMesh.infiniteDistance = true;
            
            //Sky render after everything else
            this.skyMesh.renderingGroupId = 0;

            var filesPath = "";
            switch (type) {
                case SkyBoxType.CloudyLightRays:
                    filesPath = "CloudyLightRays";
                    break;
                case SkyBoxType.night:
                    filesPath = "night";
                    break;
                case SkyBoxType.snow:
                    filesPath = "snow";
                    break;
                case SkyBoxType.TropicalSunnyDay:
                    filesPath = "TropicalSunnyDay";
                    break;
            }

            var skyboxMaterial = new BABYLON.StandardMaterial("skyBox", this.scene);
            skyboxMaterial.backFaceCulling = false;
            skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture("Assets/skybox/" + filesPath, this.scene);
            skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
            
            //The sun doesn't reflect on the sky
            skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
            skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
                
            this.skyMesh.material = skyboxMaterial;
        }

        public GetMesh(): BABYLON.Mesh {
            return this.skyMesh;
        }
    }

} 