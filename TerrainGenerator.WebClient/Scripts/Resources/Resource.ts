module Terrain.Resources {

    // This string value has to match with the id of the dev that indicate the number of resource availables
    export enum ResourceType {
        noBuildingAllowed = -1, // This resource does not exist in the back end

        empty = 0,
        population = 1,
        unemployedManpower = 2,
        manpower = 3,
        food = 4,
        foodLimit = 5,
        wood = 6,
    }

    export class Resource {
        Stock: number;
        ResourceType: ResourceType;
        tag: HTMLElement;

        constructor(stock: number, resourceType: ResourceType) {
            this.Stock = stock;
            this.ResourceType = resourceType;

            this.CreateTagFromType();
        }

        public Equal(other: Resource): boolean {
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
} 