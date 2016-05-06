var Terrain;
(function (Terrain) {
    var Utilities;
    (function (Utilities) {
        var Dictionary = (function () {
            function Dictionary() {
                this.items = [];
            }
            Dictionary.prototype.add = function (key, value) {
                this.items.push(value);
                this.items[key] = value;
            };
            Dictionary.prototype.remove = function (key) {
                var index = this.items.indexOf(key, 0);
                if (index != undefined) {
                    this.items.splice(index, 1);
                }
            };
            Dictionary.prototype.getByIndex = function (index) {
                return this.items[index];
            };
            Dictionary.prototype.getByKey = function (key) {
                return this.items[key];
            };
            Dictionary.prototype.getValues = function () {
                return this.items;
            };
            Dictionary.prototype.length = function () {
                return this.items.length;
            };
            return Dictionary;
        })();
        Utilities.Dictionary = Dictionary;
    })(Utilities = Terrain.Utilities || (Terrain.Utilities = {}));
})(Terrain || (Terrain = {}));
//# sourceMappingURL=Dictionary.js.map