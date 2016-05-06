//// <reference path="./typings/jquery/lib.d.ts" />  This is done by default for the typescript compiler
var Terrain;
(function (Terrain) {
    var SystemLoader = (function () {
        function SystemLoader() {
            this.intervalInMiliseconds = 500;
            SystemLoader.instance = this;
        }
        SystemLoader.GetInstance = function (information, registeringForm, loggingForm) {
            if (SystemLoader.instance == null) {
                SystemLoader.instance = new SystemLoader();
            }
            SystemLoader.instance.information = information;
            SystemLoader.instance.registeringForm = registeringForm;
            SystemLoader.instance.loggingForm = loggingForm;
            return SystemLoader.instance;
        };
        SystemLoader.GetExistingInstance = function () {
            return SystemLoader.instance;
        };
        SystemLoader.prototype.Load = function () {
            var tilesHttpClient = Terrain.HttpClients.TilesHttpClient.GetInstance();
            if (tilesHttpClient.GetTilesConfiguration(this.OnTilesConfigurationLoaded, this.OnRequestError)) {
                this.ShowMessage("Loading...");
                this.HideElement(this.loggingForm);
            }
            else {
                this.ShowMessage("Log in please.");
                this.ShowElement(this.loggingForm);
            }
        };
        SystemLoader.prototype.NotRegistered = function () {
            this.HideElement(this.loggingForm);
            this.ShowMessage("Thank you for register a new account.");
            this.ShowElement(this.registeringForm);
        };
        SystemLoader.prototype.Register = function (form) {
            var accountId = form.accountEmail.value;
            var accountPassword = form.accountPassword.value;
            var confirmAccountPassword = form.confirmAccountPassword.value;
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
        };
        SystemLoader.prototype.LogIn = function (form) {
            var accountId = form.accountEmail.value;
            var accountPassword = form.accountPassword.value;
            if (accountId.length == 0 || accountPassword.length == 0) {
                this.ShowMessage("Both username and password has to be filled up");
                return;
            }
            var accountHttpClient = Terrain.HttpClients.AccountHttpClient.GetInstance();
            accountHttpClient.LogIn(accountId, accountPassword, this.OnLogIn, this.OnRequestError);
            this.ShowMessage("Logging in...");
            this.HideElement(this.loggingForm);
        };
        SystemLoader.prototype.OnTilesConfigurationLoaded = function (data) {
            SystemLoader.GetExistingInstance().LoadScripts();
            var tilesConfiguration = data;
            SystemLoader.loaderWorker = setInterval(SystemLoader.GetExistingInstance().StartEngine, SystemLoader.GetExistingInstance().intervalInMiliseconds, tilesConfiguration);
        };
        SystemLoader.prototype.OnRegisted = function (data) {
            SystemLoader.GetExistingInstance().Load();
        };
        SystemLoader.prototype.OnLogIn = function (data) {
            SystemLoader.GetExistingInstance().Load();
        };
        SystemLoader.prototype.OnRequestError = function (textStatus, errorThrown) {
            SystemLoader.GetExistingInstance().ShowMessage("There was a problem!" + String.fromCharCode(13) + textStatus + ":" + errorThrown);
        };
        SystemLoader.prototype.ShowMessage = function (text) {
            this.ShowElement(this.information);
            this.information.textContent = text;
        };
        SystemLoader.prototype.ShowElement = function (element) {
            element.style.display = "block";
        };
        SystemLoader.prototype.HideElement = function (element) {
            element.style.display = "none";
        };
        SystemLoader.prototype.LoadScripts = function () {
            var scripts = this.GetScriptsToLoad();
            var head = document.getElementsByTagName("head")[0];
            for (var i = 0; i < scripts.length; i++) {
                var script = document.createElement('script');
                script.id = scripts[i];
                script.type = 'text/javascript';
                script.src = scripts[i];
                head.appendChild(script);
            }
        };
        SystemLoader.prototype.GetScriptsToLoad = function () {
            var scripts = [
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
                "Scripts/EngineLoader.js"
            ];
            return scripts;
        };
        SystemLoader.prototype.StartEngine = function (tilesConfiguration) {
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
                var starter = new Terrain.EngineLoader(logInControls, eginecontrols, canvas, miniMap, divFps, divCurrentPosition, divCurrentPositionTerrainAltitude);
                starter.Start(tilesConfiguration);
            }
        };
        return SystemLoader;
    })();
    Terrain.SystemLoader = SystemLoader;
})(Terrain || (Terrain = {}));
