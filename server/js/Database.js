var Class = require("./lib/class.js"),
    redis = require("redis");

var Database = Class.extend({
    init: function(type) {
        console.log("Initializing new database");

        if(type == "redis") {
            this.db = new RedisDB();
        }
    },

    insert: function(data) {
        return this.db.insert(data);
    },

    update: function(data) {
        return this.db.update(data);
    },

    query: function(source, condition) {
        return this.db.query(source, condition);
    }
});

var RedisDB = Class.extend({
    init: function() {
        this.client = redis.createClient();
        client.on("error", function (err) {
            console.log("Error " + err);
        });
    },

    insert: function(data) {

    },

    update: function(data) {

    },

    query: function(source, condition) {

    }

});




module.exports = Database;