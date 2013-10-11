var Messages = require("./Message.js"),
    Class = require("./lib/class.js");



var Player = Class.extend({
    init: function(connection, world) {
        var self = this;

        this.id = connection.id;
        this.connection = connection;
        this.world = world;
        this.helloReceived = false;


        // Make player spawn at random position
        this.x = Math.ceil(Math.random()*19);
        this.y = Math.ceil(Math.random()*12);

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
                self.connection.send(new Messages.Welcome(self.id, self.x, self.y).data);
            }

            if(action === Types.Messages.PICKUP) {
                var itemId = data[1];
                self.world.pushBroadcast(new Messages.Despawn(itemId).data, this.id);
            }

            if(action === Types.Messages.MOVE) {
                var id = data[1],
                    x = data[2],
                    y = data[3];
                console.log("Received move");
                self.world.pushBroadcast(new Messages.Move(id,x,y).data);
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