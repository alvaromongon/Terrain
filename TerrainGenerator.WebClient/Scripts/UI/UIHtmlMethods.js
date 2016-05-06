var Terrain;
(function (Terrain) {
    var UI;
    (function (UI) {
        (function (Horientation) {
            Horientation[Horientation["horizontal"] = 0] = "horizontal";
            Horientation[Horientation["vertical"] = 1] = "vertical";
        })(UI.Horientation || (UI.Horientation = {}));
        var Horientation = UI.Horientation;
        (function (Direction) {
            Direction[Direction["top"] = 0] = "top";
            Direction[Direction["bottom"] = 1] = "bottom";
            Direction[Direction["left"] = 2] = "left";
            Direction[Direction["right"] = 3] = "right";
        })(UI.Direction || (UI.Direction = {}));
        var Direction = UI.Direction;
        function UpdateMiniMapPosition(xPosition, zPosition, rotationInRadians) {
            if ($("#imageMiniMap").width() > 0) {
                //TODO: If width and height are predifine, make calculation only once, and not every time
                var origin = Terrain.Tiles.TilesManager.GetInstance().GetCenterTilePosition();
                if (origin) {
                    var amplitud = Terrain.Tiles.TilesManager.GetInstance().GetAmplitud();
                    var offSet = amplitud / 2;
                    var rotationInDegrees = rotationInRadians * 57.2957795131;
                    // position without rotation
                    // Using the center point of the triangle
                    var x = (((xPosition + offSet - origin.x) * $("#imageMiniMap").width()) / amplitud) - ($("#redTriangle").width() / 2);
                    var z = (((-zPosition + offSet + origin.z) * $("#imageMiniMap").height()) / amplitud) - ($("#redTriangle").height() / 2);
                    $("#redTriangle").css({ left: x, top: z });
                    $('#redTriangle').css('transform', 'rotate(' + rotationInDegrees + 'deg)');
                    $("#redTriangle").removeClass("hidden");
                }
            }
        }
        UI.UpdateMiniMapPosition = UpdateMiniMapPosition;
        function Slide(element, horientation, direction) {
            if (!$(element).hasClass('hidden')) {
                var newValue;
                if ($(element).hasClass('slided')) {
                    newValue = 0;
                    $(element).removeClass('slided');
                }
                else {
                    newValue = -1 * ((horientation == Horientation.vertical ? $(element).width() : $(element).height()) - 10);
                    $(element).addClass('slided');
                }
                var animateExpresion;
                switch (direction) {
                    case Direction.left:
                        animateExpresion = { 'left': newValue };
                        break;
                    case Direction.right:
                        animateExpresion = { 'right': newValue };
                        break;
                    case Direction.top:
                        animateExpresion = { 'top': newValue };
                        break;
                    case Direction.bottom:
                        animateExpresion = { 'bottom': newValue };
                        break;
                }
                $(element).animate(animateExpresion, 700);
            }
        }
        UI.Slide = Slide;
    })(UI = Terrain.UI || (Terrain.UI = {}));
})(Terrain || (Terrain = {}));
//# sourceMappingURL=UIHtmlMethods.js.map