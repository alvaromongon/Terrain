var Terrain;
(function (Terrain) {
    var Environment;
    (function (Environment) {
        var Animal = (function () {
            function Animal() {
                this.meshes = new Array();
            }
            Animal.prototype.Hide = function () {
                for (var i = 0; i < this.meshes.length; i++) {
                    this.meshes[i].isVisible = false;
                }
            };
            Animal.prototype.Show = function () {
                for (var i = 0; i < this.meshes.length; i++) {
                    this.meshes[i].isVisible = true;
                }
            };
            return Animal;
        })();
        Environment.Animal = Animal;
    })(Environment = Terrain.Environment || (Terrain.Environment = {}));
})(Terrain || (Terrain = {}));
