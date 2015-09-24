var Class = require("./lib/class.js"),
    Messages = require("./Message.js"),
    _ = require("underscore"),
    Types = require("../../shared/Types.js"),
    Item = require("./Item.js"),
    mapData = require("../../shared/world.js"),
    mysql = require("mysql"),
    Player = require("./Player.js"),
    Boots = require("./Boots.js"),
    Database = require("./Database.js");


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


        //this.database = new Database();

        this.sqlCon = mysql.createConnection({
            host     : 'localhost',
            user     : 'root',
            password : 'hallo'
        });

        //this.sqlCon.connect();



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

    addPlayer: function(connection, id) {
        var self = this;

        var sqlCallback = function(rows) {
            // This function is called once the query for the player data has finished
            var player;
            if(rows.length == 0) {
                // Player not found
                player = new Player(connection,self,id);
                var playerData = {
                    internal_id: id,
                    name: player.name,
                    inventory: "",
                    equipped: "",
                    posX: player.x,
                    posY: player.y
                };

                /*
                var query = self.sqlCon.query('INSERT INTO runkel.players SET ?', playerData, function(err, result) {
                    if (err) throw err;
                });
                */



            } else if(rows.length == 1) {
                // Player found
                player = new Player(connection,self,id);
                player.name = rows[0]['name'];
                console.log("Setting position to ", rows[0]['posX'],rows[0]['posY']);
                player.setPosition(parseInt(rows[0]['posX']),parseInt(rows[0]['posY']));
            } else {
                // This should never happen
                console.error("More than one player with id '" + id + "' found.");
            }


            player.onExit(function() {

                var playerData = {
                    posX: player.x,
                    posY: player.y
                };
                /*
                var query = self.sqlCon.query('UPDATE runkel.players SET ?', playerData, function(err, result) {
                    if (err) throw err;

                    self.removePlayer(player);
                });
                */

                 self.removePlayer(player);

            });
            self.players[player.id] = player;
            self.addEntity(player);
            self.outgoingQueues[player.id] = [];

            // Could be moved to a callback

            // Announce connection to other players
            self.pushBroadcast(new Messages.Spawn(player).data, player.id);

            // Announce other players to connecting player
            _.each(self.players, function(p) {
                if(p.id !== player.id) {
                    self.pushToPlayer(player, new Messages.Spawn(p).data);
                }
            });

            // Test, push items to player
            _.each(self.items, function(item) {
                self.pushBroadcast(new Messages.Spawn(item).data);
            });
        };

        sqlCallback([]);

        /*
        var rows = [],
            sqlFields;
        var query = this.sqlCon.query("SELECT * FROM runkel.players WHERE internal_id = '" + id + "'");
        // Collect rows, call callback when all rows have been collected
        query.on('error', function(err) {
            console.error("Error during SQL connection");
            })
            .on('fields', function(fields) {
                sqlFields =  fields;
            })
            .on('result', function(row) {
                rows.push(row);
            })
            .on('end', function() {
                sqlCallback(rows);
            });
            */
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
