module Terrain.Models {

    export enum TextureType {
        Texture,
        DynamicTexture
    }

    export class BasicGeometryModel extends BaseModel {    
        geometry: GeometryType;
        options: any;
        diffuseTexture: BABYLON.Texture;
        diffuseColor: BABYLON.Color3;       
        
        defaultBillBoardMode: number;        

        scene: BABYLON.Scene;       

        constructor(geometry: GeometryType, options: any, name: string, textureType: TextureType, textureUrl: string, textureColor: BABYLON.Color3, billboardMode: number, scene : BABYLON.Scene) {
            super(name, scene);

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

        public GetGeometry(): GeometryType {
            return this.geometry;
        }

        public CreateMeshes(name: string, size: number, scaling: BABYLON.Vector3 = new BABYLON.Vector3(1,1,1)): Array<BABYLON.AbstractMesh> {

            var mesh: BABYLON.Mesh;

            switch (this.geometry) {
                case GeometryType.Plane:
                    mesh = BABYLON.Mesh.CreatePlane(name, size, this.scene, false);                    
                break;
                case GeometryType.Cylinder:
                    var diameterTop: number = 1;                   
                    var diameterBottom: number = 1;
                    var tessellation: number = 1;

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
                case GeometryType.Torus:
                    var diameter: number = 5;
                    var thickness: number = 1;
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
            } else {
                mesh.isPickable = false;                 
            }            

            return [mesh];
        } 

        private GetMaterial(): BABYLON.StandardMaterial {
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
        }
    }
}  
