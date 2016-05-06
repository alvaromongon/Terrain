var Terrain;
(function (Terrain) {
    var Models;
    (function (Models) {
        (function (TextPosition) {
            TextPosition[TextPosition["center"] = 0] = "center";
            TextPosition[TextPosition["centerLeft"] = 1] = "centerLeft";
            TextPosition[TextPosition["centerRight"] = 2] = "centerRight";
            TextPosition[TextPosition["topleft"] = 3] = "topleft";
            TextPosition[TextPosition["top"] = 4] = "top";
            TextPosition[TextPosition["topRight"] = 5] = "topRight";
        })(Models.TextPosition || (Models.TextPosition = {}));
        var TextPosition = Models.TextPosition;
        var BaseInstanceModel = (function () {
            function BaseInstanceModel(meshes, size, geometry) {
                // The position of a mesh identify the center of an object. But the system position elements on the center bottom.
                // The originaly position will be modified to position the center bottom of the object on the requested position.
                // But when retrieving the position with a "GetPosition" the real requested position of the object should be provided.
                this.originalPosition = null;
                if (meshes.length == 0) {
                    throw "Meshes argument needs at least one mesh";
                }
                this.meshes = meshes;
                this._size = size;
                this.geometry = geometry;
            }
            BaseInstanceModel.prototype.SetPosition = function (position) {
                if (position == null) {
                    console.log("SetPosition, position parameter cannot be null");
                    return;
                }
                this.name = this.meshes[0].name;
                this.originalPosition = position.clone();
                position = position.clone(); //Create new object to avoid changing value by reference
                switch (this.geometry) {
                    case Models.GeometryType.Plane:
                    case Models.GeometryType.Cylinder:
                    case Models.GeometryType.Torus:
                        position.y += (this.meshes[0].scaling.y * this._size) / 2;
                        break;
                }
                this.meshes.forEach(function (mesh) { mesh.position = position; });
            };
            BaseInstanceModel.prototype.GetName = function () {
                return this.name;
            };
            BaseInstanceModel.prototype.GetPosition = function () {
                return this.originalPosition == null ? null : this.originalPosition.clone();
            };
            BaseInstanceModel.prototype.IsSameMesh = function (mesh) {
                return this.meshes[0] == mesh;
            };
            BaseInstanceModel.prototype.Hide = function () {
                //console.log("Hide instance model : " + this.name);
                this.meshes.forEach(function (mesh) { mesh.isVisible = false; });
            };
            BaseInstanceModel.prototype.Show = function () {
                //console.log("Show instance model : " + this.name);
                this.meshes.forEach(function (mesh) { mesh.isVisible = true; });
            };
            BaseInstanceModel.prototype.LaunchParticles = function () {
                var particleSystem = new BABYLON.ParticleSystem("particles", 4000, this.meshes[0].getScene());
                particleSystem.particleTexture = new BABYLON.Texture("Assets/Icons/Flare.png", this.meshes[0].getScene());
                particleSystem.minAngularSpeed = -4.5;
                particleSystem.maxAngularSpeed = 4.5;
                particleSystem.minSize = 0.5;
                particleSystem.maxSize = 4.0;
                particleSystem.minLifeTime = 0.5;
                particleSystem.maxLifeTime = 2.0;
                particleSystem.minEmitPower = 0.5;
                particleSystem.maxEmitPower = 1.0;
                particleSystem.emitRate = 400;
                particleSystem.blendMode = BABYLON.ParticleSystem.BLENDMODE_ONEONE;
                particleSystem.minEmitBox = new BABYLON.Vector3(0, 0, 0);
                particleSystem.maxEmitBox = new BABYLON.Vector3(0, 0, 0);
                particleSystem.direction1 = new BABYLON.Vector3(0, 1, 0);
                particleSystem.direction2 = new BABYLON.Vector3(0, 1, 0);
                particleSystem.color1 = new BABYLON.Color4(0, 0, 1, 1);
                particleSystem.color2 = new BABYLON.Color4(1, 1, 1, 1);
                particleSystem.gravity = new BABYLON.Vector3(0, 5, 0);
                particleSystem.manualEmitCount = 0;
                particleSystem.emitter = new BABYLON.Vector3(0, 0, 0);
                particleSystem.start();
                particleSystem.emitter = this.meshes[0];
                particleSystem.manualEmitCount += 400;
            };
            BaseInstanceModel.prototype.IsHighLighted = function () {
                var standardMaterial = this.meshes[0].material;
                if (standardMaterial) {
                    return standardMaterial.emissiveColor.r == 1.0 && standardMaterial.emissiveColor.g == 1.0 && standardMaterial.emissiveColor.b == 1.0;
                }
                ;
                return false;
            };
            BaseInstanceModel.prototype.HighLight = function () {
                this.meshes.forEach(function (mesh) {
                    var standardMaterial = mesh.material;
                    if (standardMaterial) {
                        standardMaterial.emissiveColor = new BABYLON.Color3(1.0, 1.0, 1.0);
                    }
                    ;
                });
            };
            BaseInstanceModel.prototype.DeHighLight = function () {
                this.meshes.forEach(function (mesh) {
                    var standardMaterial = mesh.material;
                    if (standardMaterial) {
                        standardMaterial.emissiveColor = new BABYLON.Color3(0.0, 0.0, 0.0);
                    }
                    ;
                });
            };
            BaseInstanceModel.prototype.Dispose = function () {
                //console.log("Dispose instance model : " + this.name);
                this.meshes.forEach(function (mesh) { mesh.dispose(); });
                this.meshes = null;
            };
            BaseInstanceModel.prototype.WriteText = function (text) {
                this.meshes.forEach(function (mesh) {
                    if (mesh.material instanceof BABYLON.StandardMaterial && mesh.material.diffuseTexture instanceof BABYLON.DynamicTexture) {
                        var texture = mesh.material.diffuseTexture;
                        var context = texture.getContext();
                        var clearColor = "gray";
                        var font = "40px Segoe UI";
                        var invertY = true;
                        var color = "white";
                        var size = texture.getSize();
                        //Background
                        if (clearColor) {
                            context.fillStyle = clearColor;
                            context.fillRect(0, 0, size.width, size.height);
                        }
                        //Text
                        context.font = font;
                        context.fillStyle = color;
                        context.textBaseline = "top";
                        //context.fillText(text, 10, 10);
                        context.wrapText(text, 5, 5, size.width - 10, 50);
                        texture.update(invertY);
                    }
                    else {
                        console.log("Trying to write text on a model instance but the material is not StandardMaterial or the diffuseTexture is not DynamicTexture");
                    }
                });
            };
            return BaseInstanceModel;
        })();
        Models.BaseInstanceModel = BaseInstanceModel;
    })(Models = Terrain.Models || (Terrain.Models = {}));
})(Terrain || (Terrain = {}));
//# sourceMappingURL=BaseInstanceModel.js.map