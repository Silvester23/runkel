/*
 * Super-class for all GUI elements
 */


define([], function () {
    var GUIElement = Class.extend({
        init: function (data) {
            var self = this;
            this.visible = true;

            _.each(_.keys(data), function(key) {
                self[key] = data[key];
            });
        },

        wasClicked: function(x,y) {
            /*
             * First, check whether the click was in bounds of the element. If not, return false.
             * Next, for elements with images check whether a non-transparent pixel was clicked.
             * Last, return true for elements without an image.
             */
            if(!(x >= this.x && x <= this.x + this.width && y >= this.y && y <= this.y + this.height)) {
                return false
            }
            else if(this.image) {
                var canvas = document.getElementById('hidden_canvas');
                canvas.width = this.image.width;
                canvas.height = this.image.height;
                var ctx = canvas.getContext('2d');
                ctx.drawImage(this.image,0,0);

                var imgdata = ctx.getImageData(x-this.x, y-this.y, 1, 1).data;
                if (
                    imgdata[0] == 0 &&
                        imgdata[1] == 0 &&
                        imgdata[2] == 0 &&
                        imgdata[3] == 0
                    ){
                    return false;
                }
                ctx.clearRect(0,0,canvas.width,canvas.height);
                return true;
            }
            else {
                return true;
            }
        }
    });
    return GUIElement;
})