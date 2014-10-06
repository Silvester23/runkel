define(['GUIElement'], function (GUIElement) {
    var ContextMenu = GUIElement.extend({
        init: function (data) {
            this._super(data);
            this.visible = false;

            this.baseLabels = [];
            this.labels = _.clone(this.baseLabels);
            this.buttons = [];

            // Top, right, bottom, left
            this.padding = [0,10,0,10];
        },

        setOffsets: function() {
            if(this.buttons.length > 0) {
                this.buttons[0].offset = {x:0, y:0};
                for(var i = 1; i < this.buttons.length; i++) {
                    this.buttons[i].offset = {x:0, y: i* this.buttons[i-1].height };
                }
            }
        },

        show: function() {
            // Make sure there are buttons to show
            if(this.buttons.length > 0) {
                this._super();
            }
        },

        resetButtons: function() {
            var self = this;
            this.buttons = _.filter(this.buttons, function(button) {
                return _.indexOf(self.baseLabels,button.label) != -1;
            });
            this.setOffsets();
            console.log(this.buttons);
        },

        addButton: function(button, front) {
            front = typeof front === "undefined" ? false : front;


            if(front) {
                this.buttons.unshift(button);
            } else {
                this.buttons.push(button);
            }
        },

        refresh: function() {
            var self = this,
                maxLength = 0;

            // Recalculate offsets
            this.setOffsets();


            // Set height and width
            this.height = 0;
            _.each(this.buttons, function(button) {
                self.height += button.height;
                if(button.label.length > maxLength) {
                    maxLength = button.label.length;
                }
            });

            this.width = 9*maxLength + this.padding[3] + this.padding[1];

            // Adjust button width
            _.each(this.buttons, function(button) {
                button.width = self.width;
            });
        }
    });
    return ContextMenu;
});