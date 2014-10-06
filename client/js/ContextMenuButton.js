define(['Button'], function (Button) {
    var ContextMenuButton = Button.extend({
        init: function (data) {
            this._super(data);
            this.active = false;
        },

        hover: function() {
            this.active = true;
        },

        blur: function() {
            this.active = false;
        }


    });
    return ContextMenuButton;
});