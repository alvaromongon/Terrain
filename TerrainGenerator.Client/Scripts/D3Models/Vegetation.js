var Terrain;
(function (Terrain) {
    (function (Resource) {
        var Vegetation = (function () {
            function Vegetation(scene) {
                this.scene = scene;
                this.resources = [];
            }
            Vegetation.GetInstance = function (scene) {
                if (Vegetation.instance == null) {
                    Vegetation.instance = new Vegetation(scene);
                }

                return Vegetation.instance;
            };

            Vegetation.GetExistingInstance = function () {
                return Vegetation.instance;
            };

            Vegetation.prototype.ImportMesh = function (name, rootUrl, sceneFilename, scale) {
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
                        meshes: newMeshes
                    };

                    _this.resources.push(resource);
                });
            };

            Vegetation.prototype.GetInstanceMeshes = function (name) {
                var result = this.resources.filter(function (resource) {
                    return resource.name == name;
                });

                if (result && result.length > 0) {
                    return result[0].meshes;
                }

                return null;
            };
            return Vegetation;
        })();
        Resource.Vegetation = Vegetation;
    })(Terrain.Resource || (Terrain.Resource = {}));
    var Resource = Terrain.Resource;
})(Terrain || (Terrain = {}));
