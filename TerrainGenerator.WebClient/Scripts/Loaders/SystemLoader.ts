//// <reference path="./typings/jquery/lib.d.ts" />  This is done by default for the typescript compiler

module Terrain {

    export class SystemLoader {       
        private static instance: SystemLoader;

        private information: HTMLElement;
        private registeringForm: HTMLElement;
        private loggingForm: HTMLElement;

        private intervalInMiliseconds: number = 500;
        private static loaderWorker: number;

        private static anonymousMode: string = "anonymous";
        private static demoAccount: string = "anonymous@anonymous.anonymous";
        private static currentMode: string;

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

            Localization.LocalizationManager.Initialize("en-GB");

            return SystemLoader.instance;
        }

        public static GetExistingInstance(): SystemLoader {
            return SystemLoader.instance;            
        }        

        public Load(mode: string): void {

            if (mode) {
                if (SystemLoader.anonymousMode == mode) {
                    this.LogInAccount(SystemLoader.demoAccount, SystemLoader.demoAccount);
                }
            }            
                                   
            var systemHttpClient = Terrain.HttpClients.SystemHttpClient.GetInstance();
            if (systemHttpClient.GetSystemConfiguration(this.OnSystemConfigurationLoaded, this.OnRequestError)) {
                this.ShowMessage(Localization.LocalizationManager.GetInstance().GetText("loading"));                
                this.HideElement(this.loggingForm);
            } else {                
                this.ShowMessage(Localization.LocalizationManager.GetInstance().GetText("prompt"));
                this.ShowElement(this.loggingForm);
            }
        }

        public NotRegistered(): void {

            this.HideElement(this.loggingForm);
            this.ShowMessage(Localization.LocalizationManager.GetInstance().GetText("justRegistered"));
            this.ShowElement(this.registeringForm);
        }

        public Registered(): void {

            this.HideElement(this.registeringForm);
            this.ShowMessage(Localization.LocalizationManager.GetInstance().GetText("prompt"));
            this.ShowElement(this.loggingForm);
        }

        public Register(form: any): void {
            var accountId = <string>form.accountEmail.value;
            var accountPassword = <string>form.accountPassword.value;
            var confirmAccountPassword = <string>form.confirmAccountPassword.value;

            if (accountId.length == 0 || accountPassword.length == 0 || confirmAccountPassword.length == 0) {
                this.ShowMessage(Localization.LocalizationManager.GetInstance().GetText("userPassFillCheck"));
                return;
            }

            if (accountId == accountPassword) {
                this.ShowMessage(Localization.LocalizationManager.GetInstance().GetText("userPassSameCheck"));
                return;
            }

            if (confirmAccountPassword != accountPassword) {
                this.ShowMessage(Localization.LocalizationManager.GetInstance().GetText("passMatchCheck"));
                return;
            }

            if (!Terrain.Utilities.IsASCII(accountId, false) || !Terrain.Utilities.IsASCII(accountPassword, false)) {
                this.ShowMessage(Localization.LocalizationManager.GetInstance().GetText("userPassASCIICheck"));
                return;
            }                      

            var accountHttpClient = Terrain.HttpClients.AccountHttpClient.GetInstance();

            accountHttpClient.Register(accountId, accountPassword, confirmAccountPassword, this.OnRegisted, this.OnRequestError);

            this.ShowMessage(Localization.LocalizationManager.GetInstance().GetText("registering"));
            this.HideElement(this.registeringForm);
        }

        public LogIn(form: any): void {
            var accountEmail = <string>form.accountEmail.value;
            var accountPassword = <string>form.accountPassword.value;

            if (accountEmail.length == 0 || accountPassword.length == 0) {
                this.ShowMessage(Localization.LocalizationManager.GetInstance().GetText("userPassFillCheck"));
                return;
            }

            this.LogInAccount(accountEmail, accountPassword);
        }

        public OnEngineLoaded(): void {
            var logInControls = document.getElementById("LogInControls");
            var eginecontrols = document.getElementById("Eginecontrols");

            logInControls.style.display = "none";
            eginecontrols.style.display = "block";
        }

        private LogInAccount(accountEmail: string, accountPassword: string): void {
            var accountHttpClient = Terrain.HttpClients.AccountHttpClient.GetInstance();

            this.ShowMessage(Localization.LocalizationManager.GetInstance().GetText("logging"));
            this.HideElement(this.loggingForm);

            accountHttpClient.LogIn(accountEmail, accountPassword, this.OnLogIn, this.OnRequestError);            
        }

        private OnSystemConfigurationLoaded(data: any): void {
            //SystemLoader.GetExistingInstance().LoadScripts();
            var systemConfiguration = <Terrain.System.ISystemConfiguration>data;
            SystemLoader.GetExistingInstance().StartEngine(systemConfiguration);
            //SystemLoader.loaderWorker = setInterval(SystemLoader.GetExistingInstance().StartEngine, SystemLoader.GetExistingInstance().intervalInMiliseconds, tilesConfiguration);
        }

        private OnRegisted(data: any): void {
            //SystemLoader.GetExistingInstance().Load();
            SystemLoader.GetExistingInstance().ShowMessage(Localization.LocalizationManager.GetInstance().GetText("activateAccount"));
        }

        private OnLogIn(data: any): void {
            SystemLoader.GetExistingInstance().Load(null);
        }

        private OnRequestError(textStatus: string, errorThrown: string): void {
            SystemLoader.GetExistingInstance().ShowMessage("There was a problem!"
                + String.fromCharCode(13)
                + textStatus + ":" + errorThrown);

            this.ShowElement(this.loggingForm);
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

        public StartEngine(systemConfiguration: Terrain.System.ISystemConfiguration): void {
            
            var canvas = document.getElementById("renderCanvas");
            var miniMap = document.getElementById("imageMiniMap");                
            var divMessage = document.getElementById("message");
            var divFps = document.getElementById("fps");
            var divCurrentPositionTerrainAltitude = document.getElementById("currentPositionTerrainAltitude");                

            var starter = new Terrain.EngineLoader(<HTMLCanvasElement>canvas, miniMap, divMessage, divFps, divCurrentPositionTerrainAltitude, SystemLoader.GetExistingInstance().OnEngineLoaded);
            starter.Start(systemConfiguration);
        }
    }

}