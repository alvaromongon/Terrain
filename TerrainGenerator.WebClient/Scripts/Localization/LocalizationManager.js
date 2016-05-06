var Terrain;
(function (Terrain) {
    var Localization;
    (function (Localization) {
        var LocalizationManager = (function () {
            function LocalizationManager(culture) {
                this.culture = culture;
                //TODO: For now we only have en gb so no check
                this.texts = Localization.EnGB_Texts();
            }
            LocalizationManager.Initialize = function (culture) {
                if (LocalizationManager.instance == null) {
                    var soundsContainer = new LocalizationManager(culture);
                    LocalizationManager.instance = soundsContainer;
                }
            };
            LocalizationManager.GetInstance = function () {
                return LocalizationManager.instance;
            };
            LocalizationManager.prototype.GetText = function (key) {
                return this.texts.getByKey(key);
            };
            return LocalizationManager;
        })();
        Localization.LocalizationManager = LocalizationManager;
    })(Localization = Terrain.Localization || (Terrain.Localization = {}));
})(Terrain || (Terrain = {}));
//# sourceMappingURL=LocalizationManager.js.map