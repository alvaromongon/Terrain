module Terrain.Utilities {

    export function IsASCII(text: string, extended: boolean): boolean {
        return (extended ? /^[\x00-\xFF]*$/ : /^[\x00-\x7F]*$/).test(text);
    } 

    export function GetPositionedModelName(position: BABYLON.Vector3): string {
        return "(" + Math.floor(position.x) + "," + Math.floor(position.z) + ")";
    }

    export function GetNearestPositionedModelNames(position: BABYLON.Vector3): Array<string> {
        var modelNames  = new Array<string>();

        modelNames.push(Terrain.Utilities.GetPositionedModelName(position));
        modelNames.push("(" + Math.ceil(position.x) + "," + Math.floor(position.z) + ")");
        modelNames.push("(" + Math.floor(position.x) + "," + Math.ceil(position.z) + ")");
        modelNames.push("(" + Math.ceil(position.x) + "," + Math.ceil(position.z) + ")");

        return modelNames;
    }

}