var Class = require("./lib/class.js").Class,
    url = require("url"),
    http = require("http"),
    fs = require("fs"),
    test = require("express");


var Server = Class.extend({
    init: function() {
        console.log("Initializing server.");

        var express = require("express"),
            app = express(),
            http = require('http')
            , server = http.createServer(app)
            , io = require('socket.io').listen(server);

        server.listen(8000);

        app.get( '/', function( req, res ){
            res.sendfile('index.html', { root: "../../client/"});
        });

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

        io.sockets.on('connection', function (socket) {
            socket.emit('news', { hello: 'world' });
            socket.on('my other event', function (data) {
                console.log(data);
            });
        });


    }

});

exports.Server = Server;