define([], function () {
    var Path = Class.extend({
        init: function (directions, start, destination) {
            this.directions = typeof directions !== 'undefined' ? directions : [];
            this.destination = destination;
            this.start = start;
        },

        step: function() {
            return this.directions.pop();
        },

        hasStep: function() {
            return this.directions.length > 0;
        }
    });
    return Path;
})