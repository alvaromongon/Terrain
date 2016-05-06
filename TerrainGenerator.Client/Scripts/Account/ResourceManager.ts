module Terrain.Account {

    export class ResourceManager implements IResourcesManager {

        private static instance: IResourcesManager;

        private resources: Array<IResource>;

        public static GetInstance(): IResourcesManager {
            if (ResourceManager.instance == null) {
                ResourceManager.instance = new ResourceManager();
            }

            return ResourceManager.instance;
        }

        constructor() {
            this.resources = new Array<IResource>();
        }

        public AddUpdateResource(resource: IResource): void {
            var exintingResource = this.GetResource(resource.ResourceType);

            if (exintingResource != null) {
                exintingResource.Stock = resource.Stock;
            } else {
                var localResource = new Resource(resource.Stock, resource.ResourceType);
                this.resources.push(localResource);               
            }

            this.GetResource(resource.ResourceType).Update();
        }

        public GetResource(resourceType: ResourceType): IResource {
            var result = this.resources.filter((resource) => resource.ResourceType == resourceType);

            if (result.length == 0) {
                return null;
            }
            return result[0];
        }
    }
}     