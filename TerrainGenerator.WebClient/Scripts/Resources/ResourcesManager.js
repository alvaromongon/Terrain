var Terrain;
(function (Terrain) {
    var Resources;
    (function (Resources) {
        var ResourcesManager = (function () {
            function ResourcesManager() {
                this.resources = new Array();
            }
            ResourcesManager.GetInstance = function () {
                if (ResourcesManager.instance == null) {
                    ResourcesManager.instance = new ResourcesManager();
                }
                return ResourcesManager.instance;
            };
            ResourcesManager.prototype.AddUpdateResource = function (resourceUpdate) {
                var exintingResource = this.GetResource(resourceUpdate.ResourceType);
                if (exintingResource != null) {
                    exintingResource.Stock = resourceUpdate.Stock;
                }
                else {
                    var localResource = new Resources.Resource(resourceUpdate.Stock, resourceUpdate.ResourceType);
                    this.resources.push(localResource);
                }
                this.GetResource(resourceUpdate.ResourceType).Update();
            };
            ResourcesManager.prototype.GetResource = function (resourceType) {
                var result = this.resources.filter(function (resource) { return resource.ResourceType == resourceType; });
                if (result.length == 0) {
                    return null;
                }
                return result[0];
            };
            return ResourcesManager;
        })();
        Resources.ResourcesManager = ResourcesManager;
    })(Resources = Terrain.Resources || (Terrain.Resources = {}));
})(Terrain || (Terrain = {}));
//# sourceMappingURL=ResourcesManager.js.map