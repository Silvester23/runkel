define(['GUIElement'], function (GUIElement) {
    var InventoryIcon = GUIElement.extend({
        init: function (data) {
            this._super(data);
        },

        drag: function (x, y) {

            this.x = this.dragOriginX + x - this.dragStartX;
            this.y = this.dragOriginY + y - this.dragStartY;

            //console.log("dragging to ", x, y);
        },

        release: function () {
            if (this.release_callback) {
                this.release_callback();
            }
        },

        onRelease: function (callback) {
            this.release_callback = callback;
        }
    });
    return InventoryIcon;
});