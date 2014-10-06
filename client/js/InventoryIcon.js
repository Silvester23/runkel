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
        },

        getInfo: function() {
            return this.entity.name;
        },

        getContextInformation: function() {
            var self = this;
            var options = this.entity.getContextInformation();
            options.unshift({
                label: "Drop " + this.entity.name,
                action: function() {self.entity.drop.call(self.entity);}
            });
            return options;
        }
    });
    return InventoryIcon;
});