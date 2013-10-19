define(['Avatar','Item'], function(Avatar,Item) {
    var Player = Avatar.extend({
        init: function(id,x,y) {
            this._super(id,x,y);
            this.inventory = [];
            this.inventorySize = 12;

            var names = ["Telefonmann","Orangutan-Klaus","Helmut Körschgens","Nihil Baxter","Jürgeline","Erika","00 Schneider"]

            this.name = names[_.random(names.length-1)];
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
        },

        });
    return Player;
});