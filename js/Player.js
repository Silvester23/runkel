define(['Avatar','Drone'], function(Avatar,Drone) {
    var Player = Class.extend({
        init: function(game) {
            this.avatar = new Avatar();

            game.addEntity(this.avatar);

        }

        });
    return Player;
});