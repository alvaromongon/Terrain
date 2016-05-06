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
            Terrain.Localization.LocalizationManager.Initialize("en-GB");
            return SystemLoader.instance;
        };
        SystemLoader.GetExistingInstance = function () {
            return SystemLoader.instance;
        };
        SystemLoader.prototype.Load = function (mode) {
            if (mode) {
                if (SystemLoader.anonymousMode == mode) {
                    this.LogInAccount(SystemLoader.demoAccount, SystemLoader.demoAccount);
                }
            }
            var systemHttpClient = Terrain.HttpClients.SystemHttpClient.GetInstance();
            if (systemHttpClient.GetSystemConfiguration(this.OnSystemConfigurationLoaded, this.OnRequestError)) {
                this.ShowMessage(Terrain.Localization.LocalizationManager.GetInstance().GetText("loading"));
                this.HideElement(this.loggingForm);
            }
            else {
                this.ShowMessage(Terrain.Localization.LocalizationManager.GetInstance().GetText("prompt"));
                this.ShowElement(this.loggingForm);
            }
        };
        SystemLoader.prototype.NotRegistered = function () {
            this.HideElement(this.loggingForm);
            this.ShowMessage(Terrain.Localization.LocalizationManager.GetInstance().GetText("justRegistered"));
            this.ShowElement(this.registeringForm);
        };
        SystemLoader.prototype.Registered = function () {
            this.HideElement(this.registeringForm);
            this.ShowMessage(Terrain.Localization.LocalizationManager.GetInstance().GetText("prompt"));
            this.ShowElement(this.loggingForm);
        };
        SystemLoader.prototype.Register = function (form) {
            var accountId = form.accountEmail.value;
            var accountPassword = form.accountPassword.value;
            var confirmAccountPassword = form.confirmAccountPassword.value;
            if (accountId.length == 0 || accountPassword.length == 0 || confirmAccountPassword.length == 0) {
                this.ShowMessage(Terrain.Localization.LocalizationManager.GetInstance().GetText("userPassFillCheck"));
                return;
            }
            if (accountId == accountPassword) {
                this.ShowMessage(Terrain.Localization.LocalizationManager.GetInstance().GetText("userPassSameCheck"));
                return;
            }
            if (confirmAccountPassword != accountPassword) {
                this.ShowMessage(Terrain.Localization.LocalizationManager.GetInstance().GetText("passMatchCheck"));
                return;
            }
            if (!Terrain.Utilities.IsASCII(accountId, false) || !Terrain.Utilities.IsASCII(accountPassword, false)) {
                this.ShowMessage(Terrain.Localization.LocalizationManager.GetInstance().GetText("userPassASCIICheck"));
                return;
            }
            var accountHttpClient = Terrain.HttpClients.AccountHttpClient.GetInstance();
            accountHttpClient.Register(accountId, accountPassword, confirmAccountPassword, this.OnRegisted, this.OnRequestError);
            this.ShowMessage(Terrain.Localization.LocalizationManager.GetInstance().GetText("registering"));
            this.HideElement(this.registeringForm);
        };
        SystemLoader.prototype.LogIn = function (form) {
            var accountEmail = form.accountEmail.value;
            var accountPassword = form.accountPassword.value;
            if (accountEmail.length == 0 || accountPassword.length == 0) {
                this.ShowMessage(Terrain.Localization.LocalizationManager.GetInstance().GetText("userPassFillCheck"));
                return;
            }
            this.LogInAccount(accountEmail, accountPassword);
        };
        SystemLoader.prototype.OnEngineLoaded = function () {
            var logInControls = document.getElementById("LogInControls");
            var eginecontrols = document.getElementById("Eginecontrols");
            logInControls.style.display = "none";
            eginecontrols.style.display = "block";
        };
        SystemLoader.prototype.LogInAccount = function (accountEmail, accountPassword) {
            var accountHttpClient = Terrain.HttpClients.AccountHttpClient.GetInstance();
            this.ShowMessage(Terrain.Localization.LocalizationManager.GetInstance().GetText("logging"));
            this.HideElement(this.loggingForm);
            accountHttpClient.LogIn(accountEmail, accountPassword, this.OnLogIn, this.OnRequestError);
        };
        SystemLoader.prototype.OnSystemConfigurationLoaded = function (data) {
            //SystemLoader.GetExistingInstance().LoadScripts();
            var systemConfiguration = data;
            SystemLoader.GetExistingInstance().StartEngine(systemConfiguration);
            //SystemLoader.loaderWorker = setInterval(SystemLoader.GetExistingInstance().StartEngine, SystemLoader.GetExistingInstance().intervalInMiliseconds, tilesConfiguration);
        };
        SystemLoader.prototype.OnRegisted = function (data) {
            //SystemLoader.GetExistingInstance().Load();
            SystemLoader.GetExistingInstance().ShowMessage(Terrain.Localization.LocalizationManager.GetInstance().GetText("activateAccount"));
        };
        SystemLoader.prototype.OnLogIn = function (data) {
            SystemLoader.GetExistingInstance().Load(null);
        };
        SystemLoader.prototype.OnRequestError = function (textStatus, errorThrown) {
            SystemLoader.GetExistingInstance().ShowMessage("There was a problem!"
                + String.fromCharCode(13)
                + textStatus + ":" + errorThrown);
            this.ShowElement(this.loggingForm);
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
        SystemLoader.prototype.StartEngine = function (systemConfiguration) {
            var canvas = document.getElementById("renderCanvas");
            var miniMap = document.getElementById("imageMiniMap");
            var divMessage = document.getElementById("message");
            var divFps = document.getElementById("fps");
            var divCurrentPositionTerrainAltitude = document.getElementById("currentPositionTerrainAltitude");
            var starter = new Terrain.EngineLoader(canvas, miniMap, divMessage, divFps, divCurrentPositionTerrainAltitude, SystemLoader.GetExistingInstance().OnEngineLoaded);
            starter.Start(systemConfiguration);
        };
        SystemLoader.anonymousMode = "anonymous";
        SystemLoader.demoAccount = "anonymous@anonymous.anonymous";
        return SystemLoader;
    })();
    Terrain.SystemLoader = SystemLoader;
})(Terrain || (Terrain = {}));
//# sourceMappingURL=SystemLoader.js.map