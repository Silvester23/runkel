var Server = require("./Server.js"),
    World = require("./Worldserver.js");

var server = new Server(),
    world = new World(server);

world.run();

server.onConnect(function(connection, id) {
    world.addPlayer(connection, id);
})






