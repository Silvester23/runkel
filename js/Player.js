define(['Avatar','Item'], function(Avatar,Item) {
    var Player = Class.extend({
        init: function(game) {
            this.avatar = new Avatar();

            game.addEntity(this.avatar);
            this.inventory = [];
            this.inventorySize = 8;

            this.pickUp(new Item("Heftige Hellebarde",0,0));
            this.pickUp(new Item("Riesen Rüstung",0,0));

        },

        pickUp: function(item) {
            if(item instanceof Item && this.hasFreeInventorySlot()) {
                this.inventory.push(item);
                return true;
            } else {
                return false;
            }
        },

        hasFreeInventorySlot: function() {
            return this.inventory.length < this.inventorySize;
        }

        });
    return Player;
});