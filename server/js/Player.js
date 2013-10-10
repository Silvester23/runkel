var Messages = require("./Message.js"),
    Class = require("./lib/class.js");



var Player = Class.extend({
    init: function(connection, world) {
        var self = this;

        this.id = connection.id;
        this.connection = connection;
        this.world = world;
        this.helloReceived = false;

        this.connection.listen(function(data) {
            var action = data[0];
            if(!this.helloReceived && action !== Types.Messages.HELLO) {
                self.connection.close("First Message must be Hello.");
            }

            if(this.helloReceived && action === Types.Messages.HELLO) {
                self.connection.close("Hello can only be sent once.");
            }

            if(action === Types.Messages.HELLO) {
                this.helloReceived = true;
                self.connection.send(new Messages.Welcome().data);
            }

            if(action === Types.Messages.PICKUP) {
                console.log("sending item despawn");
                var itemId = data[1];
                self.world.pushBroadcast(new Messages.Despawn(data[1]).data);
            }
        });

        this.connection.onDisconnect(function() {
            if(self.exit_callback) {
                self.exit_callback();
            }
        });

    },

    onExit: function(callback) {
        this.exit_callback = callback;
    }
});


module.exports = Player;