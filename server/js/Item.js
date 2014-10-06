var Class = require("./lib/class.js"),
    Entity = require("./entity.js");

var Item = Entity.extend({
    init: function (id,type,x,y,name) {
        this._super(id,type,x,y,name);
    }
});

module.exports = Item;