module Terrain.Utilities {

    export function IsASCII(text: string, extended: boolean): boolean {
        return (extended ? /^[\x00-\xFF]*$/ : /^[\x00-\x7F]*$/).test(text);
    } 

}