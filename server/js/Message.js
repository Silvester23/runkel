var Class = require("./lib/class.js"),
    Types = require("../../shared/Types.js");


Messages = {};

var Message = Class.extend({
    init: function(message) {
        this.data = [Types.Messages.MESSAGE, message];
    }

});

Messages.Message = Message;

Messages.Welcome = Message.extend({
    init: function(id, x, y) {
        this.data = [Types.Messages.WELCOME,id, x, y];
    }
});

Messages.Spawn = Message.extend({
    init: function(id,type,x,y) {
        this.data = [Types.Messages.SPAWN,id,type,x,y];
    }
});

Messages.Despawn = Message.extend({
    init: function(id) {
        this.data = [Types.Messages.DESPAWN,id];
    }
});

Messages.Move = Message.extend({
    init: function(id,x,y) {
        this.data = [Types.Messages.MOVE,id,x,y];
    }
});

/*
Messages.Pickup = Message.extend({
    init: function(id) {
        this.data = [Types.Messages.PICKUP,id];
    }
});
*/

module.exports = Messages;