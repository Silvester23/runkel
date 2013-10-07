define([], function () {
    var App = Class.extend({
        init: function () {
            var self = this;
            this.width = 640;
            this.height = 480;
            this.viewport = {}
            this.viewport.width = 640;
            this.viewport.height = 416;

            // Handle User Input

           /* canvas.onclick = function(evt){
                //self.click(evt);
                console.log("mouse click");
            };
            */
            canvas.onmousedown = function(evt) {
                if(self.game.mousedown(evt)) {
                }
            };

            canvas.onmouseup = function(evt) {
                /*if(self.game.dragging()) {
                    console.log("stop dragging");
                    self.game.dragElement = null;
                } */
            };

            canvas.onclick = function(evt) {
                if(self.game.dragging()) {
                    if(self.game.dragElement.release) {
                        self.game.dragElement.release();
                    }
                    self.game.dragElement = null;
                }
                else {
                    self.game.click(evt);
                }
            };

            canvas.onmousemove = function(evt) {
                self.game.hover(evt);
            };

            canvas.oncontextmenu = function(evt) {
                console.info("right click captured");
                return false;
            };

        },

        setGame: function(game) {
            this.game = game;
            console.info("Game set");
        },

        isInBounds: function(x,y) {
            return (x <= this.viewport.width && y <= this.viewport.height);
        }


    });
    return App;
})