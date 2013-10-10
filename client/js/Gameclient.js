define([], function () {
    var Gameclient = Class.extend({
        init: function (game) {
            this.game = game;
            this.host = "http://localhost";
            this.port = 8000;
            this.socket = null;
            this.connected = false;


            socket = io.connect("http://localhost:8000");

            this.handlers = [];
            this.handlers[Types.Messages.WELCOME] = this.receiveWelcome;
            this.handlers[Types.Messages.SPAWN] = this.receiveSpawn;

        },

        connect: function() {
            var self = this;
            this.socket = io.connect(this.host + ":" + this.port);


            socket.on('connect', function () {
                msg = ["hello"];
                self.sendMessage(msg);

                socket.on('message', function(data) {
                    self.receiveMessage(data);
                });
            });

        },

        receiveWelcome: function(data) {
            console.log("Welcome received! That's nice.")
            this.connected = true;
        },

        receiveSpawn: function(data) {
            console.log("Received Spawn. Too lazy to spawn now...");
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
                this.handlers[action](data);
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
        }
    });
    return Gameclient;
})