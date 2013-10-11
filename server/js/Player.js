var Messages = require("./Message.js"),
    Class = require("./lib/class.js"),
    Avatar = require("./Avatar.js"),
    Types = require("../../shared/Types.js")
    _ = require("underscore");



var Player = Avatar.extend({
    init: function(connection, world) {
        // Make player's avatar spawn at random position
        var x = Math.ceil(_.random(19)),
            y = Math.ceil(_.random(12));

        this._super(connection.id,Types.Entities.Characters.AVATAR,x,y);
        var self = this;

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
                self.world.pushBroadcast(new Messages.Move(id,x,y).data, self.id);
                self.setPosition(x,y);
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