define(['GUIElement'], function (GUIElement) {
    var Table = GUIElement.extend({
        init: function (data) {
            this._super(data);
            this.visible = false;
        },

        getSnapPosition: function (icon) {
            var x = icon.x - this.x + icon.width / 2,
                y = icon.y - this.y + icon.height / 2;
            if (this.isInViewport(x, y)) {
                var snapX = Math.floor(x / this.cellsize) * this.cellsize + (this.cellsize - icon.entity.getSprite().width) / 2;
                var snapY = Math.floor(y / this.cellsize) * this.cellsize + (this.cellsize - icon.entity.getSprite().width) / 2;
                return {x: this.x + snapX, y: this.y + snapY}
            } else {
                return this.getCellPosition(icon);
            }
        },

        getCellPosition: function (icon) {
            var i = icon.cellIndex,
                row = Math.floor(i / (this.cols)),
                col = i % (this.cols),
                x = this.x + col * this.cellsize + (this.cellsize - icon.entity.getSprite().width) / 2,
                y = this.y + row * this.cellsize + (this.cellsize - icon.entity.getSprite().height) / 2;
            return {x: x, y: y};
        },

        getCellIndex: function (icon) {
            var x = icon.x - this.x + icon.width / 2,
                y = icon.y - this.y + icon.height / 2;


            var index = -1;
            if (this.isInViewport(x, y)) {
                index = Math.floor(x / this.cellsize) + Math.floor(y / this.cellsize) * this.cols;
            }
            return index;
        },

        isInViewport: function (x, y) {
            return (x >= 0 && x <= this.width && y >= 0 && y <= this.height)
        }
    });
    return Table;
});


