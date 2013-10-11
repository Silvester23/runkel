var Class = require("./lib/class.js"),
    Entity = require("./Entity.js");

/*
 * This is a mid-level class that will be needed later on. Right now it just passes everything through to Entity.
 */

var Character = Entity.extend({
    init: function (id,type,x,y) {
        this._super(id,type,x,y);
    }
});

module.exports = Character;