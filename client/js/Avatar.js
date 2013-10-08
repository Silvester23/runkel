define(['Character'], function(Character) {
    var Avatar = Character.extend({
        init: function(id) {
            this._super(id, 5, 5);

            this.type = Types.Entities.Characters.AVATAR;
            this.movespeed = 200;
            this.setSprite("avatar");
            this.setAnimation("idle_down",300);

        }
    });
    return Avatar;
});