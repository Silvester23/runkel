define(['GUIElement'], function (GUIElement) {
    var Screen = GUIElement.extend({
        init: function (data) {
            this._super(data);
            var self = this;
            this.visible = false;
            console.log(this.id);
            this.image = new Image();
            this.updateImageSrc();
        },

        updateImageSrc: function () {
            this.image.src = "img/screens/" + this.id + "_bg.png";
        },

        show: function () {
            if (this.show_callback) {
                this.show_callback();
            }
            this.visible = true;
        },

        hide: function () {
            if (this.hide_callback) {
                this.hide_callback();
            }
            this.visible = false;
        },

        click: function (evt) {

        },

        onShow: function (callback) {
            this.show_callback = callback;
        },

        onHide: function (callback) {
            this.hide_callback = callback;
        }
    });
    return Screen;
});