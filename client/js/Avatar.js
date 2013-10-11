define(['Character'], function(Character) {
    var Avatar = Character.extend({
        init: function(id,x,y) {
            this._super(id, x, y);

            this.type = Types.Entities.Characters.AVATAR;
            this.movespeed = 200;
            this.setSprite("avatar");
            this.setAnimation("idle_down",300);

        }
    });
    return Avatar;
});