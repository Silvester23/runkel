var Class = require("./lib/class.js"),
    url = require("url"),
    http = require("http"),
    fs = require("fs"),
    _ = require("underscore"),
    express = require("express"),
    session = require("cookie-session"),
    cookieParser = require("cookie-parser"),
    RedisStore = require("connect-redis")(express);


var Server = Class.extend({
    init: function() {
        console.log("Initializing server.");

        this.connections = {};
        this.counter = 0;

        var app = express(),
            server = http.createServer(app),
            io = require('socket.io').listen(server),
            self = this;



        app.configure(function() {
            var my_secret = "super-secret";

            app.use(express.cookieParser());
            app.use(express.session({
                secret: my_secret,
                key: 'connect.sid'
            }));

            app.use(function(req, res) {
                //res.cookie("test","telefon");
            });


            app.use(express.static('../../client/'));
            app.use(app.router);
        });

        app.get( '/shared/:filename', function( req, res) {
            res.sendfile(req.params.filename, {root: "../../shared/"});
            //console.log(req.cookies);
        });

        // Logger function for debug purposes. Enable in app.configure as needed
        var logger = function(req, res, next) {
            console.log(req.url);
            next();
        };

        io.sockets.on('connection', function (socket) {
            var c = new Connection(socket, self);
            self.addConnection(c);
            if(self.connect_callback) {
                self.connect_callback(c);
            }
        });

        server.listen(8000);

    },

    onConnect: function(callback) {
        this.connect_callback = callback;
    },

    removeConnection: function(id) {
        delete this.connections[id];
    },

    addConnection: function(c) {
        this.connections[c.id] = c;
    },


    broadcast: function(msg) {
        _.each(this.connections, function(c) {
            c.send(msg);
        });
    }

});


var Connection = Class.extend({
    init: function(socket, server) {
        this.id = socket.id;
        this.socket = socket;
        this.server= server;
        var self = this;


        this.socket.on('message', function(data) {
            if(self.message_callback) {
                var message = JSON.parse(data);
                self.message_callback(message);
            }
        });

        this.socket.on('disconnect', function () {

            if(self.disconnect_callback) {
                self.disconnect_callback();
            }

            self.server.removeConnection(this.id);
            console.log('Client id ' + this.id + " disconnected.");
        });

        console.log('Client-ID ' + this.id + " connected.");
    },

    send: function(msg) {
        var data = JSON.stringify(msg);
        this.socket.send(data);
    },

    close: function(reason) {
        reason = typeof reason === "undefined" ? "" : reason;
        console.log("Closing connection to Client-ID " + this.id + ". Reason: " + reason);
        this.socket.disconnect();
    },

    onDisconnect: function(callback) {
        this.disconnect_callback = callback;
    },

    listen: function(callback) {
        this.message_callback = callback;
    }

});

module.exports = Server;