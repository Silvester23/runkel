define(['Avatar','Item'], function(Avatar,Item) {
    var Player = Class.extend({
        init: function(game) {
            this.avatar = new Avatar("avatar");

            game.addEntity(this.avatar);
            this.inventory = [];
            this.inventorySize = 12;
            this.name = "Telefonmann";
            this.level = 1;

        },

        pickUp: function(item) {
            if(item instanceof Item && this.hasFreeInventorySlot()) {
                for(var i = 0; i < this.inventorySize; i++) {
                    if(typeof this.inventory[i] === "undefined") {
                        break;
                    }
                }
                this.inventory[i] = item;
                return true;
            } else {
                return false;
            }
        },

        hasFreeInventorySlot: function() {
            console.log(this.getNumItems());
            return this.getNumItems() < this.inventorySize;
        },

        getNumItems: function() {
            return _.filter(this.inventory, function(entity) { return typeof entity !== "undefined"}).length;
        }

        });
    return Player;
});