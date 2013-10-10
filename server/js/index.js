var Server = require("./Server.js"),
    Player = require("./Player.js"),
    World = require("./Worldserver.js");

var server = new Server();
var world = new World(server);

world.run();

server.onConnect(function(connection) {
    world.addPlayer(new Player(connection, world));
})




