define(['Tile',
        '../../shared/Types.js'], function (Tile) {
    var Map = Class.extend({
        init: function () {
            this.tileset = new Image();
            this.tileset.src = "/img/tileset.png";

            this.loadMap();

        },

        createTiles: function() {
            this.tiles = [];
            for(var row = 0; row < this.height; row++) {
                this.tiles[row] = [];
                for(var col = 0; col < this.width; col++) {
                    var tileIndex = row * this.width + col,
                        type = this.data.tiles[tileIndex],
                        edge = "";

                    if(row == 0) {
                        edge += "n";
                    } else if(row == this.height-1) {
                        edge += "s";
                    }
                    if(col == 0) {
                        edge += "w";
                    } else if(col == this.width-1) {
                        edge += "e";
                    }

                    this.tiles[row][col] = new Tile(type,edge);
                }
            }
        },


        loadMap: function() {
            var self = this;
            var worker = new Worker("js/mapworker.js");
            worker.postMessage(0);
            worker.onmessage = function(event) {
                self.data = event.data;
                self.width = event.data.width;
                self.height = event.data.height;
                self.createTiles();
                self.isLoaded = true;
            }
        }
    });
    return Map;
});