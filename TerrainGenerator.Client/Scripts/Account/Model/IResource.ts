module Terrain.Account {

    export interface IResource {

        Stock: number;
        ResourceType: ResourceType;
        tag: HTMLElement;

        Equal(other: IResource): boolean;

        Update(): void;
    }
}
