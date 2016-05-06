var Terrain;
(function (Terrain) {
    var Account;
    (function (Account) {
        var ResourceManager = (function () {
            function ResourceManager() {
                this.resources = new Array();
            }
            ResourceManager.GetInstance = function () {
                if (ResourceManager.instance == null) {
                    ResourceManager.instance = new ResourceManager();
                }
                return ResourceManager.instance;
            };
            ResourceManager.prototype.AddUpdateResource = function (resource) {
                var exintingResource = this.GetResource(resource.ResourceType);
                if (exintingResource != null) {
                    exintingResource.Stock = resource.Stock;
                }
                else {
                    var localResource = new Account.Resource(resource.Stock, resource.ResourceType);
                    this.resources.push(localResource);
                }
                this.GetResource(resource.ResourceType).Update();
            };
            ResourceManager.prototype.GetResource = function (resourceType) {
                var result = this.resources.filter(function (resource) { return resource.ResourceType == resourceType; });
                if (result.length == 0) {
                    return null;
                }
                return result[0];
            };
            return ResourceManager;
        })();
        Account.ResourceManager = ResourceManager;
    })(Account = Terrain.Account || (Terrain.Account = {}));
})(Terrain || (Terrain = {}));
