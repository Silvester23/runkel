define(['Character'], function(Character) {
    var Drone = Character.extend({
        init: function () {
            this._super(Types.Entities.DRONE,10,10);
            this.setSprite("ball");
            this.setAnimation("idle_down",5);

            this.lastTime = new Date().getTime();
        },


        update: function() {

            now = new Date().getTime();
            if(now - this.lastTime > 2000) {
                this.lastTime = now;
                rnd = Math.random()
                if(rnd <= 0.7) {
                    var x = Math.floor(Math.random() * 640/_TILESIZE);
                    var y = Math.floor(Math.random() * 480/_TILESIZE);
                    this.walkTo([x,y]);
                }
            }
        }
    });
    return Drone;
})