var Terrain;
(function (Terrain) {
    var Utilities;
    (function (Utilities) {
        function IsASCII(text, extended) {
            return (extended ? /^[\x00-\xFF]*$/ : /^[\x00-\x7F]*$/).test(text);
        }
        Utilities.IsASCII = IsASCII;
        function GetPositionedModelName(position) {
            return "(" + Math.floor(position.x) + "," + Math.floor(position.z) + ")";
        }
        Utilities.GetPositionedModelName = GetPositionedModelName;
        function GetNearestPositionedModelNames(position) {
            var modelNames = new Array();
            modelNames.push(Terrain.Utilities.GetPositionedModelName(position));
            modelNames.push("(" + Math.ceil(position.x) + "," + Math.floor(position.z) + ")");
            modelNames.push("(" + Math.floor(position.x) + "," + Math.ceil(position.z) + ")");
            modelNames.push("(" + Math.ceil(position.x) + "," + Math.ceil(position.z) + ")");
            return modelNames;
        }
        Utilities.GetNearestPositionedModelNames = GetNearestPositionedModelNames;
    })(Utilities = Terrain.Utilities || (Terrain.Utilities = {}));
})(Terrain || (Terrain = {}));
//# sourceMappingURL=StringHelper.js.map