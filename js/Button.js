define(['GUIElement'], function (GUIElement) {
    var Button = GUIElement.extend({
        init: function (data) {
            this._super(data);
        },

        onClick: function(callback) {
            this.click_callback = callback;
        },

        click: function() {
            if(this.click_callback) {
                this.click_callback();
            }
        }
    });
    return Button;
})