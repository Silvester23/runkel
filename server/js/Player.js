var Messages = require("./Message.js"),
    Class = require("./lib/class.js"),
    Avatar = require("./Avatar.js"),
    Types = require("../../shared/Types.js"),
    _ = require("underscore");



var Player = Avatar.extend({
    init: function(connection, world, id) {
        console.log("Creating player with id " + id);


        // Make player's avatar spawn at random position
        var x = Math.ceil(_.random(1,world.width-2)),
            y = Math.ceil(_.random(1,world.height-2));


        // Debug stuff
        var names = ["Telefonmann","Orangutan-Klaus","Helmut Körschgens","Nihil Baxter","Jürgeline","Erika","00 Schneider"];

        this._super(id,x,y,names[_.random(names.length-1)]);


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
                self.connection.send(new Messages.Welcome(self.id, self.x, self.y,self.name).data);
            }

            if(action === Types.Messages.PICKUP) {
                var item = self.world.getEntityById(data[1]);

                if(item) {
                    self.broadcast(new Messages.Pickup(self,item));

                    // Add item to inventory, then delete it from entity lists
                    self.pickUp(item);
                    self.world.removeEntity(item);
                } else {
                    console.log("Received PICKUP on invalid item!");
                }
            }

            if(action === Types.Messages.EQUIP) {
                console.log("Received equip");
                var item = self.getInventoryItemById(data[1]);

                if(item) {
                    self.equip(item);

                    self.broadcast(new Messages.Equip(self,item));
                }
            }

            if(action === Types.Messages.DROP) {
                var item = self.getInventoryItemById(data[1]),
                    x = data[2],
                    y = data[3];

                if(item) {
                    if(self.drop(item)) {
                        item.setPosition(x,y);
                        self.broadcast(new Messages.Drop(self,item));
                        self.world.addItem(item);
                    } else {
                        console.log("Something went wrong trying to drop an item.");
                    }
                } else {
                    console.log("Received DROP on invalid item!");
                }
            }

            if(action === Types.Messages.MOVE) {
                var x = data[1],
                    y = data[2];
                self.broadcast(new Messages.Move(self,x,y));
                self.setPosition(x,y);
            }

            if(action === Types.Messages.SPAWN) {
                var id = data[1],
                    entity = self.world.getEntityById(id);
                if(entity) {
                    self.broadcast(new Messages.Spawn(entity));
                }
            }
        });

        this.connection.onDisconnect(function() {
            if(self.exit_callback) {
                self.exit_callback();
            }
        });

    },

    broadcast: function(message, ignoreSelf) {
        ignoreSelf = ignoreSelf === undefined ? true : ignoreSelf;
        // If ignoreSelf is not set, pass empty list as ignore argument to ignore nothing.
        var ignoreList = ignoreSelf ? this.id : [];
        this.world.pushBroadcast(message.data, ignoreList);
    },

    onExit: function(callback) {
        this.exit_callback = callback;
    },

    getConnection: function() {
        return this.connection;
    }
});


module.exports = Player;