module Terrain.Account {

    export interface IResourcesManager {

        AddUpdateResource(resource: IResource): void;

        GetResource(resource: ResourceType): IResource;

    }
}  
  