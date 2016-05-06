module Terrain.UI {

    export enum Horientation {
        horizontal = 0,
        vertical = 1
    }

    export enum Direction {
        top = 0,
        bottom = 1,
        left = 2,
        right = 3
    }

    export function UpdateMiniMapPosition(xPosition: number, zPosition: number, rotationInRadians: number) {

        if ($("#imageMiniMap").width() > 0) {

            //TODO: If width and height are predifine, make calculation only once, and not every time

            var origin = Tiles.TilesManager.GetInstance().GetCenterTilePosition();
            if (origin) {
                var amplitud: number = Tiles.TilesManager.GetInstance().GetAmplitud();
                var offSet: number = amplitud / 2;
                var rotationInDegrees = rotationInRadians * 57.2957795131;

                // position without rotation
                // Using the center point of the triangle
                var x: number = (((xPosition + offSet - origin.x) * $("#imageMiniMap").width()) / amplitud) - ($("#redTriangle").width() / 2);
                var z: number = (((-zPosition + offSet + origin.z) * $("#imageMiniMap").height()) / amplitud) - ($("#redTriangle").height() / 2);

                $("#redTriangle").css({ left: x, top: z });
                $('#redTriangle').css('transform', 'rotate(' + rotationInDegrees + 'deg)');
                $("#redTriangle").removeClass("hidden");
            }
        }
    }

    export function Slide(element: string, horientation: Horientation, direction: Direction) {
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
}   