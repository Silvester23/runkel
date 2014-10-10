var Utils = {
    generateId: function(count) {
        return "id_" + this.randomInt(9999999) + "_" + count;
    },

    randomInt: function(range) {
        return Math.floor(Math.random() * range);
    }
}


module.exports = Utils;
