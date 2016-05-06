//// <reference path="./typings/jquery/lib.d.ts" />  This is done by default for the typescript compiler

module Terrain {

    export class SystemLoader {       
        private static instance: SystemLoader;

        private information: HTMLElement;
        private registeringForm: HTMLElement;
        private loggingForm: HTMLElement;

        private intervalInMiliseconds: number = 500;
        private static loaderWorker: number;

        constructor() {
            SystemLoader.instance = this;
        }

        public static GetInstance(information: HTMLElement, registeringForm: HTMLElement, loggingForm: HTMLElement): SystemLoader {
            if (SystemLoader.instance == null) {
                SystemLoader.instance = new SystemLoader();
            }

            SystemLoader.instance.information = information;
            SystemLoader.instance.registeringForm = registeringForm;
            SystemLoader.instance.loggingForm = loggingForm;

            return SystemLoader.instance;
        }

        public static GetExistingInstance(): SystemLoader {
            return SystemLoader.instance;
        }

        public Load(): void {
           
            var tilesHttpClient = Terrain.HttpClients.TilesHttpClient.GetInstance();
            if (tilesHttpClient.GetTilesConfiguration(this.OnTilesConfigurationLoaded, this.OnRequestError)) {                
                this.ShowMessage("Loading...");
                this.HideElement(this.loggingForm);
            } else {
                this.ShowMessage("Log in please.");
                this.ShowElement(this.loggingForm);
            }
        }

        public NotRegistered(): void {

            this.HideElement(this.loggingForm);
            this.ShowMessage("Thank you for register a new account.");
            this.ShowElement(this.registeringForm);
        }

        public Register(form: any): void {
            var accountId = <string>form.accountEmail.value;
            var accountPassword = <string>form.accountPassword.value;
            var confirmAccountPassword = <string>form.confirmAccountPassword.value;

            if (accountId.length == 0 || accountPassword.length == 0 || confirmAccountPassword.length == 0) {
                this.ShowMessage("Both username and password has to be filled up");
                return;
            }

            if (accountId == accountPassword) {
                this.ShowMessage("Username and password cannot be the same word");
                return;
            }

            if (confirmAccountPassword != accountPassword) {
                this.ShowMessage("the password fields does not match");
                return;
            }

            if (!Terrain.Utilities.IsASCII(accountId, false) || !Terrain.Utilities.IsASCII(accountPassword, false)) {
                this.ShowMessage("Only ASCII characteres are allowed for username and password");
                return;
            }                      

            var accountHttpClient = Terrain.HttpClients.AccountHttpClient.GetInstance();

            accountHttpClient.Register(accountId, accountPassword, confirmAccountPassword, this.OnRegisted, this.OnRequestError);

            this.ShowMessage("Registering in...");
            this.HideElement(this.registeringForm);
        }

        public LogIn(form: any): void {
            var accountId = <string>form.accountEmail.value;
            var accountPassword = <string>form.accountPassword.value;

            if (accountId.length == 0 || accountPassword.length == 0) {
                this.ShowMessage("Both username and password has to be filled up");
                return;
            }

            var accountHttpClient = Terrain.HttpClients.AccountHttpClient.GetInstance();

            accountHttpClient.LogIn(accountId, accountPassword, this.OnLogIn, this.OnRequestError);

            this.ShowMessage("Logging in...");
            this.HideElement(this.loggingForm);
        }

        private OnTilesConfigurationLoaded(data: any): void {
            SystemLoader.GetExistingInstance().LoadScripts();
            var tilesConfiguration = <Terrain.Tiles.ITilesConfiguration>data;
            SystemLoader.loaderWorker = setInterval(SystemLoader.GetExistingInstance().StartEngine, SystemLoader.GetExistingInstance().intervalInMiliseconds, tilesConfiguration);
        }

        private OnRegisted(data: any): void {
            SystemLoader.GetExistingInstance().Load();
        }

        private OnLogIn(data: any): void {
            SystemLoader.GetExistingInstance().Load();
        }

        private OnRequestError(textStatus: string, errorThrown: string): void {
            SystemLoader.GetExistingInstance().ShowMessage("There was a problem!"
                + String.fromCharCode(13)
                + textStatus + ":" + errorThrown);
        }   
        
        private ShowMessage(text: string): void {
            this.ShowElement(this.information);
            this.information.textContent = text;
        }

        private ShowElement(element: HTMLElement): void {
            element.style.display = "block";
        }

        private HideElement(element: HTMLElement): void {
            element.style.display = "none";
        }

        private LoadScripts(): void {

            var scripts = this.GetScriptsToLoad();

            var head = document.getElementsByTagName("head")[0];

            for (var i = 0; i < scripts.length; i++) {
                var script = document.createElement('script');
                script.id = scripts[i];
                script.type = 'text/javascript';
                script.src = scripts[i];
                head.appendChild(script);                
            }                        
        }

        private GetScriptsToLoad(): string[] {

            var scripts: string[] = [                
                //"Scripts/babylon.2.0-alpha.debug.js",                

                "Scripts/Utilities/forEachSupport.js",
                "Scripts/Utilities/CountDownEvent.js",

                "Scripts/Materials/WaterMaterial.js",
                "Scripts/Materials/TerrainMaterial.js",

                "Scripts/Environment/Sky.js",
                "Scripts/Environment/Water.js",
                "Scripts/Environment/Tree.js",

                "Scripts/Tiles/CoordinateSystemHelps.js",
                "Scripts/Tiles/Tile.js",
                "Scripts/Tiles/TileImage.js",
                "Scripts/Tiles/TilesManager.js",

                "Scripts/D3Models/I3DModelsContainer.js",
                "Scripts/D3Models/Base3DModelsContainer.js",
                "Scripts/D3Models/Vegetation3DModelsContainer.js",
                //"Scripts/D3Models/Animal3DModelsContainer.js",                

                //"Scripts/Account/SynchronizerManager.js",
                //"Scripts/Account/ResourceManager.js",
                //"Scripts/Account/WorkersManager.js",
                //"Scripts/Account/Model/Resource.js",
                //"Scripts/Account/Model/Worker.js",
                //"Scripts/Account/Model/WorkersAllocation.js"

                "Scripts/EngineLoader.js"
            ];

            return scripts;
        }

        public StartEngine(tilesConfiguration: Terrain.Tiles.ITilesConfiguration): void {

            console.log("Checking if all is loaded");

            var scripts = SystemLoader.GetExistingInstance().GetScriptsToLoad();

            var allLoaded = true;
            for (var i = 0; i < scripts.length; i++) {
                if (document.getElementById(scripts[i]) == null) {
                    allLoaded = false;
                    break;
                }                
            }

            if (allLoaded) {
                clearInterval(SystemLoader.loaderWorker);

                var logInControls = document.getElementById("LogInControls");
                var eginecontrols = document.getElementById("Eginecontrols");
                var canvas = document.getElementById("renderCanvas");
                var miniMap = document.getElementById("imageMiniMap");
                var divFps = document.getElementById("fps");
                var divCurrentPosition = document.getElementById("currentPosition");
                var divCurrentPositionTerrainAltitude = document.getElementById("currentPositionTerrainAltitude");                

                var starter = new Terrain.EngineLoader(logInControls, eginecontrols, <HTMLCanvasElement>canvas, miniMap, divFps, divCurrentPosition, divCurrentPositionTerrainAltitude);
                starter.Start(tilesConfiguration);
            }
        }
    }

}