var Terrain;
(function (Terrain) {
    var EngineLoader = (function () {
        function EngineLoader(canvas, miniMap, divMessage, fps, currentPositionTerrainAltitude, onEngineLoaded) {
            this.firstTimeLoad = true;
            this.canvas = canvas;
            this.miniMap = miniMap;
            this.message = divMessage;
            this.fps = fps;
            this.currentPositionTerrainAltitude = currentPositionTerrainAltitude;
            this.firstTimeLoad = true;
            this.onEngineLoaded = onEngineLoaded;
            EngineLoader.Instance = this;
        }
        EngineLoader.prototype.Start = function (systemConfiguration) {
            this.BuildEngine();
            window.onresize = function () {
                Terrain.EngineLoader.Instance.engine.resize();
            };
            // Initialize sounds
            Terrain.Sounds.SoundsContainer.Initialize(this.scene);
            // Initialize models
            Terrain.Models.ModelsContainerManager.Initialize(this.scene);
            // Set rules
            Terrain.Actions.ActionsQueue.GetInstance().SetRules(systemConfiguration.Rules);
            // Initialize synchronizer
            Terrain.Synchronizer.SynchronizerManager.Initialize(null);
            // Initilize cameras
            Terrain.UI.CameraManager.Initialize(this.canvas, this.scene, systemConfiguration);
            // Initialize UI events
            Terrain.UI.UiManager.Initialize(this.canvas, this.scene);
            this.InitializeScene(systemConfiguration);
        };
        EngineLoader.prototype.DebugMode = function () {
            if (this.scene.debugLayer.isVisible()) {
                this.scene.debugLayer.hide();
            }
            else {
                this.scene.debugLayer.show();
            }
        };
        EngineLoader.prototype.BuildEngine = function () {
            BABYLON.Engine.ShadersRepository = "";
            this.engine = new BABYLON.Engine(this.canvas);
            this.scene = new BABYLON.Scene(this.engine);
        };
        EngineLoader.prototype.InitializeScene = function (systemConfiguration) {
            var _this = this;
            this.scene.collisionsEnabled = true;
            //this.scene.fogMode = BABYLON.Scene.FOGMODE_EXP;
            //this.scene.fogDensity = 0.02;
            //this.scene.fogColor = this.scene.clearColor;            
            this.sun = new BABYLON.PointLight("Sun", new BABYLON.Vector3(0, systemConfiguration.MaxMinHeight * 1.5, 0), this.scene);
            this.shelfLevel = systemConfiguration.ShelfLevel;
            this.maxTerrainAltitudeInMeters = systemConfiguration.MaxTerrainAltitudeInMeters;
            this.skybox = new Terrain.Environment.SkyBox("skyBox", this.scene);
            this.skybox.RenderSkyBox(Terrain.Environment.SkyBoxType.TropicalSunnyDay, systemConfiguration.GridSize, systemConfiguration.TilesMatrixSideSize);
            var terrainMaterialTemp = new Terrain.Materials.TerrainMaterial("terrain", this.scene, this.sun, this.skybox, systemConfiguration.MaxMinHeight);
            terrainMaterialTemp.AddToRefractionRenderList(this.skybox.GetMesh());
            this.terrainMaterial = terrainMaterialTemp;
            var waterMaterialTemp = new Terrain.Materials.WaterMaterial("water", this.scene, this.sun, this.skybox);
            waterMaterialTemp.AddToRefractionRenderList(this.skybox.GetMesh());
            this.waterMaterial = waterMaterialTemp;
            if (this.waterMaterial) {
                this.water = new Terrain.Environment.Water("water", this.scene, this.waterMaterial);
                this.water.Render(systemConfiguration.GridSize, systemConfiguration.TilesMatrixSideSize);
            }
            if (this.terrainMaterial) {
                Terrain.Tiles.TilesManager.InitializeInstance(this.scene, this.sun, this.terrainMaterial, systemConfiguration.TileSize, systemConfiguration.GridSize, systemConfiguration.TilesMatrixSideSize, systemConfiguration.TilePosition.NorthLalitude, systemConfiguration.TilePosition.WestLongitude, systemConfiguration.MaxMinHeight, this.miniMap);
                var halfSizeGrid = systemConfiguration.GridSize / 2;
                this.maxX = halfSizeGrid;
                this.minX = -halfSizeGrid;
                this.maxZ = halfSizeGrid;
                this.minZ = -halfSizeGrid;
            }
            var activeCameraPosition = Terrain.UI.CameraManager.GetInstance().GetActiveCameraTilePosition();
            Terrain.Tiles.TilesManager.GetInstance().LoadNeededData(new BABYLON.Vector2(activeCameraPosition.x, activeCameraPosition.z));
            this.scene.registerBeforeRender(this.OnBeforeRender);
            this.scene.executeWhenReady(function () {
                _this.scene.activeCamera.attachControl(_this.canvas);
                _this.engine.runRenderLoop(_this.OnRender);
                if (systemConfiguration.FirstUse) {
                    Terrain.UI.UiManager.GetInstance().InitiateFirstUseHelper(systemConfiguration.MaxMinHeight);
                }
            });
        };
        EngineLoader.prototype.OnBeforeRender = function () {
            if (EngineLoader.Instance.scene.activeCamera) {
                var activeCameraTilePosition = Terrain.UI.CameraManager.GetInstance().GetActiveCameraTilePosition();
                var activeCameraMiniMapPosition = Terrain.UI.CameraManager.GetInstance().GetActiveCameraMiniMapPosition();
                EngineLoader.Instance.currentAltitude = Terrain.Tiles.TilesManager.GetInstance().GetPositonAltitude(new BABYLON.Vector2(activeCameraTilePosition.x, activeCameraTilePosition.z));
                Terrain.UI.CameraManager.GetInstance().UpdateActiveCamera();
                //Check if we need to update the tiles                
                var tempCenterPosition = Terrain.Tiles.TilesManager.GetInstance().LoadNeededData(new BABYLON.Vector2(activeCameraTilePosition.x, activeCameraTilePosition.z));
                if (tempCenterPosition) {
                    EngineLoader.Instance.centerPosition = tempCenterPosition;
                }
                //Water position depends on center tile position
                if (EngineLoader.Instance.centerPosition != null && EngineLoader.Instance.water) {
                    EngineLoader.Instance.water.SetPosition(EngineLoader.Instance.centerPosition.x, EngineLoader.Instance.centerPosition.z);
                }
                //Sun position depends on camera position
                if (EngineLoader.Instance.sun) {
                    EngineLoader.Instance.sun.position = new BABYLON.Vector3(activeCameraMiniMapPosition.x, EngineLoader.Instance.sun.position.y, activeCameraMiniMapPosition.z);
                }
            }
        };
        EngineLoader.prototype.OnRender = function () {
            // Message
            if (Terrain.Tiles.TilesManager.GetInstance().IsLoading()) {
                EngineLoader.Instance.message.innerHTML = Terrain.Localization.LocalizationManager.GetInstance().GetText("loading");
            }
            else {
                if (EngineLoader.Instance.message.innerHTML == Terrain.Localization.LocalizationManager.GetInstance().GetText("loading")) {
                    EngineLoader.Instance.message.innerHTML = "";
                }
                if (EngineLoader.Instance.firstTimeLoad) {
                    EngineLoader.Instance.firstTimeLoad = false;
                    EngineLoader.Instance.onEngineLoaded();
                    Terrain.EngineLoader.Instance.engine.resize();
                }
            }
            // Fps
            EngineLoader.Instance.fps.innerHTML = EngineLoader.Instance.engine.getFps().toFixed() + " fps";
            //Current Position  
            if (EngineLoader.Instance.currentAltitude) {
                EngineLoader.Instance.currentPositionTerrainAltitude.innerHTML = Terrain.Localization.LocalizationManager.GetInstance().GetText("altitude") + ": " + EngineLoader.Instance.currentAltitude.toFixed(2);
                var activeCameraMiniMapPosition = Terrain.UI.CameraManager.GetInstance().GetActiveCameraMiniMapPosition();
                Terrain.UI.UpdateMiniMapPosition(activeCameraMiniMapPosition.x, activeCameraMiniMapPosition.z, Terrain.UI.CameraManager.GetInstance().GetActiveCameraRotation());
            }
            EngineLoader.Instance.scene.render();
        };
        return EngineLoader;
    })();
    Terrain.EngineLoader = EngineLoader;
})(Terrain || (Terrain = {}));
//# sourceMappingURL=EngineLoader.js.map