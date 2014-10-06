define([], function () {
    var App = Class.extend({
        init: function () {
            var self = this,
                menuHeight = 64;
            this.width = canvas.width;
            this.height = canvas.height;
            this.viewport = { width: canvas.width, height: canvas.height - menuHeight };
            this.offset = {x: 0, y: 0};



            this.centerTiles = {x: Math.floor((this.viewport.width/_TILESIZE) / 2), y: Math.floor((this.viewport.height/_TILESIZE) / 2)};


        },

        getVisibleTileBounds: function() {
            var bounds = {minX: 0, minY: 0, maxX: 0, maxY: 0};
            if(this.game && this.game.player) {
                // The -1 and +1 are a 1-tile "buffer"

                var minX = this.game.player.tileX - this.centerTiles.x - 1,
                    minY = this.game.player.tileY - this.centerTiles.y - 1,
                    maxX = this.game.player.tileX + Math.ceil((this.viewport.width / _TILESIZE) / 2) + 1,
                    maxY = this.game.player.tileY + Math.ceil((this.viewport.height / _TILESIZE) / 2) + 1;

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


        isInViewport: function (x, y) {
            return (x >= 0 && y >= 0 && x <= this.viewport.width && y <= this.viewport.height);
        },

        isInBounds: function(x,y) {
            return (x >= 0 && y >= 0 && x <= this.width && y <= this.height);
        }




    });
    return App;
});