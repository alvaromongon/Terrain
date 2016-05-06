var Terrain;
(function (Terrain) {
    var Utilities;
    (function (Utilities) {
        function IsASCII(text, extended) {
            return (extended ? /^[\x00-\xFF]*$/ : /^[\x00-\x7F]*$/).test(text);
        }
        Utilities.IsASCII = IsASCII;
    })(Utilities = Terrain.Utilities || (Terrain.Utilities = {}));
})(Terrain || (Terrain = {}));
