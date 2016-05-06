module Terrain.Resources {

    export class ResourcesManager  {

        private static instance: ResourcesManager;

        private resources: Array<Resource>;

        public static GetInstance(): ResourcesManager {
            if (ResourcesManager.instance == null) {
                ResourcesManager.instance = new ResourcesManager();
            }

            return ResourcesManager.instance;
        }

        constructor() {
            this.resources = new Array<Resource>();
        }

        public AddUpdateResource(resourceUpdate: IResourceUpdate): void {
            var exintingResource = this.GetResource(resourceUpdate.ResourceType);

            if (exintingResource != null) {
                exintingResource.Stock = resourceUpdate.Stock;
            } else {
                var localResource = new Resource(resourceUpdate.Stock, resourceUpdate.ResourceType);
                this.resources.push(localResource);               
            }

            this.GetResource(resourceUpdate.ResourceType).Update();
        }

        public GetResource(resourceType: ResourceType): Resource {
            var result = this.resources.filter((resource) => resource.ResourceType == resourceType);

            if (result.length == 0) {
                return null;
            }
            return result[0];
        }
    }
}     