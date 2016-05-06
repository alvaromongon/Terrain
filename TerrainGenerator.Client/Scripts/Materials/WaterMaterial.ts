module Terrain.Materials {

    export class WaterMaterial extends BABYLON.Material {

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

        constructor(name: string, scene: BABYLON.Scene, light: BABYLON.PointLight, skybox: Environment.SkyBox) {
            super(name, scene);

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

        public isReady(mesh?: BABYLON.AbstractMesh, useInstances?: boolean): boolean {
            var engine = this.scene.getEngine();

            if (this.bumpTexture && !this.bumpTexture.isReady) {
                return false;
            }

            this._effect = engine.createEffect("Shaders/Terrain/water",
                ["position", "normal", "uv"],
                ["worldViewProjection", "world", "view", "vEyePosition", "waterColor", "windMatrix", "waveData", "vLevels", "vLightPosition"],
                ["reflectionSampler", "refractionSampler", "bumpSampler"],
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

            super.dispose(forceDisposeEffect);
        }
    }

}