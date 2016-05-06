var Terrain;
(function (Terrain) {
    var D3Models;
    (function (D3Models) {
        var Base3DModelsContainer = (function () {
            function Base3DModelsContainer(scene) {
                this.scene = scene;
                this.resources = [];
            }
            Base3DModelsContainer.prototype.Import3DModel = function (name, rootUrl, sceneFilename, scale) {
                var _this = this;
                BABYLON.SceneLoader.ImportMesh("", rootUrl, sceneFilename, this.scene, function (newMeshes) {
                    for (var i = 0; i < newMeshes.length; i++) {
                        if (newMeshes[i].material) {
                            newMeshes[i].material.backFaceCulling = false;
                        }
                        newMeshes[i].isVisible = false;
                        newMeshes[i].scaling.x = scale;
                        newMeshes[i].scaling.y = scale;
                        newMeshes[i].scaling.z = scale;
                    }
                    var resource = {
                        name: name,
                        meshes: newMeshes,
                        isLoaded: false
                    };
                    _this.resources.push(resource);
                });
            };
            Base3DModelsContainer.prototype.Get3DModel = function (name) {
                var result = this.resources.filter(function (resource) { return resource.name == name; });
                if (result && result.length > 0) {
                    return result[0].meshes;
                }
                return null;
            };
            Base3DModelsContainer.prototype.Get3DModelInstance = function (name, position, rotationAngleOverYAxis) {
                var instanceMeshes = [];
                var meshes = this.Get3DModel(name);
                if (meshes != null) {
                    for (var i = 0; i < meshes.length; i++) {
                        var instance = meshes[i].createInstance(name + i + position.x + position.z);
                        instance.position = position;
                        instance.rotate(BABYLON.Axis.Y, rotationAngleOverYAxis, 1 /* WORLD */);
                        instanceMeshes.push(instance);
                    }
                }
                return instanceMeshes;
            };
            return Base3DModelsContainer;
        })();
        D3Models.Base3DModelsContainer = Base3DModelsContainer;
    })(D3Models = Terrain.D3Models || (Terrain.D3Models = {}));
})(Terrain || (Terrain = {}));
