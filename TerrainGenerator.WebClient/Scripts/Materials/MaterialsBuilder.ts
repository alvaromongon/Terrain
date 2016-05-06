﻿module Terrain.Materials {

    export class MaterialsBuilder {

        //world
        //view
        //projection
        //worldView
        //worldViewProjection

        public static BuildTerrainMaterial(scene: BABYLON.Scene, sun: BABYLON.PointLight, skybox: Environment.SkyBox, maxMinHeight: number): BABYLON.ShaderMaterial {
            var groundMaterial = new BABYLON.ShaderMaterial("TerrainMaterial", scene, "/Assets/Terrain/terrainSimplified",
                {
                    needAlphaBlending: false,
                    attributes: ["position", "normal", "uv", "type"],
                    uniforms: ["worldViewProjection", "world", "view", "vLightPosition", "vEyePosition", "waterColor", "vLevels", "waveData", "windMatrix",
                        "groundMatrix", "sandMatrix", "rockMatrix", "snowMatrix", "grassMatrix", "blendMatrix", "vLimits", "vClipPlane"],
                    shaders: ["reflectionSampler", "refractionSampler", "bumpSampler", "groundSampler", "sandSampler", "rockSampler", "snowSampler",
                        "grassSampler", "blendSampler"]
                });

            var  bumpTexture = new BABYLON.Texture("/Assets/Terrain/bump.png", scene);
            bumpTexture.uScale = 2;
            bumpTexture.vScale = 2;
            bumpTexture.wrapU = BABYLON.Texture.MIRROR_ADDRESSMODE;
            bumpTexture.wrapV = BABYLON.Texture.MIRROR_ADDRESSMODE;

            var reflectionTexture = new BABYLON.MirrorTexture("reflection", 512, scene, true);
            var refractionTexture = new BABYLON.RenderTargetTexture("refraction", 512, scene, true);
            reflectionTexture.mirrorPlane = new BABYLON.Plane(0, -1, 0, 0);
            reflectionTexture.renderList.push(skybox.GetMesh());

            var waterColor = new BABYLON.Color3(0.0, 0.3, 0.1);
            var waterColorLevel = 0.2;
            var fresnelLevel = 1.0;
            var reflectionLevel = 0.6;
            var refractionLevel = 0.8;

            var waveLength = 0.1;
            var waveHeight = 0.15;

            var waterDirection = new BABYLON.Vector2(0, 1.0);

            var time = 0;

            var groundTexture = new BABYLON.Texture("/Assets/Terrain/ground.jpg", scene);
            groundTexture.uScale = 6.0;
            groundTexture.vScale = 6.0;

            var grassTexture = new BABYLON.Texture("/Assets/Terrain/grass.jpg", scene);
            grassTexture.uScale = 6.0;
            grassTexture.vScale = 6.0;

            var snowTexture = new BABYLON.Texture("/Assets/Terrain/snow.jpg", scene);
            snowTexture.uScale = 20.0;
            snowTexture.vScale = 20.0;

            var sandTexture = new BABYLON.Texture("/Assets/Terrain/sand.jpg", scene);
            sandTexture.uScale = 4.0;
            sandTexture.vScale = 4.0;

            var rockTexture = new BABYLON.Texture("/Assets/Terrain/rock.jpg", scene);
            rockTexture.uScale = 15.0;
            rockTexture.vScale = 15.0;

            var blendTexture = new BABYLON.Texture("/Assets/Terrain/blend.png", scene);
            blendTexture.uOffset = Math.random();
            blendTexture.vOffset = Math.random();
            blendTexture.wrapU = BABYLON.Texture.MIRROR_ADDRESSMODE;
            blendTexture.wrapV = BABYLON.Texture.MIRROR_ADDRESSMODE;

            var sandLimit = maxMinHeight * 0.02;
            var rockLimit = maxMinHeight * 0.50;
            var snowLimit = maxMinHeight * 0.70;            

            // Textures
            groundMaterial.setVector3("vLightPosition", sun.position);
            groundMaterial.setVector3("vEyePosition", scene.activeCamera.position);

            groundMaterial.setColor3("waterColor", waterColor);
            groundMaterial.setColor4("vLevels",new BABYLON.Color4(waterColorLevel, fresnelLevel, reflectionLevel, refractionLevel));
            groundMaterial.setVector2("waveData",new BABYLON.Vector2(waveLength, waveHeight));

            // Textures
            groundMaterial.setMatrix("windMatrix", bumpTexture.getTextureMatrix().multiply(BABYLON.Matrix.Translation(waterDirection.x * time, waterDirection.y * time, 0)));
            groundMaterial.setTexture("bumpSampler", bumpTexture);
            groundMaterial.setTexture("reflectionSampler", reflectionTexture);
            groundMaterial.setTexture("refractionSampler", refractionTexture);

            groundMaterial.setTexture("groundSampler", groundTexture);
            groundMaterial.setMatrix("groundMatrix", groundTexture.getTextureMatrix());

            groundMaterial.setTexture("sandSampler", sandTexture);
            groundMaterial.setMatrix("sandMatrix", sandTexture.getTextureMatrix());

            groundMaterial.setTexture("rockSampler", rockTexture);
            groundMaterial.setMatrix("rockMatrix", rockTexture.getTextureMatrix());

            groundMaterial.setTexture("snowSampler", snowTexture);
            groundMaterial.setMatrix("snowMatrix", snowTexture.getTextureMatrix());

            groundMaterial.setTexture("grassSampler", grassTexture);
            groundMaterial.setMatrix("grassMatrix", grassTexture.getTextureMatrix());

            groundMaterial.setTexture("blendSampler", blendTexture);
            groundMaterial.setMatrix("blendMatrix", blendTexture.getTextureMatrix());

            groundMaterial.setColor3("vLimits", new BABYLON.Color3(sandLimit, rockLimit, snowLimit));

            if (scene.clipPlane) {
                var clipPlane = scene.clipPlane;
                groundMaterial.setColor4("vClipPlane", new BABYLON.Color4(clipPlane.normal.x, clipPlane.normal.y, clipPlane.normal.z, clipPlane.d));
            }

            return groundMaterial;
        }

        public static BuildWaterMaterial(scene: BABYLON.Scene, sun: BABYLON.PointLight, skybox: Environment.SkyBox): BABYLON.ShaderMaterial {
            var waterMaterial = new BABYLON.ShaderMaterial("WaterMaterial", scene, "/Assets/Terrain/tester",
                {
                    needAlphaBlending: false,
                    attributes: ["position", "normal", "uv" ],//attributes: ["position", "normal", "uv"],
                    uniforms: ["worldViewProjection", "world", "waterColor", "windMatrix", "vEyePosition"],//uniforms: ["worldViewProjection", "world", "worldView", "view", "vEyePosition", "waterColor", "windMatrix"],
                    shaders: ["reflectionSampler", "refractionSampler", "bumpSampler"],
                });

            var bumpTexture = new BABYLON.Texture("/Assets/Terrain/bump.png", scene);
            bumpTexture.uScale = 2;
            bumpTexture.vScale = 2;
            bumpTexture.wrapU = BABYLON.Texture.MIRROR_ADDRESSMODE;
            bumpTexture.wrapV = BABYLON.Texture.MIRROR_ADDRESSMODE;

            var reflectionTexture = new BABYLON.MirrorTexture("reflection", 512, scene, true);
            reflectionTexture.mirrorPlane = new BABYLON.Plane(0, -1, 0, 0);
            reflectionTexture.renderList.push(skybox.GetMesh());

            var refractionTexture = new BABYLON.RenderTargetTexture("refraction", 512, scene, true);            

            var waterColor = new BABYLON.Color3(0.0, 0.3, 0.1);
            
            var waterDirection = new BABYLON.Vector2(0, 1.0);

            //Setting GLSL paramters
            //time += 0.0001 * scene.getAnimationRatio();

            waterMaterial.setVector3("vEyePosition", scene.activeCamera.position);

            waterMaterial.setColor3("waterColor", waterColor);

            // Textures
            waterMaterial.setMatrix("windMatrix", bumpTexture.getTextureMatrix().multiply(BABYLON.Matrix.Translation(waterDirection.x, waterDirection.y, 0)));
            waterMaterial.setTexture("bumpSampler", bumpTexture);
            waterMaterial.setTexture("reflectionSampler", reflectionTexture);
            waterMaterial.setTexture("refractionSampler", refractionTexture);

            return waterMaterial;
        }

    }

}