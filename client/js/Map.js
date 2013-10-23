define(['Tile',
        '../../shared/Types.js'], function (Tile) {
    var Map = Class.extend({
        init: function () {
            this.width = 30;
            this.height = 15;

            this.tileset = [];

            for(var row = 0; row < this.height; row++) {
                this.tileset[row] = [];

                for(var col = 1; col < this.width-1; col++) {
                    if(row == 0) {
                        this.tileset[row][col] = new Tile(Types.Tiles.GRASS, _.random(1,3), 0);
                    } else if(row == this.height-1) {
                        this.tileset[row][col] = new Tile(Types.Tiles.GRASS, _.random(1,3), 2);
                    } else {
                        this.tileset[row][col] = new Tile(Types.Tiles.GRASS, _.random(1,3), 1);
                    }
                }
                this.tileset[row][0] = new Tile(Types.Tiles.GRASS, 0, 1);
                this.tileset[row][this.width-1] = new Tile(Types.Tiles.GRASS, 4, 1);
            }

            this.tileset[0][0] = new Tile(Types.Tiles.GRASS, 0, 0);
            this.tileset[0][this.width-1] = new Tile(Types.Tiles.GRASS, 4, 0);
            this.tileset[this.height-1][0] = new Tile(Types.Tiles.GRASS, 0, 2);
            this.tileset[this.height-1][this.width-1] = new Tile(Types.Tiles.GRASS, 4, 2);
        }
    });
    return Map;
});