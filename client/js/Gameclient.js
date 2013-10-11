define([], function () {
    var Gameclient = Class.extend({
        init: function (game) {
            this.game = game;
            this.host = "http://192.168.94.100";
            this.port = 8000;
            this.socket = null;
            this.connected = false;


            this.handlers = [];
            this.handlers[Types.Messages.WELCOME] = this.receiveWelcome;
            this.handlers[Types.Messages.SPAWN] = this.receiveSpawn;
            this.handlers[Types.Messages.DESPAWN] = this.receiveDespawn;

        },

        connect: function() {
            var self = this;
            this.socket = io.connect(this.host + ":" + this.port);


            this.socket.on('connect', function () {
                msg = [Types.Messages.HELLO];
                self.sendMessage(msg);

                self.socket.on('message', function(data) {
                    self.receiveMessage(data);
                });
            });

        },

        receiveWelcome: function(data) {
            this.connected = true;
            var id = data[1]
            if(this.welcome_callback) {
                this.welcome_callback(id);
            }
        },

        receiveSpawn: function(data) {
            if(this.spawn_callback) {
                this.spawn_callback(data);
            }
        },

        receiveDespawn: function(data) {
            if(this.despawn_callback) {
                this.despawn_callback(data);
            }
        },

        receiveActionBatch: function(actions) {
            var self = this
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
            console.log(data);
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
            console.log("sendpickup!");
            this.sendMessage([Types.Messages.PICKUP,item.id]);
        },

        onWelcome: function(callback) {
            this.welcome_callback = callback;
        },

        onSpawn: function(callback) {
            this.spawn_callback = callback;
        },

        onDespawn: function(callback) {
            this.despawn_callback = callback;
        }
    });
    return Gameclient;
})