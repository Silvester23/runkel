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
    init: function(id, x, y, name) {
        this.data = [Types.Messages.WELCOME,id, x, y, name];
    }
});

Messages.Spawn = Message.extend({
    init: function(entity) {
        this.data = [Types.Messages.SPAWN].concat(entity.getState());
    }
});

Messages.Despawn = Message.extend({
    init: function(entity) {
        this.data = [Types.Messages.DESPAWN,entity.id];
    }
});

Messages.Move = Message.extend({
    init: function(entity,x,y) {
        this.data = [Types.Messages.MOVE,entity.id,x,y];
    }
});

Messages.Equip = Message.extend({
    init: function(c,item) {
        this.data = [Types.Messages.EQUIP,c.id,item.id];
    }
});

Messages.Pickup = Message.extend({
    init: function(c,item) {
        this.data = [Types.Messages.PICKUP,c.id,item.id];
    }
});

Messages.Drop = Message.extend({
    init: function(c,item) {
        this.data = [Types.Messages.DROP,c.id,item.id,item.x,item.y];
    }
});




module.exports = Messages;