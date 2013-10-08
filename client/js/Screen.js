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
        }
    });
    return Screen;
});