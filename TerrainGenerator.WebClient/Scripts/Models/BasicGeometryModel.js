var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Terrain;
(function (Terrain) {
    var Models;
    (function (Models) {
        (function (TextureType) {
            TextureType[TextureType["Texture"] = 0] = "Texture";
            TextureType[TextureType["DynamicTexture"] = 1] = "DynamicTexture";
        })(Models.TextureType || (Models.TextureType = {}));
        var TextureType = Models.TextureType;
        var BasicGeometryModel = (function (_super) {
            __extends(BasicGeometryModel, _super);
            function BasicGeometryModel(geometry, options, name, textureType, textureUrl, textureColor, billboardMode, scene) {
                _super.call(this, name, scene);
                this.geometry = geometry;
                this.options = options;
                switch (textureType) {
                    case TextureType.DynamicTexture:
                        this.diffuseTexture = new BABYLON.DynamicTexture("", 512, scene, true);
                        break;
                    default:
                        if (textureUrl && textureUrl.length > 0) {
                            this.diffuseTexture = new BABYLON.Texture(textureUrl, scene);
                            this.diffuseTexture.hasAlpha = true;
                        }
                }
                if (textureColor) {
                    this.diffuseColor = textureColor;
                }
                this.defaultBillBoardMode = billboardMode;
                this.scene = scene;
            }
            BasicGeometryModel.prototype.GetGeometry = function () {
                return this.geometry;
            };
            BasicGeometryModel.prototype.CreateMeshes = function (name, size, scaling) {
                if (scaling === void 0) { scaling = new BABYLON.Vector3(1, 1, 1); }
                var mesh;
                switch (this.geometry) {
                    case Models.GeometryType.Plane:
                        mesh = BABYLON.Mesh.CreatePlane(name, size, this.scene, false);
                        break;
                    case Models.GeometryType.Cylinder:
                        var diameterTop = 1;
                        var diameterBottom = 1;
                        var tessellation = 1;
                        if (this.options) {
                            if (this.options.diameterTop) {
                                diameterTop = this.options.diameterTop;
                            }
                            if (this.options.diameterBottom) {
                                diameterBottom = this.options.diameterBottom;
                            }
                            if (this.options.tessellation) {
                                tessellation = this.options.tessellation;
                            }
                        }
                        mesh = BABYLON.Mesh.CreateCylinder(name, size, diameterTop, diameterBottom, tessellation, 1, this.scene);
                        break;
                    case Models.GeometryType.Torus:
                        var diameter = 5;
                        var thickness = 1;
                        tessellation = 20;
                        if (this.options) {
                            if (this.options.diameter) {
                                diameter = this.options.diameter;
                            }
                            if (this.options.thickness) {
                                thickness = this.options.thickness;
                            }
                            if (this.options.tessellation) {
                                tessellation = this.options.tessellation;
                            }
                        }
                        mesh = BABYLON.Mesh.CreateTorus(name, diameter, thickness, tessellation, this.scene, false);
                        break;
                    default:
                        console.log("Not supported geometry requested for a basic geometry model : " + this.geometry);
                }
                if (!mesh) {
                    console.log("Imposible to create model, Geometry type is not supported: " + this.geometry);
                    return null;
                }
                mesh.scaling = scaling;
                mesh.billboardMode = this.defaultBillBoardMode;
                mesh.material = this.GetMaterial();
                if (this.options) {
                    if (this.options.isPickable) {
                        mesh.isPickable = this.options.isPickable;
                    }
                }
                else {
                    mesh.isPickable = false;
                }
                return [mesh];
            };
            BasicGeometryModel.prototype.GetMaterial = function () {
                var material = new BABYLON.StandardMaterial('', this.scene);
                if (this.diffuseColor) {
                    material.diffuseColor = this.diffuseColor;
                }
                if (this.diffuseTexture) {
                    material.diffuseTexture = this.diffuseTexture;
                }
                material.specularColor = new BABYLON.Color3(0, 0, 0); // No specular color
                material.ambientColor = new BABYLON.Color3(0, 0, 0); // No ambient color
                material.emissiveColor = new BABYLON.Color3(0, 0, 0); // No emissive color
                material.backFaceCulling = false;
                return material;
            };
            return BasicGeometryModel;
        })(Models.BaseModel);
        Models.BasicGeometryModel = BasicGeometryModel;
    })(Models = Terrain.Models || (Terrain.Models = {}));
})(Terrain || (Terrain = {}));
//# sourceMappingURL=BasicGeometryModel.js.map