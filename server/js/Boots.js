var Item = require("./Item");


var Boots = Item.extend({
    init: function (id, type, x, y, name) {
        this._super(id, type, x, y, name);
        this.properties = {movespeed: -50};

        this.equipable = true;
    }
});

module.exports = Boots;