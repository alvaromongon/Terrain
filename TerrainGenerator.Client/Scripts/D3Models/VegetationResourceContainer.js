var Terrain;
(function (Terrain) {
    (function (_3DModels) {
        var VegetationResourceContainer = (function () {
            function VegetationResourceContainer(scene) {
                this.scene = scene;
                this.resources = [];
            }
            VegetationResourceContainer.GetInstance = function (scene) {
                if (VegetationResourceContainer.instance == null) {
                    var vegetationResourceContainer = new VegetationResourceContainer(scene);
                    vegetationResourceContainer.Initialize();
                    VegetationResourceContainer.instance = vegetationResourceContainer;
                }

                return VegetationResourceContainer.instance;
            };

            VegetationResourceContainer.GetExistingInstance = function () {
                return VegetationResourceContainer.instance;
            };

            VegetationResourceContainer.prototype.Initialize = function () {
                this.Import3DModel("tree_0", "/Assets/Trees/", "tree_0.babylon", 0.02);
                this.Import3DModel("tree_1", "/Assets/Trees/", "tree_1.babylon", 0.03);
                this.Import3DModel("tree_2", "/Assets/Trees/", "tree_2.babylon", 0.03);
                this.Import3DModel("tree_3", "/Assets/Trees/", "tree_3.babylon", 0.03);
                this.Import3DModel("tree_4", "/Assets/Trees/", "tree_4.babylon", 0.04);
                this.Import3DModel("tree_5", "/Assets/Trees/", "tree_5.babylon", 0.03);
                this.Import3DModel("tree_6", "/Assets/Trees/", "tree_6.babylon", 0.02);
            };

            VegetationResourceContainer.prototype.Import3DModel = function (name, rootUrl, sceneFilename, scale) {
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

            VegetationResourceContainer.prototype.Get3DModel = function (name) {
                var result = this.resources.filter(function (resource) {
                    return resource.name == name;
                });

                if (result && result.length > 0) {
                    return result[0].meshes;
                }

                return null;
            };
            return VegetationResourceContainer;
        })();
        _3DModels.VegetationResourceContainer = VegetationResourceContainer;
    })(Terrain._3DModels || (Terrain._3DModels = {}));
    var _3DModels = Terrain._3DModels;
})(Terrain || (Terrain = {}));
