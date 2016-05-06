/// <reference path="./Tiles/TilesDiscovery.ts"/>
var Terrain;
(function (Terrain) {
    var GameLoader = (function () {
        function GameLoader(canvas, fps, currentPosition, currentPositionTerrainAltitude) {
            this.canvas = canvas;
            this.fps = fps;
            this.currentPosition = currentPosition;
            this.currentPositionTerrainAltitude = currentPositionTerrainAltitude;

            GameLoader.Instance = this;
        }
        GameLoader.prototype._load = function (data) {
            var tilesConfiguration = data;

            if (tilesConfiguration == null) {
                console.log('Fatal error: Impossible to load the tiles configuration');
            }

            this.Start(tilesConfiguration);
        };

        GameLoader.prototype.Start = function (tilesConfiguration) {
            this.BuildEngine();

            //Force initialization
            Terrain.D3Models.Vegetation3DModelsContainer.GetInstance(this.scene);

            //Terrain.D3Models.Animal3DModelsContainer.GetInstance(this.scene); DISABLED
            this.InitializeScene(tilesConfiguration);
            //Initialize synchronizer
            //Terrain.Account.SynchronizerManager.Initialize(null); DISABLED
        };

        GameLoader.prototype.BuildEngine = function () {
            BABYLON.Engine.ShadersRepository = "";

            this.engine = new BABYLON.Engine(this.canvas);

            this.scene = new BABYLON.Scene(this.engine);
        };

        GameLoader.prototype.InitializeScene = function (tilesConfiguration) {
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
                Terrain.Tiles.TilesManager.GetInstance(this.scene, this.sun, this.terrainMaterial, tilesConfiguration.TileSize, tilesConfiguration.GridSize, tilesConfiguration.TilesMatrixSideSize, tilesConfiguration.TilePosition.NorthLalitude, tilesConfiguration.TilePosition.WestLongitude, document.getElementById("imageMiniMap"));
            }

            if (this.camera) {
                // First tile should be in center position
                var positionX = 0;
                var positionZ = 0;

                if (!this.camera.target) {
                    var freeCamera = this.camera;
                    freeCamera.position = new BABYLON.Vector3(positionX, this.camera.position.y, positionZ);
                } else {
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

        GameLoader.prototype.OnBeforeRender = function () {
            //Camera altitude control
            var altitude = Terrain.Tiles.TilesManager.GetExistingInstance().GetPositonAltitude(GameLoader.Instance.camera.position);
            if (GameLoader.Instance.camera.position.y > altitude + 10) {
                GameLoader.Instance.camera.position.y = altitude + 10;
            }
            if (GameLoader.Instance.camera.position.y < altitude + 5) {
                GameLoader.Instance.camera.position.y = altitude + 5;
            }

            //Water position depends on center tile position
            if (GameLoader.Instance.camera && GameLoader.Instance.water && Terrain.Tiles.TilesManager.GetExistingInstance().LoadNeededData(GameLoader.Instance.camera.position)) {
                var centerPosition = Terrain.Tiles.TilesManager.GetExistingInstance().GetCenterTilePosition();
                GameLoader.Instance.water.SetPosition(centerPosition.x, centerPosition.z);
            }

            //Sun position depends on camera position
            if (GameLoader.Instance.camera && GameLoader.Instance.sun) {
                GameLoader.Instance.sun.position = new BABYLON.Vector3(GameLoader.Instance.camera.position.x, GameLoader.Instance.sun.position.y, GameLoader.Instance.camera.position.z);
            }
        };

        GameLoader.prototype.OnRender = function () {
            // Fps
            GameLoader.Instance.fps.innerHTML = BABYLON.Tools.GetFps().toFixed() + " fps";

            //Current Position
            var newPosition = "X: " + GameLoader.Instance.camera.position.x.toFixed(2) + " - Y: " + GameLoader.Instance.camera.position.y.toFixed(2) + " - Z: " + GameLoader.Instance.camera.position.z.toFixed(2);

            //TODO: Clean this up, it has to be lighter.
            var rotationInRadians = 0;
            if (!GameLoader.Instance.camera.target) {
                var freeCamera = GameLoader.Instance.camera;
                rotationInRadians = freeCamera.rotation.y;

                newPosition += " - A: " + rotationInRadians.toFixed(2);
            }

            //TODO: use previous and new value. check camera contract.
            if (newPosition != GameLoader.Instance.currentPosition.innerHTML) {
                GameLoader.Instance.currentPosition.innerHTML = newPosition;

                if (Terrain.Tiles.TilesManager.GetExistingInstance()) {
                    GameLoader.Instance.currentPositionTerrainAltitude.innerHTML = "Altitude: " + Terrain.Tiles.TilesManager.GetExistingInstance().GetPositonAltitude(GameLoader.Instance.camera.position).toFixed(2);
                }

                GameLoader.Instance.UpdateMiniMapPosition(GameLoader.Instance.camera.position.x, GameLoader.Instance.camera.position.z, rotationInRadians);
            }

            GameLoader.Instance.scene.render();
        };

        GameLoader.prototype.UpdateMiniMapPosition = function (xPosition, zPosition, rotationInRadians) {
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
        return GameLoader;
    })();
    Terrain.GameLoader = GameLoader;
})(Terrain || (Terrain = {}));

window.onload = function () {
    var canvas = document.getElementById("renderCanvas");
    var divFps = document.getElementById("fps");
    var divCurrentPosition = document.getElementById("currentPosition");
    var divCurrentPositionTerrainAltitude = document.getElementById("currentPositionTerrainAltitude");
    var starter = new Terrain.GameLoader(canvas, divFps, divCurrentPosition, divCurrentPositionTerrainAltitude);

    Terrain.Tiles.TilesDiscovery.onGetTilesConfiguration(starter);
};

window.onresize = function () {
    Terrain.GameLoader.Instance.engine.resize();
};
