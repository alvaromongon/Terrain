module Terrain.Tiles {
    export interface ITileCell {
        a: number;
        t: number;
        c: number;
    }

    export class TileCell implements ITileCell {
        public a: number;
        public t: number;
        public c: number;

        constructor(altitude: number, type: number, content: number) {
            this.a = altitude;
            this.t = type;
            this.c = content;
        }
    }
}    