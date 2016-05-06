var Terrain;
(function (Terrain) {
    var Models;
    (function (Models) {
        (function (GeometryType) {
            GeometryType[GeometryType["Unknown"] = 0] = "Unknown";
            GeometryType[GeometryType["Plane"] = 1] = "Plane";
            GeometryType[GeometryType["Cylinder"] = 2] = "Cylinder";
            GeometryType[GeometryType["Torus"] = 3] = "Torus";
        })(Models.GeometryType || (Models.GeometryType = {}));
        var GeometryType = Models.GeometryType;
        var BaseModelsContainer = (function () {
            function BaseModelsContainer(scene) {
                this.scene = scene;
                this.models = new Terrain.Utilities.Dictionary();
                this.sizes = new Terrain.Utilities.Dictionary();
                this.scalings = new Terrain.Utilities.Dictionary();
            }
            BaseModelsContainer.prototype.ImportComplexGeometryDBabylonModel = function (name, rootTextureUrl, textureFileName, size, scaling) {
                var _this = this;
                if (scaling === void 0) { scaling = new BABYLON.Vector3(1, 1, 1); }
                BABYLON.SceneLoader.ImportMesh("", rootTextureUrl, textureFileName, this.scene, function (newMeshes) {
                    //newMeshes[0].material.backFaceCulling = false;
                    //newMeshes[0].isVisible = false;
                    //newMeshes[0].scaling.x = scale;
                    //newMeshes[0].scaling.y = scale;
                    //newMeshes[0].scaling.z = scale;
                    for (var i = 0; i < newMeshes.length; i++) {
                        if (newMeshes[i].material) {
                            newMeshes[i].material.backFaceCulling = false;
                        }
                        newMeshes[i].isVisible = false;
                        newMeshes[i].scaling.x = 1;
                        newMeshes[i].scaling.y = 1;
                        newMeshes[i].scaling.z = 1;
                    }
                    var model = new Models.ComplexGeometryModel(name, newMeshes, _this.scene);
                    _this.models.add(name, model);
                    _this.sizes.add(name, size);
                    _this.scalings.add(name, scaling);
                });
            };
            BaseModelsContainer.prototype.ImportBasicGeometryModelStandardTexture = function (geometry, options, modelName, textureUrl, billboardMode, size, scaling) {
                if (scaling === void 0) { scaling = new BABYLON.Vector3(1, 1, 1); }
                var model = new Models.BasicGeometryModel(geometry, options, modelName, Models.TextureType.Texture, textureUrl, null, billboardMode, this.scene);
                this.models.add(modelName, model);
                this.sizes.add(modelName, size);
                this.scalings.add(modelName, scaling);
            };
            BaseModelsContainer.prototype.ImportBasicGeometryModelDynamicTexture = function (geometry, options, modelName, textureColor, billboardMode, size, scaling) {
                if (scaling === void 0) { scaling = new BABYLON.Vector3(1, 1, 1); }
                var model = new Models.BasicGeometryModel(geometry, options, modelName, Models.TextureType.DynamicTexture, null, textureColor, billboardMode, this.scene);
                this.models.add(modelName, model);
                this.sizes.add(modelName, size);
                this.scalings.add(modelName, scaling);
            };
            BaseModelsContainer.prototype.GetBasicModelGeometry = function (modelName) {
                var model = this.findModelByName(modelName);
                if (model == null || !(model instanceof Models.BasicGeometryModel)) {
                    return GeometryType.Unknown;
                }
                return model.GetGeometry();
            };
            BaseModelsContainer.prototype.CreateNewModelInstanceMeshes = function (modelName) {
                var model = this.findModelByName(modelName);
                if (model == null) {
                    return null;
                }
                return model.CreateMeshes(modelName + "_inst", this.sizes.getByKey(modelName), this.scalings.getByKey(modelName));
            };
            BaseModelsContainer.prototype.findModelByName = function (modelName) {
                var model = this.models.getByKey(modelName);
                if (model == null) {
                    console.log("findModelByName, modelName could not be found, name: " + modelName);
                }
                return model;
            };
            return BaseModelsContainer;
        })();
        Models.BaseModelsContainer = BaseModelsContainer;
    })(Models = Terrain.Models || (Terrain.Models = {}));
})(Terrain || (Terrain = {}));
//# sourceMappingURL=BaseModelsContainer.js.map