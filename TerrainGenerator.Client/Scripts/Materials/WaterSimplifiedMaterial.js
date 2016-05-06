var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Terrain;
(function (Terrain) {
    (function (Materials) {
        var WaterSimplifiedMaterial = (function (_super) {
            __extends(WaterSimplifiedMaterial, _super);
            function WaterSimplifiedMaterial(name, scene, light) {
                _super.call(this, name, scene);
                this.waveLength = 0.1;
                this.waveHeight = 0.15;
                this.time = 0;

                this.light = light;
                this.scene = scene;

                this.bumpTexture = new BABYLON.Texture("/Shaders/Terrain/tex1.jpg", scene);
                this.bumpTexture.uScale = 2;
                this.bumpTexture.vScale = 2;
                this.bumpTexture.wrapU = BABYLON.Texture.MIRROR_ADDRESSMODE;
                this.bumpTexture.wrapV = BABYLON.Texture.MIRROR_ADDRESSMODE;

                this.waveLength = 0.1;
                this.waveHeight = 0.15;

                this.time = 0;
            }
            WaterSimplifiedMaterial.prototype.isReady = function (mesh, useInstances) {
                var engine = this.scene.getEngine();

                if (this.bumpTexture && !this.bumpTexture.isReady) {
                    return false;
                }

                this._effect = engine.createEffect("/Shaders/Terrain/waterSimplified", ["position"], ["worldViewProjection", "resolution", "time"], ["tex"], "");

                if (!this._effect.isReady()) {
                    return false;
                }

                return true;
            };

            WaterSimplifiedMaterial.prototype.needAlphaBlending = function () {
                return false;
            };

            WaterSimplifiedMaterial.prototype.needAlphaTesting = function () {
                return false;
            };

            WaterSimplifiedMaterial.prototype.bind = function (world, mesh) {
                this.time += 0.0001 * this.scene.getAnimationRatio();

                this._effect.setMatrix("worldViewProjection", world.multiply(this.scene.getTransformMatrix()));
                this._effect.setFloat2("resolution", this.waveLength, this.waveHeight);
                this._effect.setFloat("time", this.time);

                // Textures
                this._effect.setTexture("tex", this.bumpTexture);
            };

            WaterSimplifiedMaterial.prototype.dispose = function (forceDisposeEffect) {
                if (this.bumpTexture) {
                    this.bumpTexture.dispose();
                }

                _super.prototype.dispose.call(this, forceDisposeEffect);
            };
            return WaterSimplifiedMaterial;
        })(BABYLON.Material);
        Materials.WaterSimplifiedMaterial = WaterSimplifiedMaterial;
    })(Terrain.Materials || (Terrain.Materials = {}));
    var Materials = Terrain.Materials;
})(Terrain || (Terrain = {}));
