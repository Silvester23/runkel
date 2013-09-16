define([], function () {
    var App = Class.extend({
        init: function () {
            this.width = 640;
            this.height = 480;
            this.viewport = {}
            this.viewport.width = 640;
            this.viewport.height = 416;

        },

        setGame: function(game) {
            this.game = game;
        },

        isInBounds: function(x,y) {
            return (x <= this.viewport.width && y <= this.viewport.height);
        }


        /*
        getClickType: function(x,y) {
            elems = this.game.GUI.getVisibleElements();
            if(x >= this.viewport.width || y >= this.viewport.height ) {
                return Types.Clicks.HUD;
            }
            else {
                var type = Types.Clicks.VIEWPORT;
                _.each(elems, function(elem) {
                    if(x >= elem.x && x <= elem.x+elem.width
                        && y >= elem.y && y<= elem.y+elem.height) {
                        type = Types.Clicks.HUD;
                    }
                });
                return type;
            }
        }
        */
    });
    return App;
})