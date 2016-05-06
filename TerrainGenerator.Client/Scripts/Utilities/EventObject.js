var Terrain;
(function (Terrain) {
    var Utilities;
    (function (Utilities) {
        var EventObject = (function () {
            function EventObject() {
            }
            // Events primitives ======================
            EventObject.prototype.bind = function (event, fct) {
                this._events = this._events || {};
                this._events[event] = this._events[event] || [];
                this._events[event].push(fct);
            };
            EventObject.prototype.unbind = function (event, fct) {
                this._events = this._events || {};
                if (event in this._events === false)
                    return;
                this._events[event].splice(this._events[event].indexOf(fct), 1);
            };
            EventObject.prototype.unbindEvent = function (event) {
                this._events = this._events || {};
                this._events[event] = [];
            };
            EventObject.prototype.unbindAll = function () {
                this._events = this._events || {};
                for (var event in this._events)
                    this._events[event] = false;
            };
            EventObject.prototype.trigger = function (event) {
                var args = [];
                for (var _i = 1; _i < arguments.length; _i++) {
                    args[_i - 1] = arguments[_i];
                }
                this._events = this._events || {};
                if (event in this._events === false)
                    return;
                for (var i = 0; i < this._events[event].length; i++) {
                    this._events[event][i].apply(this, Array.prototype.slice.call(arguments, 1));
                }
            };
            EventObject.prototype.registerEvent = function (evtname) {
                this[evtname] = function (callback, replace) {
                    if (typeof callback == 'function') {
                        if (replace)
                            this.unbindEvent(evtname);
                        this.bind(evtname, callback);
                    }
                    return this;
                };
            };
            return EventObject;
        })();
        Utilities.EventObject = EventObject;
    })(Utilities = Terrain.Utilities || (Terrain.Utilities = {}));
})(Terrain || (Terrain = {}));
