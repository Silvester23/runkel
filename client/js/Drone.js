define(['Character'], function (Character) {
    var Drone = Character.extend({
        init: function (id) {
            this._super(id, 10, 10);
            this.setSprite("ball");
            this.setAnimation("idle_down", 5);
            this.lastTime = new Date().getTime();
        },

        walkTo: function(tiles) {
            return this._super(tiles);
        },


        update: function () {

        }
    });
    return Drone;
});