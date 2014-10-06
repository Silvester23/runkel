define(['Button'], function (Button) {
    var ImgButton = Button.extend({
        init: function (data) {
            this._super(data);
            this.state = Types.ButtonStates.BASE;
            this.nextState = Types.ButtonStates.ACTIVE;

            this.images = {};
            this.initImages();
            this.image = this.images[this.state];
        },

        initImages: function() {
            var states = [Types.ButtonStates.BASE, Types.ButtonStates.ACTIVE, Types.ButtonStates.DOWN];

            for(var i = 0; i < states.length; i++) {
                var state = states[i];
                this.images[state] = new Image();
                this.images[state].src = "img/buttons/" + this.id + "_" + state + ".png";
            }

        },

        activate: function () {
            this.setState(Types.ButtonStates.ACTIVE);
            this.nextState = Types.ButtonStates.BASE;
        },

        deactivate: function () {
            this.setState(Types.ButtonStates.BASE);
            this.nextState = Types.ButtonStates.ACTIVE;
        },

        click: function () {
            this._super();
            this.setState(Types.ButtonStates.DOWN);
            this.clickTime = new Date().getTime();
        },

        setState: function (state) {
            this.state = state;
            this.updateImage();
        },

        updateImage: function() {
            this.image = this.images[this.state];
        },

        update: function (time) {
            if (this.clickTime) {
                if (this.state == Types.ButtonStates.DOWN && time - this.clickTime > 100) {
                    switch (this.nextState) {
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
        },

        getInfo: function() {
            if(this.label) {
                return this.label;
            }
        }

    });
    return ImgButton;
});