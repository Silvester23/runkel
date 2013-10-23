define(['../../shared/Types'], function () {
    var Tile = Class.extend({
        init: function (type, edge) {
            this.type = type;

            this.isDirty = true;

            this.offset = {};

            var x = 0,
                y = 0,
                bx = 0,
                by = 0;

            if(edge != "") {
                switch(edge) {
                    case "n":
                        x = _.random(1,3)
                        y = 0;
                        break;
                    case "ne":
                        x = 4;
                        y = 0;
                        break;
                    case "e":
                        x = 4;
                        y = 1;
                        break;
                    case "se":
                        x = 4;
                        y = 2;
                        break;
                    case "s":
                        x = _.random(1,3);
                        y = 2;
                        break;
                    case "sw":
                        x = 0;
                        y = 2;
                        break;
                    case "w":
                        x = 0;
                        y = 1;
                        break;
                    case "nw":
                        x = 0;
                        y = 0;
                        break;
                }
            } else {
                x = _.random(1,3);
                y = 1;
            }


            switch(this.type) {
                case Types.Tiles.GRASS:
                    bx = 0;
                    by = 0;
                    break;
                case Types.Tiles.SNOW:
                    bx = 0;
                    by = 3;
                    break;
            }


            this.setOffset(bx + x, by + y);
        },

        setOffset: function(x,y) {
            this.offset.x = x;
            this.offset.y = y;
        }
    });
    return Tile;
})