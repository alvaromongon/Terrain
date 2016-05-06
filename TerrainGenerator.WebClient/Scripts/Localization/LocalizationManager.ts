module Terrain.Localization {

    export class LocalizationManager {

        private culture: string;

        private texts: Terrain.Utilities.Dictionary<string>;

        private static instance: LocalizationManager;

        constructor(culture: string) {
            this.culture = culture;
            
            //TODO: For now we only have en gb so no check
            this.texts = EnGB_Texts();
        }

        public static Initialize(culture: string): void {
            if (LocalizationManager.instance == null) {
                var soundsContainer = new LocalizationManager(culture);

                LocalizationManager.instance = soundsContainer;
            }
        }

        public static GetInstance(): LocalizationManager {
            return LocalizationManager.instance;
        }

        public GetText(key: string) {
            return this.texts.getByKey(key);
        }
    }

}  