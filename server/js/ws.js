var Class = require("./lib/class.js").Class,
    url = require("url"),
    http = require("http"),
    fs = require("fs"),
    test = require("express"),
    _ = require("underscore");


var Server = Class.extend({
    init: function() {
        console.log("Initializing server.");

        this.connections = {};
        this.counter = 0;

        var express = require("express"),
            app = express(),
            http = require('http'),
            server = http.createServer(app),
            io = require('socket.io').listen(server),
            self = this;

        server.listen(8000);

        app.get( '/shared/:filename', function( req, res) {
            console.log("..");
            res.sendfile(req.params.filename, {root: "../../shared/"});
        });

        // Logger function for debug purposes. Enable in app.configure as needed
        var logger = function(req, res, next) {
            console.log(req.url);
            next();
        }

        app.configure(function() {
            //app.use(logger);
            app.use(express.static('../../client/'));
            app.use(app.router);
        });

        /*
        Old configuration. Might come in handy for debugging

        app.configure(function(){
            app.use(express.methodOverride());
            app.use(express.bodyParser());
            app.use(express.static('../../client/'));
            app.use(express.errorHandler({
                dumpExceptions: true,
                showStack: true
            }));
            app.use(app.router);
        });
        */


        io.sockets.on('connection', function (socket) {
            var c = new Connection(socket, self);
            self.addConnection(c);
        });
    },

    removeConnection: function(id) {
        delete this.connections[id];
    },

    addConnection: function(c) {
        this.connections[c.id] = c;
        console.log(_.size(this.connections));
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
            console.log("message received");
        });

        this.socket.on('disconnect', function () {
            self.server.removeConnection(this.id);
            console.log('Client id ' + this.id + " disconnected.");
        });

        console.log('Client-ID ' + this.id + " connected.");
    },

    send: function(msg) {
        data = JSON.stringify(msg);
        this.socket.send(data);
    }

});

exports.Server = Server;