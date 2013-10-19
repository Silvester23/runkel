var Class = require("./lib/class.js"),
    Entity = require("./entity.js");

var Item = Entity.extend({
    init: function (id,type,x,y) {
        this._super(id,type,x,y);
    }
});

module.exports = Item;