var Terrain;
(function (Terrain) {
    var Environment;
    (function (Environment) {
        var Water = (function () {
            function Water(name, scene, material) {
                this.name = name;
                this.scene = scene;
                this.material = material;
            }
            Water.prototype.Render = function (gridSize, multiplier) {
                console.log('Rendering water with gridSize: ' + gridSize + ' - and multiplier: ' + multiplier);
                this.waterMesh = BABYLON.Mesh.CreateGround(this.name, gridSize * multiplier, gridSize * multiplier, 1, this.scene, false);
                this.waterMesh.isPickable = false;
                //this.waterMesh.renderingGroupId = 2;
                var types = [-1000.0, -1000.0, -1000.0, -1000.0];
                this.waterMesh.setVerticesData("type", types, false, 1); //Set the type of the vertice
                this.waterMesh.isPickable = false;
                this.waterMesh.material = this.material;
                //Follow the camera position
                //this.waterMesh.infiniteDistance = true
            };
            Water.prototype.SetPosition = function (xCoordinate, zCoordinate) {
                this.waterMesh.position = new BABYLON.Vector3(xCoordinate, this.waterMesh.position.y, zCoordinate);
            };
            return Water;
        })();
        Environment.Water = Water;
    })(Environment = Terrain.Environment || (Terrain.Environment = {}));
})(Terrain || (Terrain = {}));
//# sourceMappingURL=Water.js.map