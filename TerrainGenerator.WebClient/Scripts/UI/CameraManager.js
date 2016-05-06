var Terrain;
(function (Terrain) {
    var UI;
    (function (UI) {
        var CameraManager = (function () {
            function CameraManager(canvas, scene, minAllowedCameraAltitudeOverTerrain, maxAllowedCameraAltitudeOverTerrain) {
                this.canvas = canvas;
                this.scene = scene;
                this.minAllowedCameraAltitudeOverTerrain = minAllowedCameraAltitudeOverTerrain;
                this.maxAllowedCameraAltitudeOverTerrain = maxAllowedCameraAltitudeOverTerrain;
                this.cameras = new Terrain.Utilities.Dictionary();
                this.camerasProperties = new Terrain.Utilities.Dictionary();
            }
            CameraManager.GetInstance = function () {
                return CameraManager.instance;
            };
            CameraManager.Initialize = function (canvas, scene, systemConfiguration) {
                if (CameraManager.instance == null) {
                    CameraManager.instance = new CameraManager(canvas, scene, systemConfiguration.MinAllowedCameraAltitudeOverTerrain, systemConfiguration.MaxAllowedCameraAltitudeOverTerrain);
                }
                var freeCamera = new BABYLON.FreeCamera(CameraManager.freeCamera, new BABYLON.Vector3(0, systemConfiguration.MaxMinHeight, 0), CameraManager.instance.scene);
                freeCamera.checkCollisions = true;
                freeCamera.ellipsoid = new BABYLON.Vector3(1, 1, 1);
                //freeCamera2.applyGravity = true;   
                freeCamera.speed = 3.0;
                freeCamera.inertia = 0;
                CameraManager.instance.cameras.add(CameraManager.freeCamera, freeCamera);
                CameraManager.instance.camerasProperties.add(CameraManager.freeCamera, { positionY: freeCamera.position.y });
                var arcRotateCamera = new BABYLON.ArcRotateCamera(CameraManager.arcRotateCamera, -(Math.PI / 2), 0.9, systemConfiguration.MaxMinHeight * 2, BABYLON.Vector3.Zero(), CameraManager.instance.scene);
                arcRotateCamera.checkCollisions = true;
                arcRotateCamera.speed = 3.0;
                arcRotateCamera.inertia = 0;
                //arcRotateCamera.position = new BABYLON.Vector3(systemConfiguration.GridSize / 2, systemConfiguration.MaxMinHeight, systemConfiguration.GridSize / 2);
                CameraManager.instance.cameras.add(CameraManager.arcRotateCamera, arcRotateCamera);
                CameraManager.instance.camerasProperties.add(CameraManager.arcRotateCamera, { radiusTarget: arcRotateCamera.radius, speed: new BABYLON.Vector2(0.0, 0.0) });
                CameraManager.instance.scene.activeCamera = arcRotateCamera;
            };
            CameraManager.prototype.GetActiveCameraTilePosition = function () {
                if (this.scene.activeCamera.name == CameraManager.arcRotateCamera) {
                    var arcRotateCamera = this.scene.activeCamera;
                    return arcRotateCamera.target;
                }
                if (this.scene.activeCamera.name == CameraManager.freeCamera) {
                    var freeCamera = this.scene.activeCamera;
                    return freeCamera.position;
                }
                return null;
            };
            CameraManager.prototype.GetActiveCameraMiniMapPosition = function () {
                if (this.scene.activeCamera.name == CameraManager.arcRotateCamera) {
                    var arcRotateCamera = this.scene.activeCamera;
                    return arcRotateCamera.position;
                }
                if (this.scene.activeCamera.name == CameraManager.freeCamera) {
                    var freeCamera = this.scene.activeCamera;
                    return freeCamera.position;
                }
                return null;
            };
            CameraManager.prototype.GetActiveCameraRotation = function () {
                if (this.scene.activeCamera.name == CameraManager.arcRotateCamera) {
                    var arcRotateCamera = this.scene.activeCamera;
                    return arcRotateCamera.alpha + (Math.PI / 2);
                }
                if (this.scene.activeCamera.name == CameraManager.freeCamera) {
                    var freeCamera = this.scene.activeCamera;
                    return freeCamera.rotation.y;
                }
            };
            CameraManager.prototype.SwiftActiveCamera = function () {
                if (this.scene.activeCamera.name == CameraManager.arcRotateCamera) {
                    this.scene.activeCamera = this.cameras.getByKey(CameraManager.freeCamera);
                    return;
                }
                if (this.scene.activeCamera.name == CameraManager.freeCamera) {
                    this.scene.activeCamera = this.cameras.getByKey(CameraManager.arcRotateCamera);
                    return;
                }
            };
            CameraManager.prototype.MoveCameraZoom = function (wheelChange) {
                if (this.scene.activeCamera.name == CameraManager.arcRotateCamera) {
                    var currentTarget = this.camerasProperties.getByKey(CameraManager.arcRotateCamera).radiusTarget;
                    currentTarget += currentTarget * wheelChange;
                    this.camerasProperties.getByKey(CameraManager.arcRotateCamera).radiusTarget = currentTarget;
                    return;
                }
                if (this.scene.activeCamera.name == CameraManager.freeCamera) {
                    var positionY = this.camerasProperties.getByKey(CameraManager.freeCamera).positionY;
                    positionY += positionY * wheelChange;
                    this.camerasProperties.getByKey(CameraManager.freeCamera).positionY = positionY;
                    return;
                }
            };
            CameraManager.prototype.MoveCameraRelative = function (delta) {
                if (this.scene.activeCamera.name == CameraManager.arcRotateCamera) {
                    var camera = this.scene.activeCamera;
                    // compute world vector with camera orientation
                    var vec_right = new BABYLON.Vector2(-Math.sin(camera.alpha), Math.cos(camera.alpha));
                    var vec_forward = new BABYLON.Vector2(-Math.cos(camera.alpha), -Math.sin(camera.alpha));
                    vec_right.scaleInPlace(camera.radius * 0.07);
                    vec_forward.scaleInPlace(camera.radius * 0.07);
                    var currentspeed = this.camerasProperties.getByKey(CameraManager.arcRotateCamera).speed;
                    var newspeedX = currentspeed.x - vec_forward.x * delta.y + vec_right.x * delta.x;
                    var newspeedY = currentspeed.y - vec_forward.y * delta.y + vec_right.y * delta.x;
                    currentspeed.x += (newspeedX - currentspeed.x) * 0.3;
                    currentspeed.y += (newspeedY - currentspeed.y) * 0.3;
                    return;
                }
            };
            CameraManager.prototype.UpdateActiveCamera = function () {
                if (this.scene.activeCamera.name == CameraManager.arcRotateCamera) {
                    var arcRotateCamera = this.scene.activeCamera;
                    //var alpha = arcRotateCamera.alpha;
                    //var beta = arcRotateCamera.beta;
                    //var position = arcRotateCamera.position;
                    var currentRadius = arcRotateCamera.radius;
                    var targetRadius = this.camerasProperties.getByKey(CameraManager.arcRotateCamera).radiusTarget;
                    if (currentRadius != targetRadius) {
                        arcRotateCamera.radius = currentRadius + (targetRadius - currentRadius) * 0.2;
                    }
                    var currentspeed = this.camerasProperties.getByKey(CameraManager.arcRotateCamera).speed;
                    if (currentspeed.x != 0.0 || currentspeed.y != 0.0) {
                        arcRotateCamera.target.x += currentspeed.x;
                        arcRotateCamera.target.z += currentspeed.y;
                        currentspeed.x = 0.0;
                        currentspeed.y = 0.0;
                    }
                    //if (alpha != arcRotateCamera.alpha) {
                    //    console.log("alpha: " + arcRotateCamera.alpha);
                    //}
                    //if (beta != arcRotateCamera.beta) {
                    //    console.log("beta: " + arcRotateCamera.beta);
                    //}
                    //if (position != arcRotateCamera.position) {
                    //    console.log("position: X: " + arcRotateCamera.position.x + " - Y: " + arcRotateCamera.position.y + " - Z: " + arcRotateCamera.position.z);
                    //}
                    return;
                }
                if (this.scene.activeCamera.name == CameraManager.freeCamera) {
                    var freeCamera = this.scene.activeCamera;
                    var currentPositionY = freeCamera.position.y;
                    var targetPositionY = this.camerasProperties.getByKey(CameraManager.freeCamera).positionY;
                    if (currentPositionY != targetPositionY) {
                        freeCamera.position.y = currentPositionY + (targetPositionY - currentPositionY) * 0.2;
                    }
                    ////Camera altitude control            
                    //if (currentAltitude) {
                    //    var baseAltitude = currentAltitude < 0 ? 0 : currentAltitude;
                    //    if (freeCamera.position.y > baseAltitude + this.maxAllowedCameraAltitudeOverTerrain) {
                    //        freeCamera.position.y = baseAltitude + this.maxAllowedCameraAltitudeOverTerrain;
                    //    }
                    //    if (freeCamera.position.y < baseAltitude + this.minAllowedCameraAltitudeOverTerrain) {
                    //        freeCamera.position.y = baseAltitude + this.minAllowedCameraAltitudeOverTerrain;
                    //    }
                    //}
                    return;
                }
            };
            CameraManager.freeCamera = "freeCamera";
            CameraManager.arcRotateCamera = "arcRotateCamera";
            return CameraManager;
        })();
        UI.CameraManager = CameraManager;
    })(UI = Terrain.UI || (Terrain.UI = {}));
})(Terrain || (Terrain = {}));
//# sourceMappingURL=CameraManager.js.map