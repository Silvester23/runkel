var Class = require("./lib/class.js"),
    Messages = require("./Message.js");

var Entity = Class.extend({
    init: function(id, type, x, y, name) {
        this.id = id;
        this.type = type;
        this.x = x;
        this.y = y;
        this.name = name;
    },

    setPosition: function(x,y) {
        this.x = x;
        this.y = y;
    },

    spawn: function() {
        return new Messages.Spawn(this.id,this.type,this.x,this.y);
    },

    getState: function() {
        return [this.id,this.type,this.x,this.y, this.name];
    }
});


module.exports = Entity;