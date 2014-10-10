var Class = require("./lib/class.js"),
    Messages = require("./Message.js"),
    _ = require("underscore"),
    Types = require("../../shared/Types.js"),
    Item = require("./Item.js"),
    mapData = require("../../shared/world.js"),
    Boots = require("./Boots.js");


var Worldserver = Class.extend({

    init: function(server) {
        this.server = server;
        this.outgoingQueues = {};
        this.ups = 20;

        this.width = mapData.width;
        this.height = mapData.height;

        this.entities = {};
        this.players = {};
        this.items = {};


        // Add some items for test only
        this.addItem(new Boots("boots1",Types.Entities.Items.BOOTS,2,2,"Boots"));

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
                    var c = this.getPlayer(id).getConnection();
                    console.log("broadcasting to id " + c.id);
                    c.send(queue);
                    this.outgoingQueues[id] = [];
                } catch(e) {
                    console.log("error debug: " + c.id + ' ' + this.server.connections);

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

    getEntityById: function(id) {
        var entity = this.entities[id];
        if(entity) {
            return entity;
        }
    },

    addEntity: function(entity) {
        this.entities[entity.id] = entity;
    },

    addItem: function(item) {
        this.items[item.id] = item;
        this.addEntity(item);
    },

    addPlayer: function(player) {
        var self = this;

        player.onExit(function() {
            self.removePlayer(player);
        });
        this.players[player.id] = player;
        this.addEntity(player);
        this.outgoingQueues[player.id] = [];


        // Could be moved to a callback

        // Announce connection to other players
        this.pushBroadcast(new Messages.Spawn(player).data, player.id);

        // Announce other players to connecting player
        _.each(this.players, function(p) {
            if(p.id !== player.id) {
                self.pushToPlayer(player, new Messages.Spawn(p).data);
            }
        });

        // Test, push items to player
        _.each(this.items, function(item) {
            self.pushBroadcast(new Messages.Spawn(item).data);
        });
    },

    removeEntity: function(entity) {
        if(entity.id in this.entities) {
            delete this.entities[entity.id];
        }

        if(entity.id in this.items) {
            delete this.items[entity.id];
        }

    },

    removePlayer: function(player) {
        if(this.players[player.id]) {
            delete this.players[player.id];
            this.removeEntity(player);
        }
        this.pushBroadcast(new Messages.Despawn(player).data, player.id);

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
