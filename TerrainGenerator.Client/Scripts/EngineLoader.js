var Terrain;
(function (Terrain) {
    var EngineLoader = (function () {
        function EngineLoader(logInControls, egineControls, canvas, miniMap, fps, currentPosition, currentPositionTerrainAltitude) {
            this.logInControls = logInControls;
            this.egineControls = egineControls;
            this.canvas = canvas;
            this.miniMap = miniMap;
            this.fps = fps;
            this.currentPosition = currentPosition;
            this.currentPositionTerrainAltitude = currentPositionTerrainAltitude;
            EngineLoader.Instance = this;
        }
        EngineLoader.prototype.Start = function (tilesConfiguration) {
            this.BuildEngine();
            window.onresize = function () {
                Terrain.EngineLoader.Instance.engine.resize();
            };
            //Force initialization
            Terrain.D3Models.Vegetation3DModelsContainer.GetInstance(this.scene);
            //Terrain.D3Models.Animal3DModelsContainer.GetInstance(this.scene); DISABLED
            this.InitializeScene(tilesConfiguration);
            //Initialize synchronizer
            //Terrain.Account.SynchronizerManager.Initialize(null); DISABLED
            this.logInControls.style.display = "none";
            this.egineControls.style.display = "block";
        };
        EngineLoader.prototype.BuildEngine = function () {
            BABYLON.Engine.ShadersRepository = "";
            this.engine = new BABYLON.Engine(this.canvas);
            this.scene = new BABYLON.Scene(this.engine);
        };
        EngineLoader.prototype.InitializeScene = function (tilesConfiguration) {
            var _this = this;
            this.scene.collisionsEnabled = true;
            this.scene.fogMode = BABYLON.Scene.FOGMODE_LINEAR;
            this.scene.fogColor = this.scene.clearColor;
            this.scene.fogDensity = 0.1;
            this.sun = new BABYLON.PointLight("Sun", new BABYLON.Vector3(0, Terrain.Tiles.TilesManager.maxMinHeight * 1.5, 0), this.scene);
            this.camera = new BABYLON.FreeCamera("FreeCamera", new BABYLON.Vector3(0, Terrain.Tiles.TilesManager.maxMinHeight, 0), this.scene);
            //this.camera = new BABYLON.ArcRotateCamera("ArcRotateCamera", 1, 1, 1, new BABYLON.Vector3(0, 30, 0), this.scene);
            if (!this.camera.target) {
                var freeCamera = this.camera;
                freeCamera.checkCollisions = true;
                freeCamera.ellipsoid = new BABYLON.Vector3(1, 1, 1);
                //freeCamera2.applyGravity = true;   
                freeCamera.speed = 0.5;
                freeCamera.inertia = 0;
            }
            this.skybox = new Terrain.Environment.SkyBox("skyBox", this.scene);
            this.skybox.RenderSkyBox(3 /* TropicalSunnyDay */, tilesConfiguration.GridSize, tilesConfiguration.TilesMatrixSideSize);
            this.terrainMaterial = new Terrain.Materials.TerrainMaterial("terrain", this.scene, this.sun, this.skybox, Terrain.Tiles.TilesManager.maxMinHeight);
            this.waterMaterial = new Terrain.Materials.WaterMaterial("water", this.scene, this.sun, this.skybox);
            if (this.waterMaterial) {
                this.water = new Terrain.Environment.Water("water", this.scene, this.waterMaterial);
                this.water.Render(tilesConfiguration.GridSize, tilesConfiguration.TilesMatrixSideSize);
            }
            if (this.terrainMaterial) {
                Terrain.Tiles.TilesManager.GetInstance(this.scene, this.sun, this.terrainMaterial, tilesConfiguration.TileSize, tilesConfiguration.GridSize, tilesConfiguration.TilesMatrixSideSize, tilesConfiguration.TilePosition.NorthLalitude, tilesConfiguration.TilePosition.WestLongitude, this.miniMap);
            }
            if (this.camera) {
                // First tile should be in center position
                var positionX = 0;
                var positionZ = 0;
                if (!this.camera.target) {
                    var freeCamera = this.camera;
                    freeCamera.position = new BABYLON.Vector3(positionX, this.camera.position.y, positionZ);
                }
                else {
                    var arcRotateCamera = this.camera;
                    arcRotateCamera.target = new BABYLON.Vector3(positionX, this.camera.position.y, positionZ);
                }
            }
            this.scene.registerBeforeRender(this.OnBeforeRender);
            this.scene.executeWhenReady(function () {
                if (_this.scene.activeCamera) {
                    _this.scene.activeCamera.attachControl(_this.canvas);
                }
                _this.engine.runRenderLoop(_this.OnRender);
            });
        };
        EngineLoader.prototype.OnBeforeRender = function () {
            //Camera altitude control            
            var altitude = Terrain.Tiles.TilesManager.GetExistingInstance().GetPositonAltitude(EngineLoader.Instance.camera.position);
            if (EngineLoader.Instance.camera.position.y > altitude + 10) {
                EngineLoader.Instance.camera.position.y = altitude + 10;
            }
            if (EngineLoader.Instance.camera.position.y < altitude + 5) {
                EngineLoader.Instance.camera.position.y = altitude + 5;
            }
            //Water position depends on center tile position
            if (EngineLoader.Instance.camera && EngineLoader.Instance.water && Terrain.Tiles.TilesManager.GetExistingInstance().LoadNeededData(EngineLoader.Instance.camera.position)) {
                var centerPosition = Terrain.Tiles.TilesManager.GetExistingInstance().GetCenterTilePosition();
                EngineLoader.Instance.water.SetPosition(centerPosition.x, centerPosition.z);
            }
            //Sun position depends on camera position
            if (EngineLoader.Instance.camera && EngineLoader.Instance.sun) {
                EngineLoader.Instance.sun.position = new BABYLON.Vector3(EngineLoader.Instance.camera.position.x, EngineLoader.Instance.sun.position.y, EngineLoader.Instance.camera.position.z);
            }
        };
        EngineLoader.prototype.OnRender = function () {
            // Fps
            EngineLoader.Instance.fps.innerHTML = BABYLON.Tools.GetFps().toFixed() + " fps";
            //Current Position            
            var newPosition = "X: " + EngineLoader.Instance.camera.position.x.toFixed(2) + " - Y: " + EngineLoader.Instance.camera.position.y.toFixed(2) + " - Z: " + EngineLoader.Instance.camera.position.z.toFixed(2);
            //TODO: Clean this up, it has to be lighter.
            var rotationInRadians = 0;
            if (!EngineLoader.Instance.camera.target) {
                var freeCamera = EngineLoader.Instance.camera;
                rotationInRadians = freeCamera.rotation.y;
                newPosition += " - A: " + rotationInRadians.toFixed(2);
            }
            //TODO: use previous and new value. check camera contract.
            if (newPosition != EngineLoader.Instance.currentPosition.innerHTML) {
                EngineLoader.Instance.currentPosition.innerHTML = newPosition;
                if (Terrain.Tiles.TilesManager.GetExistingInstance()) {
                    EngineLoader.Instance.currentPositionTerrainAltitude.innerHTML = "Altitude: " + Terrain.Tiles.TilesManager.GetExistingInstance().GetPositonAltitude(EngineLoader.Instance.camera.position).toFixed(2);
                }
                EngineLoader.Instance.UpdateMiniMapPosition(EngineLoader.Instance.camera.position.x, EngineLoader.Instance.camera.position.z, rotationInRadians);
            }
            EngineLoader.Instance.scene.render();
        };
        EngineLoader.prototype.UpdateMiniMapPosition = function (xPosition, zPosition, rotationInRadians) {
            //TODO: If width and height are predifine, make calculation only once, and not every time
            if ($("#imageMiniMap").width() > 0) {
                var origin = Terrain.Tiles.TilesManager.GetExistingInstance().GetCenterTilePosition();
                var amplitud = Terrain.Tiles.TilesManager.GetExistingInstance().GetAmplitud();
                var offSet = amplitud / 2;
                var rotationInDegrees = rotationInRadians * 57.2957795131;
                // position without rotation
                var x = (((xPosition + offSet - origin.x) * $("#imageMiniMap").width()) / amplitud) - ($("#redTriangle").width() / 2);
                var z = (((-zPosition + offSet + origin.z) * $("#imageMiniMap").height()) / amplitud) - ($("#redTriangle").height() / 2);
                $("#redTriangle").css({ left: x, top: z });
                $('#redTriangle').css('transform', 'rotate(' + rotationInDegrees + 'deg)');
                $("#redTriangle").removeClass("hidden");
            }
        };
        return EngineLoader;
    })();
    Terrain.EngineLoader = EngineLoader;
})(Terrain || (Terrain = {}));
