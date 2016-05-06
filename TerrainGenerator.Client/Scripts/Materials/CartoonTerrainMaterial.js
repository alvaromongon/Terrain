var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Terrain;
(function (Terrain) {
    (function (Materials) {
        var CartoonTerrainMaterial = (function (_super) {
            __extends(CartoonTerrainMaterial, _super);
            function CartoonTerrainMaterial(name, scene, light, skybox, maxMinHeight) {
                var _this = this;
                _super.call(this, name, scene);
                this.waterColor = new BABYLON.Color3(0.0, 0.3, 0.1);
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

                this.bumpTexture = new BABYLON.Texture("/Shaders/Terrain/bump.png", scene);
                this.bumpTexture.uScale = 2;
                this.bumpTexture.vScale = 2;
                this.bumpTexture.wrapU = BABYLON.Texture.MIRROR_ADDRESSMODE;
                this.bumpTexture.wrapV = BABYLON.Texture.MIRROR_ADDRESSMODE;

                this.reflectionTexture = new BABYLON.MirrorTexture("reflection", 512, scene, true);
                this.refractionTexture = new BABYLON.RenderTargetTexture("refraction", 512, scene, true);
                this.reflectionTexture.mirrorPlane = new BABYLON.Plane(0, -1, 0, 0);
                this.reflectionTexture.renderList.push(skybox.GetMesh());

                this.waterColor = new BABYLON.Color3(0.0, 0.3, 0.1);

                this.waterDirection = new BABYLON.Vector2(0, 1.0);

                this.time = 0;

                this.sandLimit = maxMinHeight * 0.01;
                this.rockLimit = maxMinHeight * 0.50;
                this.snowLimit = maxMinHeight * 0.70;

                console.log("SandLimit: " + this.sandLimit + " - RockLimit: " + this.rockLimit + " - SnowLimit: " + this.snowLimit);
            }
            CartoonTerrainMaterial.prototype.isReady = function (mesh, useInstances) {
                var engine = this.scene.getEngine();

                if (this.bumpTexture && !this.bumpTexture.isReady) {
                    return false;
                }

                var defines = [];
                if (this.scene.clipPlane) {
                    defines.push("#define CLIPPLANE");
                }

                this._effect = engine.createEffect("/Shaders/Terrain/tester", ["position", "normal", "uv", "type"], ["worldViewProjection", "world", "view", "vLightPosition", "vEyePosition", "waterColor", "windMatrix", "vLimits", "vClipPlane"], ["reflectionSampler", "refractionSampler", "bumpSampler"], "");

                if (!this._effect.isReady()) {
                    return false;
                }

                return true;
            };

            CartoonTerrainMaterial.prototype.AddToRenderListRange = function (elementsToAdd) {
                var _this = this;
                if (elementsToAdd) {
                    elementsToAdd.forEach(function (item) {
                        return _this.refractionTexture.renderList.push(item);
                    });
                }
            };

            CartoonTerrainMaterial.prototype.AddToRenderList = function (elementToAdd) {
                if (elementToAdd) {
                    this.refractionTexture.renderList.push(elementToAdd);
                }
            };

            CartoonTerrainMaterial.prototype.needAlphaBlending = function () {
                return false;
            };

            CartoonTerrainMaterial.prototype.needAlphaTesting = function () {
                return false;
            };

            CartoonTerrainMaterial.prototype.bind = function (world, mesh) {
                this.time += 0.0001 * this.scene.getAnimationRatio();

                this._effect.setMatrix("world", world);
                this._effect.setMatrix("worldViewProjection", world.multiply(this.scene.getTransformMatrix()));
                this._effect.setVector3("vLightPosition", this.light.position);
                this._effect.setVector3("vEyePosition", this.scene.activeCamera.position);

                this._effect.setColor3("waterColor", this.waterColor);

                // Textures
                this._effect.setMatrix("windMatrix", this.bumpTexture.getTextureMatrix().multiply(BABYLON.Matrix.Translation(this.waterDirection.x * this.time, this.waterDirection.y * this.time, 0)));
                this._effect.setTexture("bumpSampler", this.bumpTexture);
                this._effect.setTexture("reflectionSampler", this.reflectionTexture);
                this._effect.setTexture("refractionSampler", this.refractionTexture);

                this._effect.setFloat3("vLimits", this.sandLimit, this.rockLimit, this.snowLimit);

                if (this.scene.clipPlane) {
                    var clipPlane = this.scene.clipPlane;
                    this._effect.setFloat4("vClipPlane", clipPlane.normal.x, clipPlane.normal.y, clipPlane.normal.z, clipPlane.d);
                }
            };

            CartoonTerrainMaterial.prototype.dispose = function (forceDisposeEffect) {
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
            return CartoonTerrainMaterial;
        })(BABYLON.Material);
        Materials.CartoonTerrainMaterial = CartoonTerrainMaterial;
    })(Terrain.Materials || (Terrain.Materials = {}));
    var Materials = Terrain.Materials;
})(Terrain || (Terrain = {}));
