var Terrain;
(function (Terrain) {
    var UI;
    (function (UI) {
        var UiManager = (function () {
            function UiManager(canvas, scene) {
                var _this = this;
                this.isTouchDevice = false;
                this.selectedModel = null;
                this.selectedPanelText = null;
                this.visibleHelperPanelText = null;
                this.floatingBuilding = null;
                this.isDragging = false;
                this.isPinching = false;
                this.canvas = canvas;
                this.scene = scene;
                this.pointer = new BABYLON.Vector2(0.0, 0.0);
                this.pinch = new BABYLON.Vector2(0.0, 0.0);
                this.canvas.addEventListener('mousedown', function (event) {
                    if (!_this.IsTouchDevice()) {
                        _this.canvasMouseDown(event);
                    }
                });
                this.canvas.addEventListener('touchstart', function (event) {
                    if (_this.IsTouchDevice()) {
                        _this.canvasTouchDown(event);
                    }
                });
                this.canvas.addEventListener('mousemove', function (event) {
                    if (!_this.IsTouchDevice()) {
                        _this.canvasMouseMove(event);
                    }
                });
                this.canvas.addEventListener('touchmove', function (event) {
                    if (_this.IsTouchDevice()) {
                        _this.canvasTouchMove(event);
                    }
                });
                this.canvas.addEventListener('mouseup', function (event) {
                    if (!_this.IsTouchDevice()) {
                        _this.canvasMouseUp(event);
                    }
                });
                this.canvas.addEventListener('touchend', function (event) {
                    if (_this.IsTouchDevice()) {
                        _this.canvasTouchUp(event);
                    }
                });
                //Coursor leave the window
                this.AddEvent(document, "mouseout", function (e) {
                    e = e ? e : window.event;
                    var from = e.relatedTarget || e.toElement;
                    if (!from || from.nodeName == "HTML") {
                        UiManager.instance.WindowMouseLeave();
                    }
                });
                // Not really working, disabled for now
                //$(this.canvas).on('dblclick', this.doubleClick);
                $(this.canvas).on('mousewheel', this.mouseWheel);
            }
            UiManager.Initialize = function (canvas, scene) {
                if (UiManager.instance == null) {
                    UiManager.instance = new UiManager(canvas, scene);
                }
            };
            UiManager.GetInstance = function () {
                return UiManager.instance;
            };
            // function from Peter-Paul Koch; cross browser event handler:
            UiManager.prototype.AddEvent = function (obj, evt, fn) {
                if (obj.addEventListener) {
                    obj.addEventListener(evt, fn, false);
                }
                else if (obj.attachEvent) {
                    obj.attachEvent("on" + evt, fn);
                }
            };
            UiManager.prototype.IsTouchDevice = function () {
                return this.isTouchDevice;
                //return 'ontouchstart' in window        // works on most browsers 
                //    || navigator.maxTouchPoints;       // works on IE10/11 and Surface
            };
            UiManager.prototype.SwiftTouchMouseDevice = function () {
                this.isTouchDevice = !this.isTouchDevice;
            };
            UiManager.prototype.InitiateFirstUseHelper = function (maxHeight) {
                var y = Terrain.Tiles.TilesManager.GetInstance().GetPositonAltitude(new BABYLON.Vector2(0, 0));
                UiManager.instance.visibleHelperPanelText = Terrain.Models.MasterModelsContainer.GetInstance().GetPanelTextInstanceModel("wellcome");
                UiManager.instance.visibleHelperPanelText.SetPosition(new BABYLON.Vector3(0, y * 1.1, 0));
                UiManager.instance.visibleHelperPanelText.Show();
            };
            UiManager.prototype.BuildBuilding = function (buildingType) {
                UiManager.instance.floatingBuilding = Terrain.Models.MasterModelsContainer.GetInstance().GetElementedResourcedInstanceModel(buildingType);
                if (UiManager.instance.floatingBuilding != null) {
                    UiManager.instance.SetCursorTo("pointer");
                }
            };
            UiManager.prototype.canvasMouseDown = function (event) {
                UiManager.instance.isDragging = true;
                if (this.RequestfloatingBuildCreation()) {
                    return;
                }
                if (UiManager.instance.ClickOnPanelText()) {
                    return;
                }
                if (UiManager.instance.selectedModel != null) {
                    UiManager.instance.selectedModel.HighLight();
                    UiManager.instance.selectedModel.Click();
                }
            };
            UiManager.prototype.canvasMouseMove = function (event) {
                if (UiManager.instance.isDragging == true) {
                    var start = UiManager.instance.pointer.clone();
                    UiManager.instance.pointer.x = UiManager.instance.scene.pointerX;
                    UiManager.instance.pointer.y = UiManager.instance.scene.pointerY;
                    var drag = UiManager.instance.pointer.clone().subtractInPlace(start);
                    drag.x = -drag.x * 0.015;
                    drag.y = -drag.y * 0.015;
                    UI.CameraManager.GetInstance().MoveCameraRelative(drag);
                    return;
                }
                UiManager.instance.pointer.x = UiManager.instance.scene.pointerX;
                UiManager.instance.pointer.y = UiManager.instance.scene.pointerY;
                var previoulySelectedModel = UiManager.instance.selectedModel;
                UiManager.instance.PickedModelLogic();
                this.SetFloatingBuildingPositon();
                if (UiManager.instance.selectedPanelText != null) {
                    UiManager.instance.SetCursorTo("pointer");
                }
                else {
                    UiManager.instance.SetCursorTo("default");
                }
                if (previoulySelectedModel != null && previoulySelectedModel != UiManager.instance.selectedModel) {
                    if (previoulySelectedModel.HideHoverPanel()) {
                        previoulySelectedModel.DeHighLight();
                        UiManager.instance.SetCursorTo("default");
                    }
                }
                if (UiManager.instance.selectedModel != null) {
                    if (UiManager.instance.selectedModel.ShowHoverPanel()) {
                        UiManager.instance.selectedModel.HighLight();
                        UiManager.instance.SetCursorTo("pointer");
                    }
                }
            };
            UiManager.prototype.canvasMouseUp = function (event) {
                UiManager.instance.isDragging = false;
            };
            UiManager.prototype.canvasTouchDown = function (event) {
                var numberOfTouches = event.touches.length;
                if (numberOfTouches > 0) {
                    UiManager.instance.pointer.x = Math.floor(event.touches[0].pageX);
                    UiManager.instance.pointer.y = Math.floor(event.touches[0].pageY);
                    UiManager.instance.isDragging = true;
                }
                else {
                    UiManager.instance.isDragging = false;
                }
                if (numberOfTouches > 1) {
                    UiManager.instance.pinch.x = Math.floor(event.touches[1].pageX);
                    UiManager.instance.pinch.y = Math.floor(event.touches[1].pageY);
                    UiManager.instance.isPinching = true;
                }
                else {
                    UiManager.instance.isPinching = false;
                }
            };
            UiManager.prototype.canvasTouchMove = function (event) {
                if (UiManager.instance.isDragging == true) {
                    if (UiManager.instance.isPinching) {
                        var previousPinch = UiManager.instance.pinch.clone();
                        UiManager.instance.pinch.x = Math.floor(event.touches[1].pageX);
                        UiManager.instance.pinch.y = Math.floor(event.touches[1].pageY);
                        var previous_dist = BABYLON.Vector2.Distance(previousPinch, UiManager.instance.pointer);
                        var current_dist = BABYLON.Vector2.Distance(UiManager.instance.pointer, UiManager.instance.pinch);
                        UI.CameraManager.GetInstance().MoveCameraZoom((current_dist - previous_dist) * -0.015);
                    }
                    else {
                        var start = UiManager.instance.pointer.clone();
                        UiManager.instance.pointer.x = Math.floor(event.touches[0].pageX);
                        UiManager.instance.pointer.y = Math.floor(event.touches[0].pageY);
                        var drag = UiManager.instance.pointer.clone().subtractInPlace(start);
                        drag.x = -drag.x * 0.015;
                        drag.y = -drag.y * 0.015;
                        UI.CameraManager.GetInstance().MoveCameraRelative(drag);
                    }
                }
                else {
                    console.log("touch move no dragging?");
                }
            };
            UiManager.prototype.canvasTouchUp = function (event) {
                if (!UiManager.instance.isPinching) {
                    //Model selection logic for touch devices
                    var previoulySelectedModel = UiManager.instance.selectedModel;
                    UiManager.instance.PickedModelLogic();
                    if (this.RequestfloatingBuildCreation()) {
                        return;
                    }
                    if (UiManager.instance.ClickOnPanelText()) {
                        return;
                    }
                    if (previoulySelectedModel != null && previoulySelectedModel != UiManager.instance.selectedModel) {
                        previoulySelectedModel.HideHoverPanel();
                        previoulySelectedModel.DeHighLight();
                    }
                    if (UiManager.instance.selectedModel != null) {
                        UiManager.instance.selectedModel.ShowHoverPanel();
                        if (UiManager.instance.selectedModel.IsHighLighted()) {
                            UiManager.instance.selectedModel.Click();
                        }
                        else {
                            UiManager.instance.selectedModel.HighLight();
                        }
                    }
                }
                UiManager.instance.isDragging = false;
                UiManager.instance.isPinching = false;
            };
            UiManager.prototype.WindowMouseLeave = function () {
                UiManager.instance.isDragging = false;
                UiManager.instance.isPinching = false;
                UiManager.instance.pickedInfo = null;
                UiManager.instance.selectedModel = null;
                UiManager.instance.selectedPanelText = null; //not dispose just deselect
                UiManager.instance.DisposeFloatingBuilding();
                UiManager.instance.SetCursorTo("default");
            };
            //private doubleClick(event: any) {                  
            //    if (UiManager.instance.scene.activeCamera.name == CameraManager.arcRotateCamera) {    
            //        var start = UiManager.instance.pointer.clone();
            //        UiManager.instance.pointer.x = UiManager.instance.scene.pointerX;
            //        UiManager.instance.pointer.y = UiManager.instance.scene.pointerY;
            //        var drag = UiManager.instance.pointer.clone().subtractInPlace(start);
            //        drag.x = -drag.x * 0.015;
            //        drag.y = -drag.y * 0.015;
            //        CameraManager.GetInstance().MoveCameraRelative(drag);
            //        return;
            //    }
            //    if (UiManager.instance.scene.activeCamera.name == CameraManager.freeCamera) {
            //        var freeCamera: BABYLON.FreeCamera = <BABYLON.FreeCamera>UiManager.instance.scene.activeCamera;
            //        var pickedInfo = Terrain.Tiles.TilesManager.GetInstance().GetPickedInfo(UiManager.instance.pointer);
            //        if (pickedInfo != null && pickedInfo.hit) {
            //            freeCamera.position = new BABYLON.Vector3(pickedInfo.pickedPoint.x, freeCamera.position.y, pickedInfo.pickedPoint.z);
            //        }
            //        return;
            //    }
            //}
            UiManager.prototype.mouseWheel = function (event) {
                var delta = -event.deltaY * 0.12;
                UI.CameraManager.GetInstance().MoveCameraZoom(delta);
            };
            UiManager.prototype.SetCursorTo = function (cursorType) {
                $(this.canvas).css('cursor', cursorType);
            };
            UiManager.prototype.PickedModelLogic = function () {
                var point = UiManager.instance.pointer;
                UiManager.instance.pickedInfo = UiManager.instance.scene.pick(point.x, point.y);
                if (!UiManager.instance.pickedInfo.hit) {
                    return null;
                }
                //Check if it is a Positioned model
                var positionedInstanceModel = Terrain.Tiles.TilesManager.GetInstance().GetModel(UiManager.instance.pickedInfo);
                if (positionedInstanceModel != null) {
                    UiManager.instance.selectedModel = positionedInstanceModel;
                }
                else {
                    UiManager.instance.selectedModel = null;
                }
                //Check if it is a panel text
                if (UiManager.instance.visibleHelperPanelText && UiManager.instance.visibleHelperPanelText.IsSameMesh(UiManager.instance.pickedInfo.pickedMesh)) {
                    UiManager.instance.selectedPanelText = UiManager.instance.visibleHelperPanelText;
                }
                else {
                    UiManager.instance.selectedPanelText = null;
                }
            };
            UiManager.prototype.SetFloatingBuildingPositon = function () {
                if (UiManager.instance.floatingBuilding != null && UiManager.instance.pickedInfo.hit) {
                    var y = Terrain.Tiles.TilesManager.GetInstance().GetPositonAltitude(new BABYLON.Vector2(UiManager.instance.pickedInfo.pickedPoint.x, UiManager.instance.pickedInfo.pickedPoint.z));
                    UiManager.instance.floatingBuilding.SetPosition(new BABYLON.Vector3(UiManager.instance.pickedInfo.pickedPoint.x, y, UiManager.instance.pickedInfo.pickedPoint.z));
                }
            };
            UiManager.prototype.RequestfloatingBuildCreation = function () {
                if (UiManager.instance.selectedModel == null && UiManager.instance.floatingBuilding != null) {
                    UiManager.instance.SetFloatingBuildingPositon();
                    if (!Terrain.Tiles.TilesManager.GetInstance().RequestPositionedModelCreationFromPosition(UiManager.instance.floatingBuilding.GetPosition(), UiManager.instance.floatingBuilding.GetMapElementType())) {
                        UiManager.instance.floatingBuilding.ShowHoverPanel();
                        setTimeout(function () { UiManager.instance.floatingBuilding.HideHoverPanel(); }, 1000);
                        return false;
                    }
                    UiManager.instance.DisposeFloatingBuilding();
                    UiManager.instance.SetCursorTo("default");
                    return true;
                }
                return false;
            };
            UiManager.prototype.DisposeFloatingBuilding = function () {
                if (UiManager.instance.floatingBuilding) {
                    UiManager.instance.floatingBuilding.Dispose();
                    UiManager.instance.floatingBuilding = null;
                }
            };
            UiManager.prototype.ClickOnPanelText = function () {
                if (UiManager.instance.selectedPanelText) {
                    UiManager.instance.selectedPanelText.Dispose();
                    UiManager.instance.selectedPanelText = null;
                    UiManager.instance.visibleHelperPanelText = null;
                    UiManager.instance.SetCursorTo("default");
                    return true;
                }
                return false;
            };
            return UiManager;
        })();
        UI.UiManager = UiManager;
    })(UI = Terrain.UI || (Terrain.UI = {}));
})(Terrain || (Terrain = {}));
//# sourceMappingURL=UiManager.js.map