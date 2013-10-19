define([], function () {
    var App = Class.extend({
        init: function () {
            var self = this;
            this.width = 640;
            this.height = 480;
            this.viewport = { width: 640, height: 416 };
            this.offset = {x: 0, y: 0};
        },

        setMouseCoordinates: function(evt) {
            if(this.game) {
                var mouse = this.game.mouse,
                    x = evt.pageX - this.offset.x,
                    y = evt.pageY - this.offset.y;
                mouse.x = x;
                mouse.y = y;
            }
        },

        setGame: function (game) {
            this.game = game;
            console.info("Game set");
        },

        setOffset: function(x,y) {
            this.offset.x = x;
            this.offset.y = y;
        },


        isInBounds: function (x, y) {
            return (x <= this.viewport.width && y <= this.viewport.height);
        }


    });
    return App;
});