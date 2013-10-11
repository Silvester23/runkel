var Class = require("./lib/class.js"),
    Character = require("./Character.js"),
    Types = require("../../shared/Types.js");

var Avatar = Character.extend({
    init: function (id,x,y) {
        this._super(id,Types.Entities.Characters.AVATAR,x,y);
    }
});

module.exports = Avatar;