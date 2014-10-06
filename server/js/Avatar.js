var Class = require("./lib/class.js"),
    Character = require("./Character.js"),
    Types = require("../../shared/Types.js");

var Avatar = Character.extend({
    init: function (id,x,y,name) {
        this._super(id,Types.Entities.Characters.AVATAR,x,y,name);
    }
});

module.exports = Avatar;