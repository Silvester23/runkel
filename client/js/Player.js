define(['Avatar'], function(Avatar) {
    var Player = Avatar.extend({
        init: function(id,x,y,name) {
            this._super(id,x,y,name);
            this.level = 1;
            this.xp = 0;

        },

        addXp: function(amount) {
            var scaled = amount/(this.level);
            if(this.xp + scaled >= 100) {
                scaled -= (100-this.xp);
                this.xp = 100;
                this.levelup();
                this.addXp(scaled);
            } else {
                this.xp += scaled;
            }
        },

        levelup: function() {
            this.level += 1;
            this.xp = this.xp % 100;
        }


        });
    return Player;
});