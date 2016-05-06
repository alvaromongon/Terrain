var Terrain;
(function (Terrain) {
    var Environment;
    (function (Environment) {
        (function (SkyBoxType) {
            SkyBoxType[SkyBoxType["CloudyLightRays"] = 0] = "CloudyLightRays";
            SkyBoxType[SkyBoxType["night"] = 1] = "night";
            SkyBoxType[SkyBoxType["snow"] = 2] = "snow";
            SkyBoxType[SkyBoxType["TropicalSunnyDay"] = 3] = "TropicalSunnyDay";
        })(Environment.SkyBoxType || (Environment.SkyBoxType = {}));
        var SkyBoxType = Environment.SkyBoxType;
        var SkyBox = (function () {
            function SkyBox(name, scene) {
                this.name = name;
                this.scene = scene;
            }
            SkyBox.prototype.RenderSkyBox = function (type, gridSize, multiplier) {
                this.skyMesh = BABYLON.Mesh.CreateBox("skyBox", (gridSize * multiplier) * 1.5, this.scene);
                this.skyMesh.showBoundingBox = true;
                //Follow the camera position
                this.skyMesh.infiniteDistance = true;
                //Sky render after everything else
                this.skyMesh.renderingGroupId = 0;
                var filesPath = "";
                switch (type) {
                    case 0 /* CloudyLightRays */:
                        filesPath = "CloudyLightRays";
                        break;
                    case 1 /* night */:
                        filesPath = "night";
                        break;
                    case 2 /* snow */:
                        filesPath = "snow";
                        break;
                    case 3 /* TropicalSunnyDay */:
                        filesPath = "TropicalSunnyDay";
                        break;
                }
                var skyboxMaterial = new BABYLON.StandardMaterial("skyBox", this.scene);
                skyboxMaterial.backFaceCulling = false;
                skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture("Shaders/skybox/" + filesPath, this.scene);
                skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
                //The sun doesn't reflect on the sky
                skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
                skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
                this.skyMesh.material = skyboxMaterial;
            };
            SkyBox.prototype.GetMesh = function () {
                return this.skyMesh;
            };
            return SkyBox;
        })();
        Environment.SkyBox = SkyBox;
    })(Environment = Terrain.Environment || (Terrain.Environment = {}));
})(Terrain || (Terrain = {}));
