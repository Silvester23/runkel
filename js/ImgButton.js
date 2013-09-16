define(['Button'], function (Button) {
    var ImgButton = Button.extend({
        init: function (data) {
            this._super(data);
            this.state = Types.ButtonStates.BASE;
            this.nextState = Types.ButtonStates.ACTIVE;
            this.image = new Image();
            this.updateImageSrc();

            // ImgButtons should always deactivate all other buttons of the same section on click
        },

        activate: function() {
            this.setState(Types.ButtonStates.ACTIVE);
            this.nextState = Types.ButtonStates.BASE;
        },

        deactivate: function() {
            this.setState(Types.ButtonStates.BASE);
            this.nextState = Types.ButtonStates.ACTIVE;
        },

        click: function() {
            this._super();
            this.setState(Types.ButtonStates.DOWN);
            this.clickTime = new Date().getTime();
        },

        setState: function(state) {
            this.state = state;
            this.updateImageSrc();
        },

        updateImageSrc: function() {
            this.image.src = "img/buttons/" + this.id + "_" + this.state + ".png";
        },

        update: function(time) {
            if(this.clickTime) {
                if(this.state == Types.ButtonStates.DOWN && time - this.clickTime > 100) {
                    switch(this.nextState) {
                        case Types.ButtonStates.ACTIVE:
                            this.activate();
                            break;
                        case Types.ButtonStates.BASE:
                            this.deactivate();
                            break;
                    }
                    this.clickTime = null;
                }
            }
        }

    });
    return ImgButton;
})