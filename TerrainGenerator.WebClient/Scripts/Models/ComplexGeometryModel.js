var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Terrain;
(function (Terrain) {
    var Models;
    (function (Models) {
        var ComplexGeometryModel = (function (_super) {
            __extends(ComplexGeometryModel, _super);
            function ComplexGeometryModel(name, meshes, scene) {
                _super.call(this, name, scene);
                this.meshes = meshes;
            }
            ComplexGeometryModel.prototype.CreateMeshes = function (name, size) {
                var meshes = new Array();
                for (var i = 0; i < this.meshes.length; i++) {
                    var instanceMesh = this.meshes[i].createInstance(name + i); // + position.x + position.z);
                    //instance.position = position;
                    var rotationAngleOverYAxis = Math.random() * Math.PI * 2;
                    ;
                    instanceMesh.rotate(BABYLON.Axis.Y, rotationAngleOverYAxis, BABYLON.Space.WORLD);
                    meshes.push(instanceMesh);
                }
                return meshes;
            };
            return ComplexGeometryModel;
        })(Models.BaseModel);
        Models.ComplexGeometryModel = ComplexGeometryModel;
    })(Models = Terrain.Models || (Terrain.Models = {}));
})(Terrain || (Terrain = {}));
//# sourceMappingURL=ComplexGeometryModel.js.map