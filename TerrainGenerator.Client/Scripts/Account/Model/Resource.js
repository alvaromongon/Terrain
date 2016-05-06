var Terrain;
(function (Terrain) {
    var Account;
    (function (Account) {
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
        Account.Resource = Resource;
        (function (ResourceType) {
            ResourceType[ResourceType["food"] = 0] = "food";
            ResourceType[ResourceType["wood"] = 1] = "wood";
            ResourceType[ResourceType["stone"] = 2] = "stone";
        })(Account.ResourceType || (Account.ResourceType = {}));
        var ResourceType = Account.ResourceType;
    })(Account = Terrain.Account || (Terrain.Account = {}));
})(Terrain || (Terrain = {}));
