define(['Entity'], function (Entity) {
    var Item = Entity.extend({
        init: function (id, x, y) {
            this._super(id, x, y);
            this.type = Types.Entities.Characters.LILLY;

        }
    });
    return Item;
});