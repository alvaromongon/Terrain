module Terrain.Account {
    export class Resource implements IResource {
        Stock: number;
        ResourceType: ResourceType;
        tag: HTMLElement;

        constructor(stock: number, resourceType: ResourceType) {
            this.Stock = stock;
            this.ResourceType = resourceType;

            this.CreateTagFromType();
        }

        public Equal(other: IResource): boolean {
            return (this.ResourceType == other.ResourceType);
        }

        public Update(): void {
            this.CreateTagFromType();

            this.tag.innerHTML = this.Stock.toString();
        }

        private CreateTagFromType(): void {
            if (!this.tag) {
                this.tag = document.getElementById(ResourceType[this.ResourceType]);
            }
        }
    }

    export enum ResourceType {
        food,
        wood,
        stone
    }
} 