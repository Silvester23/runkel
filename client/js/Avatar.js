define(['Character'], function(Character) {
    var Avatar = Character.extend({
        init: function(id,x,y,name) {
            this._super(id, x, y, name);
            this.setSprite("avatar");
            this.setAnimation("idle_down",300);

        }
    });
    return Avatar;
});