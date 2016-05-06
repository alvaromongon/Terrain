var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Terrain;
(function (Terrain) {
    (function (Materials) {
        var GroundMaterial = (function (_super) {
            __extends(GroundMaterial, _super);
            function GroundMaterial(name, scene, light, maxMinHeight) {
                _super.call(this, name, scene);

                this.scene = scene;
                this.light = light;

                this.waterTexture = new BABYLON.Texture("/Shaders/Water/bump.png", scene);
                this.waterTexture.uScale = 2.0;
                this.waterTexture.vScale = 2.0;
                this.waterTexture.wrapU = BABYLON.Texture.MIRROR_ADDRESSMODE;
                this.waterTexture.wrapV = BABYLON.Texture.MIRROR_ADDRESSMODE;

                this.groundTexture = new BABYLON.Texture("/Shaders/Ground/ground.jpg", scene);
                this.groundTexture.uScale = 6.0;
                this.groundTexture.vScale = 6.0;

                this.grassTexture = new BABYLON.Texture("/Shaders/Ground/grass.jpg", scene);
                this.grassTexture.uScale = 6.0;
                this.grassTexture.vScale = 6.0;

                this.snowTexture = new BABYLON.Texture("/Shaders/Ground/snow.jpg", scene);
                this.snowTexture.uScale = 20.0;
                this.snowTexture.vScale = 20.0;

                this.sandTexture = new BABYLON.Texture("/Shaders/Ground/sand.jpg", scene);
                this.sandTexture.uScale = 4.0;
                this.sandTexture.vScale = 4.0;

                this.rockTexture = new BABYLON.Texture("/Shaders/Ground/rock.jpg", scene);
                this.rockTexture.uScale = 15.0;
                this.rockTexture.vScale = 15.0;

                this.blendTexture = new BABYLON.Texture("/Shaders/Ground/blend.png", scene);
                this.blendTexture.uOffset = Math.random();
                this.blendTexture.vOffset = Math.random();
                this.blendTexture.wrapU = BABYLON.Texture.MIRROR_ADDRESSMODE;
                this.blendTexture.wrapV = BABYLON.Texture.MIRROR_ADDRESSMODE;

                this.sandLimit = maxMinHeight * 0.02; //5; //1;
                this.rockLimit = maxMinHeight * 0.50; //5;
                this.snowLimit = maxMinHeight * 0.70; // 45; //8;

                console.log("SandLimit: " + this.sandLimit + " - RockLimit: " + this.rockLimit + " - SnowLimit: " + this.snowLimit);
            }
            GroundMaterial.prototype.isReady = function (mesh, useInstances) {
                var engine = this.scene.getEngine();

                if (!this.waterTexture.isReady)
                    return false;
                if (!this.groundTexture.isReady)
                    return false;
                if (!this.snowTexture.isReady)
                    return false;
                if (!this.sandTexture.isReady)
                    return false;
                if (!this.rockTexture.isReady)
                    return false;
                if (!this.grassTexture.isReady)
                    return false;

                var defines = [];
                if (this.scene.clipPlane) {
                    defines.push("#define CLIPPLANE");
                }

                var join = defines.join("\n");

                this._effect = engine.createEffect("/Shaders/Ground/ground", ["position", "normal", "uv", "type"], ["worldViewProjection", "waterMatrix", "groundMatrix", "sandMatrix", "rockMatrix", "snowMatrix", "grassMatrix", "blendMatrix", "world", "vLightPosition", "vLimits", "vClipPlane"], ["waterSampler", "groundSampler", "sandSampler", "rockSampler", "snowSampler", "grassSampler", "blendSampler"], join);

                if (!this._effect.isReady()) {
                    return false;
                }

                return true;
            };

            GroundMaterial.prototype.needAlphaBlending = function () {
                return false;
            };

            GroundMaterial.prototype.needAlphaTesting = function () {
                return false;
            };

            GroundMaterial.prototype.bind = function (world, mesh) {
                this._effect.setMatrix("world", world);
                this._effect.setMatrix("worldViewProjection", world.multiply(this.scene.getTransformMatrix()));
                this._effect.setVector3("vLightPosition", this.light.position);

                // Textures
                if (this.waterTexture) {
                    this._effect.setTexture("waterSampler", this.waterTexture);
                    this._effect.setMatrix("waterMatrix", this.waterTexture.getTextureMatrix());
                }

                if (this.groundTexture) {
                    this._effect.setTexture("groundSampler", this.groundTexture);
                    this._effect.setMatrix("groundMatrix", this.groundTexture.getTextureMatrix());
                }

                if (this.sandTexture) {
                    this._effect.setTexture("sandSampler", this.sandTexture);
                    this._effect.setMatrix("sandMatrix", this.sandTexture.getTextureMatrix());
                }

                if (this.rockTexture) {
                    this._effect.setTexture("rockSampler", this.rockTexture);
                    this._effect.setMatrix("rockMatrix", this.rockTexture.getTextureMatrix());
                }

                if (this.snowTexture) {
                    this._effect.setTexture("snowSampler", this.snowTexture);
                    this._effect.setMatrix("snowMatrix", this.snowTexture.getTextureMatrix());
                }

                if (this.grassTexture) {
                    this._effect.setTexture("grassSampler", this.grassTexture);
                    this._effect.setMatrix("grassMatrix", this.grassTexture.getTextureMatrix());
                }

                if (this.blendTexture) {
                    this._effect.setTexture("blendSampler", this.blendTexture);
                    this._effect.setMatrix("blendMatrix", this.blendTexture.getTextureMatrix());
                }

                this._effect.setFloat3("vLimits", this.sandLimit, this.rockLimit, this.snowLimit);

                if (this.scene.clipPlane) {
                    var clipPlane = this.scene.clipPlane;
                    this._effect.setFloat4("vClipPlane", clipPlane.normal.x, clipPlane.normal.y, clipPlane.normal.z, clipPlane.d);
                }
            };

            GroundMaterial.prototype.dispose = function (forceDisposeEffect) {
                if (this.waterTexture) {
                    this.waterTexture.dispose();
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
            return GroundMaterial;
        })(BABYLON.Material);
        Materials.GroundMaterial = GroundMaterial;
    })(Terrain.Materials || (Terrain.Materials = {}));
    var Materials = Terrain.Materials;
})(Terrain || (Terrain = {}));
//# sourceMappingURL=GroundMaterial.js.map
