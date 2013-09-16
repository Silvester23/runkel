define(['Character'], function(Character) {
    var Avatar = Character.extend({
        init: function() {
            this._super(Types.Entities.AVATAR,5,5);


            this.movespeed = 200;
            this.setSprite("avatar");
            this.setAnimation("idle_down",300);

        }
    });
    return Avatar;
});