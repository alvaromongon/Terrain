var Terrain;
(function (Terrain) {
    var Resources;
    (function (Resources) {
        // This string value has to match with the id of the dev that indicate the number of resource availables
        (function (ResourceType) {
            ResourceType[ResourceType["noBuildingAllowed"] = -1] = "noBuildingAllowed";
            ResourceType[ResourceType["empty"] = 0] = "empty";
            ResourceType[ResourceType["population"] = 1] = "population";
            ResourceType[ResourceType["unemployedManpower"] = 2] = "unemployedManpower";
            ResourceType[ResourceType["manpower"] = 3] = "manpower";
            ResourceType[ResourceType["food"] = 4] = "food";
            ResourceType[ResourceType["foodLimit"] = 5] = "foodLimit";
            ResourceType[ResourceType["wood"] = 6] = "wood";
        })(Resources.ResourceType || (Resources.ResourceType = {}));
        var ResourceType = Resources.ResourceType;
        var Resource = (function () {
            function Resource(stock, resourceType) {
                this.Stock = stock;
                this.ResourceType = resourceType;
                this.CreateTagFromType();
            }
            Resource.prototype.Equal = function (other) {
                return (this.ResourceType == other.ResourceType);
            };
            Resource.prototype.Update = function () {
                this.CreateTagFromType();
                this.tag.innerHTML = this.Stock.toString();
            };
            Resource.prototype.CreateTagFromType = function () {
                if (!this.tag) {
                    this.tag = document.getElementById(ResourceType[this.ResourceType]);
                }
            };
            return Resource;
        })();
        Resources.Resource = Resource;
    })(Resources = Terrain.Resources || (Terrain.Resources = {}));
})(Terrain || (Terrain = {}));
//# sourceMappingURL=Resource.js.map