define([], function () {
    var App = Class.extend({
        init: function () {
            var self = this;
            this.width = 640;
            this.height = 480;
            this.viewport = { width: 640, height: 416 };
            this.offset = {x: 0, y: 0};

            this.centerTiles = {x: 10, y: 6};


        },

        getVisibleTileBounds: function() {
            var bounds = {minX: 0, minY: 0, maxX: 0, maxY: 0}
            if(this.game && this.game.player) {
                // The -1 and +1 are a 1-tile "buffer"
                var minX = this.game.player.tileX - this.centerTiles.x - 1,
                    minY = this.game.player.tileY - this.centerTiles.y - 1,
                    maxX = this.game.player.tileX + ((this.game.app.viewport.width / _TILESIZE) / 2) + 1,
                    maxY = this.game.player.tileY + ((this.game.app.viewport.height / _TILESIZE) / 2) + 1;

                minX = minX < 0 ? 0 : minX;
                minY = minY < 0 ? 0 : minY;
                maxX = maxX < this.game.map.width ? maxX : this.game.map.width;
                maxY = maxY < this.game.map.height ? maxY: this.game.map.height;

                bounds.minX = minX;
                bounds.minY = minY;
                bounds.maxX = maxX;
                bounds.maxY = maxY;
            }

            return bounds;
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