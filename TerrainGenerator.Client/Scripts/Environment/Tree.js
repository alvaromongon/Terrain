var Terrain;
(function (Terrain) {
    var Environment;
    (function (Environment) {
        var Tree = (function () {
            function Tree() {
                this.meshes = new Array();
            }
            Tree.prototype.Hide = function () {
                for (var i = 0; i < this.meshes.length; i++) {
                    this.meshes[i].isVisible = false;
                }
            };
            Tree.prototype.Show = function () {
                for (var i = 0; i < this.meshes.length; i++) {
                    this.meshes[i].isVisible = true;
                }
            };
            return Tree;
        })();
        Environment.Tree = Tree;
    })(Environment = Terrain.Environment || (Terrain.Environment = {}));
})(Terrain || (Terrain = {}));
