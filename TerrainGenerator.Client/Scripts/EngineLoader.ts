module Terrain {    

    export class EngineLoader {
        private logInControls: HTMLElement;
        private egineControls: HTMLElement;

        private canvas: HTMLCanvasElement;
        private miniMap: HTMLElement;
        private fps: HTMLElement;
        private currentPosition: HTMLElement;
        private currentPositionTerrainAltitude: HTMLElement;

        private scene: BABYLON.Scene;
        private sun: BABYLON.PointLight;
        private camera: BABYLON.Camera;

        private terrainMaterial: BABYLON.Material;
        public waterMaterial: BABYLON.Material;

        private skybox: Environment.SkyBox;
        private water: Environment.Water;

        public engine: BABYLON.Engine;

        public static Instance: EngineLoader;

        constructor(logInControls: HTMLElement, egineControls: HTMLElement, canvas: HTMLCanvasElement, miniMap: HTMLElement, fps: HTMLElement, currentPosition: HTMLElement, currentPositionTerrainAltitude: HTMLElement) {
            this.logInControls = logInControls;
            this.egineControls = egineControls;
            this.canvas = canvas;
            this.miniMap = miniMap;
            this.fps = fps;
            this.currentPosition = currentPosition;
            this.currentPositionTerrainAltitude = currentPositionTerrainAltitude;

            EngineLoader.Instance = this;
        }

        public Start(tilesConfiguration: Terrain.Tiles.ITilesConfiguration): void {

            this.BuildEngine();

            window.onresize = () => {
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
        }

        private BuildEngine(): void {
            BABYLON.Engine.ShadersRepository = "";

            this.engine = new BABYLON.Engine(this.canvas);

            this.scene = new BABYLON.Scene(this.engine);
        }

        private InitializeScene(tilesConfiguration: Terrain.Tiles.ITilesConfiguration): void {

            this.scene.collisionsEnabled = true;
            this.scene.fogMode = BABYLON.Scene.FOGMODE_LINEAR;
            this.scene.fogColor = this.scene.clearColor;
            this.scene.fogDensity = 0.1;
            this.sun = new BABYLON.PointLight("Sun", new BABYLON.Vector3(0, Terrain.Tiles.TilesManager.maxMinHeight * 1.5, 0), this.scene);

            this.camera = new BABYLON.FreeCamera("FreeCamera", new BABYLON.Vector3(0, Terrain.Tiles.TilesManager.maxMinHeight, 0), this.scene);
            //this.camera = new BABYLON.ArcRotateCamera("ArcRotateCamera", 1, 1, 1, new BABYLON.Vector3(0, 30, 0), this.scene);

            if (!(<any>this.camera).target) {
                var freeCamera: BABYLON.FreeCamera = <BABYLON.FreeCamera>this.camera;
                freeCamera.checkCollisions = true;
                freeCamera.ellipsoid = new BABYLON.Vector3(1, 1, 1);
                //freeCamera2.applyGravity = true;   
                freeCamera.speed = 0.5;
                freeCamera.inertia = 0;
            }

            this.skybox = new Environment.SkyBox("skyBox", this.scene);
            this.skybox.RenderSkyBox(Environment.SkyBoxType.TropicalSunnyDay, tilesConfiguration.GridSize, tilesConfiguration.TilesMatrixSideSize);

            this.terrainMaterial = new Terrain.Materials.TerrainMaterial("terrain", this.scene, this.sun, this.skybox, Terrain.Tiles.TilesManager.maxMinHeight);

            this.waterMaterial = new Terrain.Materials.WaterMaterial("water", this.scene, this.sun, this.skybox);

            if (this.waterMaterial) {
                this.water = new Terrain.Environment.Water("water", this.scene, this.waterMaterial);
                this.water.Render(tilesConfiguration.GridSize, tilesConfiguration.TilesMatrixSideSize);
            }

            if (this.terrainMaterial) {
                Terrain.Tiles.TilesManager.GetInstance(this.scene,
                    this.sun,
                    this.terrainMaterial,
                    tilesConfiguration.TileSize,
                    tilesConfiguration.GridSize,
                    tilesConfiguration.TilesMatrixSideSize,
                    tilesConfiguration.TilePosition.NorthLalitude,
                    tilesConfiguration.TilePosition.WestLongitude,
                    this.miniMap);
            }

            if (this.camera) {
                // First tile should be in center position
                var positionX = 0;
                var positionZ = 0;

                if (!(<any>this.camera).target) {
                    var freeCamera: BABYLON.FreeCamera = <BABYLON.FreeCamera>this.camera;
                    freeCamera.position = new BABYLON.Vector3(positionX, this.camera.position.y, positionZ);
                }
                else {
                    var arcRotateCamera: BABYLON.ArcRotateCamera = <BABYLON.ArcRotateCamera>this.camera;
                    arcRotateCamera.target = new BABYLON.Vector3(positionX, this.camera.position.y, positionZ);
                }
            }

            this.scene.registerBeforeRender(this.OnBeforeRender);
            this.scene.executeWhenReady(() => {
                if (this.scene.activeCamera) {
                    this.scene.activeCamera.attachControl(this.canvas);
                }

                this.engine.runRenderLoop(this.OnRender);
            });
        }

        private OnBeforeRender(): void {
            //Camera altitude control            
            var altitude = Terrain.Tiles.TilesManager.GetExistingInstance().GetPositonAltitude(EngineLoader.Instance.camera.position);
            if (EngineLoader.Instance.camera.position.y > altitude + 10) {
                EngineLoader.Instance.camera.position.y = altitude + 10;
            }
            if (EngineLoader.Instance.camera.position.y < altitude + 5) {
                EngineLoader.Instance.camera.position.y = altitude + 5;
            }

            //Water position depends on center tile position
            if (EngineLoader.Instance.camera && EngineLoader.Instance.water
                && Terrain.Tiles.TilesManager.GetExistingInstance().LoadNeededData(EngineLoader.Instance.camera.position)) {
                var centerPosition = Terrain.Tiles.TilesManager.GetExistingInstance().GetCenterTilePosition();
                EngineLoader.Instance.water.SetPosition(centerPosition.x, centerPosition.z);
            }

            //Sun position depends on camera position
            if (EngineLoader.Instance.camera && EngineLoader.Instance.sun) {
                EngineLoader.Instance.sun.position = new BABYLON.Vector3(EngineLoader.Instance.camera.position.x, EngineLoader.Instance.sun.position.y, EngineLoader.Instance.camera.position.z);
            }            
        }

        private OnRender(): void {
            // Fps
            EngineLoader.Instance.fps.innerHTML = BABYLON.Tools.GetFps().toFixed() + " fps";            

            //Current Position            
            var newPosition = "X: " + EngineLoader.Instance.camera.position.x.toFixed(2)
                + " - Y: " + EngineLoader.Instance.camera.position.y.toFixed(2)
                + " - Z: " + EngineLoader.Instance.camera.position.z.toFixed(2);

            //TODO: Clean this up, it has to be lighter.
            var rotationInRadians: number = 0;
            if (!(<any>EngineLoader.Instance.camera).target) {
                var freeCamera: BABYLON.FreeCamera = <BABYLON.FreeCamera>EngineLoader.Instance.camera;
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
        }

        private UpdateMiniMapPosition(xPosition: number, zPosition: number, rotationInRadians: number) {
            
            //TODO: If width and height are predifine, make calculation only once, and not every time
            if ($("#imageMiniMap").width() > 0) {

                var origin = Tiles.TilesManager.GetExistingInstance().GetCenterTilePosition();
                var amplitud: number = Tiles.TilesManager.GetExistingInstance().GetAmplitud();
                var offSet: number = amplitud / 2;
                var rotationInDegrees = rotationInRadians * 57.2957795131;

                // position without rotation
                var x: number = (((xPosition + offSet - origin.x) * $("#imageMiniMap").width()) / amplitud) - ($("#redTriangle").width() / 2);                
                var z: number = (((-zPosition + offSet + origin.z) * $("#imageMiniMap").height()) / amplitud) - ($("#redTriangle").height() / 2);                
                
                $("#redTriangle").css({ left: x, top: z });
                $('#redTriangle').css('transform', 'rotate(' + rotationInDegrees + 'deg)');                   
                $("#redTriangle").removeClass("hidden");     
            }            
        }
    }
}