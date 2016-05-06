module Terrain.Utilities {

    export class Dictionary<T> {
        private items = [];

        add(key: string, value: T) : void {
            this.items.push(value);
            this.items[key] = value;
        }

        remove(key: string): void {
            var index = this.items.indexOf(key, 0);
            if (index != undefined) {
                this.items.splice(index, 1);
            }
        }

        getByIndex(index: number) {
            return this.items[index];
        }

        getByKey(key: string) : T {
            return this.items[key];
        }

        getValues(): Array<T> {
            return this.items;
        }

        length(): number {
            return this.items.length;
        }
    }
 
}