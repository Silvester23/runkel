define(['GUIElement'], function (GUIElement) {
    var Screen = GUIElement.extend({
        init: function (data) {
            this._super(data);
            var self = this;
            this.visible = false;
            console.log(this.id);
            this.image = new Image();
            this.image.onerror = function() {
                self.image = null;
            }
            this.updateImageSrc();
        },

        updateImageSrc: function() {
            this.image.src = "img/screens/" + this.id + "_bg.png";
        },

        show: function() {
            this.visible = true;
        },

        hide: function() {
            this.visible = false;
        },

        click: function() {
            console.log("clicked " + this.id);
        }
    });
    return Screen;
})