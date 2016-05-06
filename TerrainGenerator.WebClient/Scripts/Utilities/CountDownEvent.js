var Terrain;
(function (Terrain) {
    var Utilities;
    (function (Utilities) {
        var CountDownEvent = (function () {
            function CountDownEvent(signalsToWait, data, functionToRun) {
                this.signalsToWait = signalsToWait;
                this.data = data;
                this.functionToRun = functionToRun;
                if (this.IsReadyToRaiseEvent()) {
                    this.RunFunction();
                }
            }
            CountDownEvent.prototype.Signal = function () {
                this.signalsToWait = this.signalsToWait - 1;
                if (this.IsReadyToRaiseEvent()) {
                    this.RunFunction();
                }
            };
            CountDownEvent.prototype.SignalSeveral = function (numberOfSignals) {
                this.signalsToWait = this.signalsToWait - numberOfSignals;
                if (this.IsReadyToRaiseEvent()) {
                    this.RunFunction();
                }
            };
            CountDownEvent.prototype.IsReadyToRaiseEvent = function () {
                return this.signalsToWait <= 0;
            };
            CountDownEvent.prototype.RunFunction = function () {
                this.functionToRun(this.data);
            };
            return CountDownEvent;
        })();
        Utilities.CountDownEvent = CountDownEvent;
    })(Utilities = Terrain.Utilities || (Terrain.Utilities = {}));
})(Terrain || (Terrain = {}));
//# sourceMappingURL=CountDownEvent.js.map