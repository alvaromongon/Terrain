module Terrain.Models {

    export enum GeometryType {
        Unknown,
        Plane,
        Cylinder,
        Torus,
    }

    export class BaseModelsContainer {

        private scene: BABYLON.Scene;        
        private defaultSize: number;

        private models: Utilities.Dictionary<BaseModel>;
        public sizes: Utilities.Dictionary<number>;
        public scalings: Utilities.Dictionary<BABYLON.Vector3>;       

        constructor(scene: BABYLON.Scene) {
            this.scene = scene;

            this.models = new Utilities.Dictionary<BaseModel>();
            this.sizes = new Utilities.Dictionary<number>();
            this.scalings = new Utilities.Dictionary<BABYLON.Vector3>();
        }

        public ImportComplexGeometryDBabylonModel(name: string, rootTextureUrl: string, textureFileName: string, size: number, scaling: BABYLON.Vector3 = new BABYLON.Vector3(1, 1, 1)): void {
            BABYLON.SceneLoader.ImportMesh("", rootTextureUrl, textureFileName, this.scene, (newMeshes) => {

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

                var model = new ComplexGeometryModel(name, newMeshes, this.scene);

                this.models.add(name, model);
                this.sizes.add(name, size);
                this.scalings.add(name, scaling);
            });
        }

        public ImportBasicGeometryModelStandardTexture(geometry: GeometryType, options: any, modelName: string, textureUrl: string, billboardMode: number, size: number, scaling: BABYLON.Vector3 = new BABYLON.Vector3(1, 1, 1)): void {

            var model = new BasicGeometryModel(geometry, options, modelName, TextureType.Texture, textureUrl, null, billboardMode, this.scene);

            this.models.add(modelName, model);
            this.sizes.add(modelName, size);
            this.scalings.add(modelName, scaling);
        }  
        
        public ImportBasicGeometryModelDynamicTexture(geometry: GeometryType, options: any, modelName: string, textureColor: BABYLON.Color3, billboardMode: number, size: number, scaling: BABYLON.Vector3 = new BABYLON.Vector3(1, 1, 1)): void {

            var model = new BasicGeometryModel(geometry, options, modelName, TextureType.DynamicTexture, null, textureColor, billboardMode, this.scene);

            this.models.add(modelName, model);
            this.sizes.add(modelName, size);
            this.scalings.add(modelName, scaling);
        }  
        
        public GetBasicModelGeometry(modelName: string): GeometryType {
            var model = this.findModelByName(modelName);

            if (model == null || !(model instanceof BasicGeometryModel)) {
                return GeometryType.Unknown;
            }

            return (<BasicGeometryModel>model).GetGeometry();            
        }     

        public CreateNewModelInstanceMeshes(modelName: string): Array<BABYLON.AbstractMesh> {
            var model = this.findModelByName(modelName);

            if (model == null) {
                return null;
            }

            return model.CreateMeshes(modelName + "_inst", this.sizes.getByKey(modelName), this.scalings.getByKey(modelName));
        }

        private findModelByName(modelName: string): BaseModel {
            var model = this.models.getByKey(modelName);

            if (model == null) {
                console.log("findModelByName, modelName could not be found, name: " + modelName);
            }

            return model;
        }
    }

} 