var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Terrain;
(function (Terrain) {
    var Materials;
    (function (Materials) {
        var WaterMaterial = (function (_super) {
            __extends(WaterMaterial, _super);
            function WaterMaterial(name, scene, light, skybox) {
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
                this.light = light;
                this.scene = scene;
                this.bumpTexture = new BABYLON.Texture("Shaders/Terrain/bump.png", scene);
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
            }
            WaterMaterial.prototype.isReady = function (mesh, useInstances) {
                var engine = this.scene.getEngine();
                if (this.bumpTexture && !this.bumpTexture.isReady) {
                    return false;
                }
                this._effect = engine.createEffect("Shaders/Terrain/water", ["position", "normal", "uv"], ["worldViewProjection", "world", "view", "vEyePosition", "waterColor", "windMatrix", "waveData", "vLevels", "vLightPosition"], ["reflectionSampler", "refractionSampler", "bumpSampler"], "");
                if (!this._effect.isReady()) {
                    return false;
                }
                return true;
            };
            WaterMaterial.prototype.AddToReflectionRenderListRange = function (elementsToAdd) {
                var _this = this;
                if (elementsToAdd) {
                    elementsToAdd.forEach(function (element) { return _this.reflectionTexture.renderList.push(element); });
                }
            };
            WaterMaterial.prototype.AddToRefractionRenderList = function (elementToAdd) {
                if (elementToAdd) {
                    this.refractionTexture.renderList.push(elementToAdd);
                }
            };
            WaterMaterial.prototype.needAlphaBlending = function () {
                return false;
            };
            WaterMaterial.prototype.needAlphaTesting = function () {
                return false;
            };
            WaterMaterial.prototype.bind = function (world, mesh) {
                this.time += 0.0001 * this.scene.getAnimationRatio();
                this._effect.setMatrix("world", world);
                this._effect.setMatrix("worldViewProjection", world.multiply(this.scene.getTransformMatrix()));
                this._effect.setVector3("vEyePosition", this.scene.activeCamera.position);
                this._effect.setVector3("vLightPosition", this.light.position);
                this._effect.setColor3("waterColor", this.waterColor);
                this._effect.setFloat4("vLevels", this.waterColorLevel, this.fresnelLevel, this.reflectionLevel, this.refractionLevel);
                this._effect.setFloat2("waveData", this.waveLength, this.waveHeight);
                // Textures        
                this._effect.setMatrix("windMatrix", this.bumpTexture.getTextureMatrix().multiply(BABYLON.Matrix.Translation(this.waterDirection.x * this.time, this.waterDirection.y * this.time, 0)));
                this._effect.setTexture("bumpSampler", this.bumpTexture);
                this._effect.setTexture("reflectionSampler", this.reflectionTexture);
                this._effect.setTexture("refractionSampler", this.refractionTexture);
            };
            WaterMaterial.prototype.dispose = function (forceDisposeEffect) {
                if (this.bumpTexture) {
                    this.bumpTexture.dispose();
                }
                if (this.reflectionTexture) {
                    this.reflectionTexture.dispose();
                }
                if (this.refractionTexture) {
                    this.refractionTexture.dispose();
                }
                _super.prototype.dispose.call(this, forceDisposeEffect);
            };
            return WaterMaterial;
        })(BABYLON.Material);
        Materials.WaterMaterial = WaterMaterial;
    })(Materials = Terrain.Materials || (Terrain.Materials = {}));
})(Terrain || (Terrain = {}));
