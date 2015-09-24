define([], function () {
    var Gameclient = Class.extend({
        init: function (game) {
            this.game = game;
            this.host = "http://localhost";
            this.port = 8000;
            this.socket = null;
            this.connected = false;


            this.handlers = [];
            this.handlers[Types.Messages.WELCOME] = this.receiveWelcome;
            this.handlers[Types.Messages.SPAWN] = this.receiveSpawn;
            this.handlers[Types.Messages.DESPAWN] = this.receiveDespawn;
            this.handlers[Types.Messages.MOVE] = this.receiveMove;
            this.handlers[Types.Messages.PICKUP] = this.receivePickup;
            this.handlers[Types.Messages.EQUIP] = this.receiveEquip;
            this.handlers[Types.Messages.DROP] = this.receiveDrop;

        },

        connect: function() {
            console.log("hallo");
            var self = this;
            this.socket = io.connect(this.host + ":" + this.port);

            this.socket.on('connect', function () {
                msg = [Types.Messages.HELLO];
                self.sendMessage(msg);
            });

            this.socket.on('message', function(data) {
                self.receiveMessage(data);
            });

        },

        receiveWelcome: function(data) {
            this.connected = true;
            var id = data[1],
                x = data[2],
                y = data[3],
                name = data[4];
            console.log(data);
            if(this.welcome_callback) {
                this.welcome_callback(id,x,y,name);
            } else {
                console.error("ERROR: No welcome callback!");
            }
        },

        receiveSpawn: function(data) {
            var id = data[1],
                type = data[2],
                x = data[3],
                y = data[4],
                name = data[5];
            if(Types.isCharacter(type)) {
               var inventory = data[6],
                    equipped = data[7];
                if(this.spawn_character_callback) {
                    this.spawn_character_callback(id,type,x,y,name,inventory,equipped);
                }
            } else if(Types.isItem(type)) {
                if(this.spawn_item_callback) {
                    this.spawn_item_callback(id,type,x,y,name);
                }
            }
        },

        receiveMove: function(data) {
            var id = data[1],
                x = data[2],
                y = data[3];

            if(this.entity_move_callback) {
                this.entity_move_callback(id,x,y);
            }
        },

        receiveDespawn: function(data) {
            var id = data[1];
            if(this.despawn_callback) {
                this.despawn_callback(id);
            }
        },

        receivePickup: function(data) {
            var charId = data[1],
                itemId = data[2];
            if(this.pickup_callback) {
                this.pickup_callback(charId,itemId);
            } else {
                console.log("No pickup callback!");
            }
        },

        receiveEquip: function(data) {
             var charId = data[1],
                 itemId = data[2];
            if(this.equip_callback) {
                this.equip_callback(charId,itemId);
            } else {
                console.log("No equip callback!");
            }
        },

        receiveDrop: function(data) {
            var charId = data[1],
                itemId = data[2],
                x = data[3],
                y = data[4];
            if(this.drop_callback) {
                this.drop_callback(charId,itemId,x,y);
            } else {
                console.log("No drop callback!");
            }
        },

        receiveActionBatch: function(actions) {
            var self = this;
            _.each(actions, function(action) {
                self.receiveAction(action);
            });
        },

        receiveAction: function(data) {
            var action = data[0];
            if(this.handlers[action] && _.isFunction(this.handlers[action])) {
                this.handlers[action].call(this, data);
            }
        },

        receiveMessage: function(data) {
            data = JSON.parse(data);
            console.log("Received message from server:" + data);
            if(data instanceof Array) {
                if(data[0] instanceof Array) {
                    this.receiveActionBatch(data);
                } else {
                    this.receiveAction(data)
                }
            }
        },

        sendMessage: function(data) {
            console.log("Sending message to server: " + data);
            data = JSON.stringify(data);
            this.socket.send(data);
        },

        sendPickup: function(item) {
            this.sendMessage([Types.Messages.PICKUP,item.id]);
        },

        sendEquip: function(item) {
            this.sendMessage([Types.Messages.EQUIP,item.id]);
        },

        sendMove: function(x, y) {
            this.sendMessage([Types.Messages.MOVE, x, y]);
        },

        sendSpawn: function(item) {
            this.sendMessage([Types.Messages.SPAWN,item.id]);
        },

        sendDrop: function(item) {
            this.sendMessage([Types.Messages.DROP,item.id,item.tileX,item.tileY]);
        },

        onWelcome: function(callback) {
            this.welcome_callback = callback;
        },

        onSpawn: function(callback) {
            console.warn("--- WARNING: onSpawn is deprecated! ---\n Use specific functions instead.");
            this.spawn_callback = callback;
        },

        onSpawnCharacter: function(callback) {
            this.spawn_character_callback = callback;
        },

        onSpawnItem: function(callback) {
            this.spawn_item_callback = callback;
        },

        onDespawn: function(callback) {
            this.despawn_callback = callback;
        },

        onEntityMove: function(callback) {
            this.entity_move_callback = callback;
        },

        onEquip: function(callback) {
            this.equip_callback = callback;
        },

        onPickup: function(callback) {
            this.pickup_callback = callback;
        },

        onDrop: function(callback) {
            this.drop_callback = callback;
        }
    });
    return Gameclient;
});