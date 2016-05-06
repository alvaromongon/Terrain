module Terrain.Materials {

    export class TerrainMaterial extends BABYLON.Material {

        private scene: BABYLON.Scene;
        private light: BABYLON.PointLight;

        private bumpTexture: BABYLON.Texture;
        public reflectionTexture: BABYLON.MirrorTexture;
        public refractionTexture: BABYLON.RenderTargetTexture;

        private waterColor: BABYLON.Color3 = new BABYLON.Color3(0.0, 0.3, 0.1);

        private waterColorLevel: number = 0.2;
        private fresnelLevel: number = 1.0;
        private reflectionLevel: number = 0.6;
        private refractionLevel: number = 0.8;

        private waveLength: number = 0.1;
        private waveHeight: number = 0.15;

        private waterDirection: BABYLON.Vector2 = new BABYLON.Vector2(0, 1.0);

        private time: number = 0;

        private groundTexture: BABYLON.Texture;
        private grassTexture: BABYLON.Texture;
        private snowTexture: BABYLON.Texture;
        private sandTexture: BABYLON.Texture;
        private rockTexture: BABYLON.Texture;
        private blendTexture: BABYLON.Texture;

        private sandLimit: number;
        private rockLimit: number;
        private snowLimit: number;

        constructor(name: string, scene: BABYLON.Scene, light: BABYLON.PointLight, skybox: Environment.SkyBox, maxMinHeight: number) {
            super(name, scene);

            this.scene = scene;
            this.light = light;

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


            this.groundTexture = new BABYLON.Texture("Shaders/Terrain/ground.jpg", scene);
            this.groundTexture.uScale = 6.0;
            this.groundTexture.vScale = 6.0;

            this.grassTexture = new BABYLON.Texture("Shaders/Terrain/grass.jpg", scene);
            this.grassTexture.uScale = 6.0;
            this.grassTexture.vScale = 6.0;

            this.snowTexture = new BABYLON.Texture("Shaders/Terrain/snow.jpg", scene);
            this.snowTexture.uScale = 20.0;
            this.snowTexture.vScale = 20.0;

            this.sandTexture = new BABYLON.Texture("Shaders/Terrain/sand.jpg", scene);
            this.sandTexture.uScale = 4.0;
            this.sandTexture.vScale = 4.0;

            this.rockTexture = new BABYLON.Texture("Shaders/Terrain/rock.jpg", scene);
            this.rockTexture.uScale = 15.0;
            this.rockTexture.vScale = 15.0;

            this.blendTexture = new BABYLON.Texture("Shaders/Terrain/blend.png", scene);
            this.blendTexture.uOffset = Math.random();
            this.blendTexture.vOffset = Math.random();
            this.blendTexture.wrapU = BABYLON.Texture.MIRROR_ADDRESSMODE;
            this.blendTexture.wrapV = BABYLON.Texture.MIRROR_ADDRESSMODE;

            this.sandLimit = maxMinHeight * 0.01;
            this.rockLimit = maxMinHeight * 0.50;
            this.snowLimit = maxMinHeight * 0.70;

            console.log("SandLimit: " + this.sandLimit + " - RockLimit: " + this.rockLimit + " - SnowLimit: " + this.snowLimit);
        }

        public isReady(mesh?: BABYLON.AbstractMesh, useInstances?: boolean): boolean {
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

            this._effect = engine.createEffect("Shaders/Terrain/terrain",
                ["position", "normal", "uv", "type"],
                ["worldViewProjection", "world", "view", "vLightPosition", "vEyePosition", "waterColor", "windMatrix",
                    "groundMatrix", "sandMatrix", "rockMatrix", "snowMatrix", "grassMatrix", "blendMatrix", "vLimits", "vClipPlane", "waveData", "vLevels"],
                ["reflectionSampler", "refractionSampler", "bumpSampler", "groundSampler", "sandSampler", "rockSampler", "snowSampler",
                    "grassSampler", "blendSampler"],
                "");

            if (!this._effect.isReady()) {
                return false;
            }

            return true;
        }

        public getRenderTargetTextures = () => {
            var array = new BABYLON.SmartArray<BABYLON.RenderTargetTexture>(2);

            array.push(this.reflectionTexture);
            array.push(this.refractionTexture);

            return array;
        }

        public AddToRenderListRange(elementsToAdd: Array<BABYLON.AbstractMesh>): void {
            if (elementsToAdd) {
                var element;
                for (element in elementsToAdd) {
                    this.refractionTexture.renderList.push(element);
                }
            }
        }

        public AddToReflectionRenderListRange(elementsToAdd: Array<BABYLON.AbstractMesh>): void {
            if (elementsToAdd) {
                elementsToAdd.forEach(element => this.reflectionTexture.renderList.push(element));
            }
        }

        public AddToRefractionRenderList(elementToAdd: BABYLON.AbstractMesh): void {
            if (elementToAdd) {
                this.refractionTexture.renderList.push(elementToAdd);
            }
        }

        public needAlphaBlending(): boolean {
            return false;
        }

        public needAlphaTesting(): boolean {
            return false;
        }

        public bind(world: BABYLON.Matrix, mesh: BABYLON.Mesh): void {
            this.time += 0.0001 * this.scene.getAnimationRatio();

            this._effect.setMatrix("world", world);
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
        }

        public dispose(forceDisposeEffect?: boolean): void {
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

            super.dispose(forceDisposeEffect);
        }
    }

}