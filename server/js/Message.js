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
    init: function() {
        this.data = [Types.Messages.WELCOME];
    }
});

Messages.Spawn = Message.extend({
    init: function(id) {
        this.data = [Types.Messages.SPAWN,id];
    }
});

Messages.Despawn = Message.extend({
    init: function(id) {
        this.data = [Types.Messages.DESPAWN,id];
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