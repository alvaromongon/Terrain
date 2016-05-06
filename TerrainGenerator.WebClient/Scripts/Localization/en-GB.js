var Terrain;
(function (Terrain) {
    var Localization;
    (function (Localization) {
        function EnGB_Texts() {
            var texts;
            texts = new Terrain.Utilities.Dictionary();
            texts.add("prompt", "Log in, register a new account or go anonymous!");
            texts.add("userPassFillCheck", "Both username and password has to be filled up");
            texts.add("userPassSameCheck", "Username and password cannot be the same word");
            texts.add("passMatchCheck", "the password fields does not match");
            texts.add("userPassASCIICheck", "Only ASCII characteres are allowed for username and password");
            texts.add("registering", "Register in...");
            texts.add("activateAccount", "Successfully registered. Please check you email to activate the account.");
            texts.add("justRegistered", "Thank you for register a new account.");
            texts.add("logging", "Logging in...");
            texts.add("loading", "Loading...");
            texts.add("altitude", "Altitude");
            texts.add("wellcome", "Wellcome to the beginning of your jouney. Your tribe is tired of walking around.\n\nUse the menu on the right to build your first building and settle down. Choose a place in the visible map.\n\nClick on me to close me.");
            return texts;
        }
        Localization.EnGB_Texts = EnGB_Texts;
    })(Localization = Terrain.Localization || (Terrain.Localization = {}));
})(Terrain || (Terrain = {}));
//# sourceMappingURL=en-GB.js.map