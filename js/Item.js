define(['Entity'], function (Entity) {
    var Item = Entity.extend({
        init: function (id,x,y) {
            this._super(id,x,y);

        }
    });
    return Item;
})