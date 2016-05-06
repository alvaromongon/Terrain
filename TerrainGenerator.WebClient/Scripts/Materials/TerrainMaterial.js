var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Terrain;
(function (Terrain) {
    var Materials;
    (function (Materials) {
        var TerrainMaterial = (function (_super) {
            __extends(TerrainMaterial, _super);
            function TerrainMaterial(name, scene, light, skybox, maxMinHeight) {
                var _this = this;
                _super.call(this, name, scene);
                this.waterColor = new BABYLON.Color3(0.0, 0.3, 0.1);
                this.waterColorLevel = 0.2;
                this.fresnelLevel = 1.0;
                this.reflectionLevel = 0.6;
                this.refractionLevel = 0.8;
                this.waveLength = 0.1;
                this.waveHeight = 0.15;
                this.waterDirection = new BABYLON.Vector2(0, 1.0);
                this.time = 0;
                this.getRenderTargetTextures = function () {
                    var array = new BABYLON.SmartArray(2);
                    array.push(_this.reflectionTexture);
                    array.push(_this.refractionTexture);
                    return array;
                };
                this.scene = scene;
                this.light = light;
                this.bumpTexture = new BABYLON.Texture("Assets/Terrain/bump.png", scene);
                this.bumpTexture.uScale = 2;
                this.bumpTexture.vScale = 2;
                this.bumpTexture.wrapU = BABYLON.Texture.MIRROR_ADDRESSMODE;
                this.bumpTexture.wrapV = BABYLON.Texture.MIRROR_ADDRESSMODE;
                this.reflectionTexture = new BABYLON.MirrorTexture("reflection", 512, scene, true);
                this.reflectionTexture.mirrorPlane = new BABYLON.Plane(0, -1, 0, 0);
                if (skybox) {
                    this.reflectionTexture.renderList.push(skybox.GetMesh());
                }
                this.refractionTexture = new BABYLON.RenderTargetTexture("refraction", 512, scene, true);
                this.waterColor = new BABYLON.Color3(0.0, 0.3, 0.1);
                this.waterColorLevel = 0.2;
                this.fresnelLevel = 1.0;
                this.reflectionLevel = 0.6;
                this.refractionLevel = 0.8;
                this.waveLength = 0.1;
                this.waveHeight = 0.15;
                this.waterDirection = new BABYLON.Vector2(0, 1.0);
                this.time = 0;
                this.groundTexture = new BABYLON.Texture("Assets/Terrain/ground.jpg", scene);
                this.groundTexture.uScale = 6.0;
                this.groundTexture.vScale = 6.0;
                this.grassTexture = new BABYLON.Texture("Assets/Terrain/grass.jpg", scene);
                this.grassTexture.uScale = 6.0;
                this.grassTexture.vScale = 6.0;
                this.snowTexture = new BABYLON.Texture("Assets/Terrain/snow.jpg", scene);
                this.snowTexture.uScale = 20.0;
                this.snowTexture.vScale = 20.0;
                this.sandTexture = new BABYLON.Texture("Assets/Terrain/sand.jpg", scene);
                this.sandTexture.uScale = 4.0;
                this.sandTexture.vScale = 4.0;
                this.rockTexture = new BABYLON.Texture("Assets/Terrain/rock.jpg", scene);
                this.rockTexture.uScale = 15.0;
                this.rockTexture.vScale = 15.0;
                this.blendTexture = new BABYLON.Texture("Assets/Terrain/blend.png", scene);
                this.blendTexture.uOffset = Math.random();
                this.blendTexture.vOffset = Math.random();
                this.blendTexture.wrapU = BABYLON.Texture.MIRROR_ADDRESSMODE; //BABYLON.Texture.MIRROR_ADDRESSMODE;
                this.blendTexture.wrapV = BABYLON.Texture.MIRROR_ADDRESSMODE; //BABYLON.Texture.MIRROR_ADDRESSMODE;
                this.blendTexture.anisotropicFilteringLevel = 1;
                this.sandLimit = maxMinHeight * 0.01;
                this.rockLimit = maxMinHeight * 0.50;
                this.snowLimit = maxMinHeight * 0.70;
                console.log("SandLimit: " + this.sandLimit + " - RockLimit: " + this.rockLimit + " - SnowLimit: " + this.snowLimit);
            }
            TerrainMaterial.prototype.isReady = function (mesh, useInstances) {
                var engine = this.scene.getEngine();
                if (this.bumpTexture && !this.bumpTexture.isReady) {
                    return false;
                }
                if (!this.groundTexture.isReady) {
                    return false;
                }
                if (!this.snowTexture.isReady) {
                    return false;
                }
                if (!this.sandTexture.isReady) {
                    return false;
                }
                if (!this.rockTexture.isReady) {
                    return false;
                }
                if (!this.grassTexture.isReady) {
                    return false;
                }
                var defines = [];
                if (this.scene.clipPlane) {
                    defines.push("#define CLIPPLANE");
                }
                this._effect = engine.createEffect("Shaders/terrain", ["position", "normal", "uv", "type"], ["worldViewProjection", "world", "view", "vLightPosition", "vEyePosition", "waterColor", "windMatrix",
                    "groundMatrix", "sandMatrix", "rockMatrix", "snowMatrix", "grassMatrix", "blendMatrix", "vLimits", "vClipPlane", "waveData", "vLevels"], ["reflectionSampler", "refractionSampler", "bumpSampler", "groundSampler", "sandSampler", "rockSampler", "snowSampler",
                    "grassSampler", "blendSampler"], "");
                if (!this._effect.isReady()) {
                    return false;
                }
                return true;
            };
            TerrainMaterial.prototype.AddToRefractionRenderListRange = function (elementsToAdd) {
                if (elementsToAdd) {
                    var element;
                    for (element in elementsToAdd) {
                        this.AddToRefractionRenderList(element);
                    }
                }
            };
            TerrainMaterial.prototype.AddToRefractionRenderList = function (elementToAdd) {
                if (elementToAdd) {
                    this.refractionTexture.renderList.push(elementToAdd);
                }
            };
            TerrainMaterial.prototype.AddToReflectionRenderListRange = function (elementsToAdd) {
                var _this = this;
                if (elementsToAdd) {
                    elementsToAdd.forEach(function (element) { return _this.reflectionTexture.renderList.push(element); });
                }
            };
            TerrainMaterial.prototype.needAlphaBlending = function () {
                return false;
            };
            TerrainMaterial.prototype.needAlphaTesting = function () {
                return false;
            };
            // This run every render
            TerrainMaterial.prototype.bind = function (world, mesh) {
                this.time += 0.0001 * this.scene.getAnimationRatio();
                this._effect.setMatrix("world", world);
                // [View To Projection]x[World To View]x[Model to World]=[ModelViewProjectionMatrix].
                this._effect.setMatrix("worldViewProjection", world.multiply(this.scene.getTransformMatrix()));
                this._effect.setVector3("vLightPosition", this.light.position);
                this._effect.setVector3("vEyePosition", this.scene.activeCamera.position);
                this._effect.setColor3("waterColor", this.waterColor);
                this._effect.setFloat4("vLevels", this.waterColorLevel, this.fresnelLevel, this.reflectionLevel, this.refractionLevel);
                this._effect.setFloat2("waveData", this.waveLength, this.waveHeight);
                // Textures
                this._effect.setMatrix("windMatrix", this.bumpTexture.getTextureMatrix().multiply(BABYLON.Matrix.Translation(this.waterDirection.x * this.time, this.waterDirection.y * this.time, 0)));
                this._effect.setTexture("bumpSampler", this.bumpTexture);
                this._effect.setTexture("reflectionSampler", this.reflectionTexture);
                this._effect.setTexture("refractionSampler", this.refractionTexture);
                this._effect.setTexture("groundSampler", this.groundTexture);
                this._effect.setMatrix("groundMatrix", this.groundTexture.getTextureMatrix());
                this._effect.setTexture("sandSampler", this.sandTexture);
                this._effect.setMatrix("sandMatrix", this.sandTexture.getTextureMatrix());
                this._effect.setTexture("rockSampler", this.rockTexture);
                this._effect.setMatrix("rockMatrix", this.rockTexture.getTextureMatrix());
                this._effect.setTexture("snowSampler", this.snowTexture);
                this._effect.setMatrix("snowMatrix", this.snowTexture.getTextureMatrix());
                this._effect.setTexture("grassSampler", this.grassTexture);
                this._effect.setMatrix("grassMatrix", this.grassTexture.getTextureMatrix());
                this._effect.setTexture("blendSampler", this.blendTexture);
                this._effect.setMatrix("blendMatrix", this.blendTexture.getTextureMatrix());
                this._effect.setFloat3("vLimits", this.sandLimit, this.rockLimit, this.snowLimit);
                if (this.scene.clipPlane) {
                    var clipPlane = this.scene.clipPlane;
                    this._effect.setFloat4("vClipPlane", clipPlane.normal.x, clipPlane.normal.y, clipPlane.normal.z, clipPlane.d);
                }
            };
            TerrainMaterial.prototype.dispose = function (forceDisposeEffect) {
                if (this.bumpTexture) {
                    this.bumpTexture.dispose();
                }
                if (this.reflectionTexture) {
                    this.reflectionTexture.dispose();
                }
                if (this.refractionTexture) {
                    this.refractionTexture.dispose();
                }
                if (this.grassTexture) {
                    this.grassTexture.dispose();
                }
                if (this.groundTexture) {
                    this.groundTexture.dispose();
                }
                if (this.snowTexture) {
                    this.snowTexture.dispose();
                }
                if (this.sandTexture) {
                    this.sandTexture.dispose();
                }
                if (this.rockTexture) {
                    this.rockTexture.dispose();
                }
                _super.prototype.dispose.call(this, forceDisposeEffect);
            };
            return TerrainMaterial;
        })(BABYLON.Material);
        Materials.TerrainMaterial = TerrainMaterial;
    })(Materials = Terrain.Materials || (Terrain.Materials = {}));
})(Terrain || (Terrain = {}));
//# sourceMappingURL=TerrainMaterial.js.map