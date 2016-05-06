var Terrain;
(function (Terrain) {
    var Models;
    (function (Models) {
        var BaseModel = (function () {
            function BaseModel(name, scene) {
                this.name = name;
            }
            BaseModel.prototype.CreateMeshes = function (name, size, scaling) {
                if (scaling === void 0) { scaling = new BABYLON.Vector3(1, 1, 1); }
                return null;
            };
            return BaseModel;
        })();
        Models.BaseModel = BaseModel;
    })(Models = Terrain.Models || (Terrain.Models = {}));
})(Terrain || (Terrain = {}));
//# sourceMappingURL=BaseModel.js.map