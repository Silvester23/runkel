var Class = require("./lib/class.js"),
    Messages = require("./Message.js"),
    _ = require("underscore"),
    Types = require("../../shared/Types.js"),
    Item = require("./Item.js");


var Worldserver = Class.extend({

    init: function(server) {
        this.server = server;
        this.players = {};
        this.outgoingQueues = {}
        this.ups = 20;

        this.width = 5;
        this.height = 5;


        // Tests
        this.items = {};
        for(var i = 0; i < 12; i++) {
            this.items["lilly" + i] = new Item("lilly" + i, Types.Entities.Items.LILLY, _.random(1,this.width), _.random(1,this.height))
        }

    },


    run: function() {
        var self = this;
        setInterval(function() {
            self.processQueues();
        }, 1000/ this.ups)
    },

    processQueues: function() {
        for(var id in this.outgoingQueues) {
            var queue = this.outgoingQueues[id];

            if(queue.length > 0) {
                try {
                    var c = this.server.connections[id];
                    console.log("broadcasting to id " + id);
                    c.send(queue);
                    this.outgoingQueues[id] = [];
                } catch(e) {
                    console.log("error debug: " + id + ' ' + this.server.connections);

                    throw(e);
                }
            }
        }
    },

    getPlayer: function(id) {
        if(this.players[id]) {
            return this.players[id];
        } else {
            return false;
        }
    },

    addPlayer: function(player) {
        var self = this;

        player.onExit(function() {
            self.removePlayer(player);
        });
        this.players[player.id] = player;
        this.outgoingQueues[player.id] = [];


        // Could be moved to a callback

        // Announce connection to other players
        this.pushBroadcast(new Messages.Spawn(player.id, Types.Entities.Characters.AVATAR, player.x, player.y).data, player.id);

        // Announce other players to connecting player
        _.each(this.players, function(p) {
            if(p.id !== player.id) {
                self.pushToPlayer(player, new Messages.Spawn(p.id, Types.Entities.Characters.AVATAR, p.x, p.y).data);
            }
        });


        // Test, push items to player
        _.each(this.items, function(item) {
            self.pushBroadcast(new Messages.Spawn(item.id, item.type, item.x, item.y).data);
        });
    },

    removePlayer: function(player) {
        console.log("removing player");
        if(this.players[player.id]) {
            delete this.players[player.id];
        }
        this.pushBroadcast(new Messages.Despawn(player.id).data, player.id)

        delete this.outgoingQueues[player.id]
    },

    pushToPlayer: function(player, message) {
        if(player && player.id && this.outgoingQueues[player.id]) {
            this.outgoingQueues[player.id].push(message);
        }
        else {
            console.error("pushToPlayer: invalid player.");
        }
    },

    pushBroadcast: function(message, ignore) {
        if(typeof ignore === "string") {
            ignore = [ignore];
        } else if(!ignore instanceof Array) {
            console.error("pushBroadcast: invalid ignore id/list.");
        }


        for(var id in this.outgoingQueues) {
            if(!_.contains(ignore, id)) {
                this.outgoingQueues[id].push(message);
            }
        }
    }
});


module.exports = Worldserver;
