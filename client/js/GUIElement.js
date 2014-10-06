/*
 * Parent class for all GUI elements
 */


define([], function () {
    var GUIElement = Class.extend({
        init: function (data) {
            var self = this;
            this.visible = true;
            this.hasContext = false;

            _.each(_.keys(data), function (key) {
                self[key] = data[key];
            });
        },

        wasClicked: function (x, y) {
            /*
             * First, check whether the click was in bounds of the element. If not, return false.
             * Next, for elements with images check whether a non-transparent pixel was clicked.
             * Last, return true for elements without an image.
             */
            if (!(x >= this.x && x <= this.x + this.width && y >= this.y && y <= this.y + this.height)) {
                return false
            }
            else if (this.image) {
                var canvas = document.getElementById('hidden_canvas');
                canvas.width = this.image.width;
                canvas.height = this.image.height;
                var ctx = canvas.getContext('2d');
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.drawImage(this.image, 0, 0);

                var imgdata = ctx.getImageData(x - this.x, y - this.y, 1, 1).data;
                return !(imgdata[0] == 0 &&
                    imgdata[1] == 0 &&
                    imgdata[2] == 0 &&
                    imgdata[3] == 0);
            }
            else {
                return true;
            }
        },

        setPosition: function (x, y) {
            this.x = x;
            this.y = y;
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
        },

        appendTo: function(guiElement) {
            this.parent = guiElement;
        },

        getInfo: function() {
            return "";
        }

    });
    return GUIElement;
});