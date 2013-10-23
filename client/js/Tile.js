define(['../../shared/Types'], function () {
    var Tile = Class.extend({
        init: function (type, offsetX, offsetY) {
            this.type = type;

            this.isDirty = true;

            this.offset = {};
            if(typeof offsetX !== "undefined" && offsetY !== "undefined") {
                this.offset.x = offsetX;
                this.offset.y = offsetY;
            }
            switch(this.type) {
                case Types.Tiles.GRASS:
                    this.baseOffset = {x: 0, y: 0};
                    break;
            }
        },

        setOffset: function(x,y) {
            this.offset.x = x;
            this.offset.y = y;
        }
    });
    return Tile;
})