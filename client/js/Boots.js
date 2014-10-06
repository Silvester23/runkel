define(['Item'], function (Item) {
    var Boots = Item.extend({
        init: function (id, x, y, name, owner) {
            this._super(id, x, y, name, owner);
            this.setSprite("boots");
            this.setAnimation("idle_ground",175);

            this.properties = {movespeed: -50};

            this.equipable = true;

            this.offset = {x: 11, y: 21};
        }
    });
    return Boots;
});