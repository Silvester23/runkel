var Class = require("./lib/class.js"),
    http = require("http"),
    _ = require("underscore"),
    express = require("express"),
    session = require("express-session"),
    cookieParser = require("cookie-parser"),
    cookie = require("cookie"),
    mysql = require("mysql"),
    Utils = require("./Utils.js");


var Server = Class.extend({
    init: function() {

        console.log("Initializing server.");

        this.connections = {};
        this.counter = 0;

        // Set up server and express ap
        var app = express(),
            server = http.createServer(app),
            io = require('socket.io').listen(server),
            self = this;

        // Configure express app
        var my_secret = "super-secret";

        app.use(cookieParser(my_secret));
        app.use(session({
            secret: my_secret,
            httpOnly: false,
            resave: true,
            saveUninitialized: true
        }));


        app.use(express.static('../../client/'));

        app.get( '/shared/:filename', function( req, res) {
            res.sendFile(req.params.filename, {root: "../../shared/"});
        });


        // Configure authorization
        io.set('authorization', function (data, callback) {
            if(data.headers.cookie) {
                console.log("I'll allow it...");
                var raw_cookies = cookie.parse(data.headers.cookie);
                var cookies = cookieParser.signedCookies(raw_cookies, my_secret);
                if(raw_cookies['connect.sid'] == cookies['connect.sid']) {
                    // If the values are equal, the signature was not resolved properly, i.e. the cookie has been tampered with. Reject connection
                    callback("Invalid connection attempt", true);
                }

                // Cookie was valid. Set connect.sid as authId
                data.authId = cookies['connect.sid'];

                callback(null, true);
            } else {
                callback("No cookie was transmitted.", false);
            }
        });

        // Configure io connections
        io.sockets.on('connection', function (socket) {
            if(!socket.handshake.authId) {
                // authId should always be set here
                console.error("No authId set on connection!");
            }

            var c = new Connection(socket, self);

            self.addConnection(c);
            if(self.connect_callback) {
                self.connect_callback(c,socket.handshake.authId);
            }
            self.counter++;

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