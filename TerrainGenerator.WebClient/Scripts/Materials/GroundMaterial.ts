module Terrain.Materials {

    export class GroundMaterial extends BABYLON.Material {

        private scene: BABYLON.Scene;
        private light: BABYLON.PointLight;

        private waterTexture: BABYLON.Texture;
        private groundTexture: BABYLON.Texture;
        private grassTexture: BABYLON.Texture;
        private snowTexture: BABYLON.Texture;
        private sandTexture: BABYLON.Texture;
        private rockTexture: BABYLON.Texture;
        private blendTexture: BABYLON.Texture;

        private sandLimit: number;
        private rockLimit: number;
        private snowLimit: number;

        constructor(name: string, scene: BABYLON.Scene, light: BABYLON.PointLight, maxMinHeight: number) {
            super(name, scene);

            this.scene = scene;
            this.light = light;

            this.waterTexture = new BABYLON.Texture("/Assets/Water/bump.png", scene);
            this.waterTexture.uScale = 2.0;
            this.waterTexture.vScale = 2.0;
            this.waterTexture.wrapU = BABYLON.Texture.MIRROR_ADDRESSMODE;
            this.waterTexture.wrapV = BABYLON.Texture.MIRROR_ADDRESSMODE;

            this.groundTexture = new BABYLON.Texture("/Assets/Ground/ground.jpg", scene);
            this.groundTexture.uScale = 6.0;
            this.groundTexture.vScale = 6.0;

            this.grassTexture = new BABYLON.Texture("/Assets/Ground/grass.jpg", scene);
            this.grassTexture.uScale = 6.0;
            this.grassTexture.vScale = 6.0;

            this.snowTexture = new BABYLON.Texture("/Assets/Ground/snow.jpg", scene);
            this.snowTexture.uScale = 20.0;
            this.snowTexture.vScale = 20.0;

            this.sandTexture = new BABYLON.Texture("/Assets/Ground/sand.jpg", scene);
            this.sandTexture.uScale = 4.0;
            this.sandTexture.vScale = 4.0;

            this.rockTexture = new BABYLON.Texture("/Assets/Ground/rock.jpg", scene);
            this.rockTexture.uScale = 15.0;
            this.rockTexture.vScale = 15.0;

            this.blendTexture = new BABYLON.Texture("/Assets/Ground/blend.png", scene);
            this.blendTexture.uOffset = Math.random();
            this.blendTexture.vOffset = Math.random();
            this.blendTexture.wrapU = BABYLON.Texture.MIRROR_ADDRESSMODE;
            this.blendTexture.wrapV = BABYLON.Texture.MIRROR_ADDRESSMODE;


            this.sandLimit = maxMinHeight * 0.02;//5; //1;
            this.rockLimit = maxMinHeight * 0.50;//5;
            this.snowLimit = maxMinHeight * 0.70;// 45; //8;

            console.log("SandLimit: " + this.sandLimit + " - RockLimit: " + this.rockLimit + " - SnowLimit: " + this.snowLimit);
        }

        public isReady(mesh?: BABYLON.AbstractMesh, useInstances?: boolean): boolean {
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

            this._effect = engine.createEffect("/Assets/Ground/ground",
                ["position", "normal", "uv", "type"],
                ["worldViewProjection", "waterMatrix", "groundMatrix", "sandMatrix", "rockMatrix", "snowMatrix", "grassMatrix", "blendMatrix", "world", "vLightPosition", "vLimits", "vClipPlane"],
                ["waterSampler", "groundSampler", "sandSampler", "rockSampler", "snowSampler", "grassSampler", "blendSampler"],
                join);

            if (!this._effect.isReady()) {
                return false;
            }

            return true;
        }

        public needAlphaBlending(): boolean {
            return false;
        }

        public needAlphaTesting(): boolean {
            return false;
        }

        public bind(world: BABYLON.Matrix, mesh: BABYLON.Mesh): void {
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
        }

        public dispose(forceDisposeEffect?: boolean): void {
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

            super.dispose(forceDisposeEffect);
        }
    }

}