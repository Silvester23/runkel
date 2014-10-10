var Class = require("./lib/class.js"),
    Entity = require("./Entity.js"),
    _ = require("underscore");

/*
 * This is a mid-level class that will be needed later on. Right now it just passes everything through to Entity.
 */

var Character = Entity.extend({
    init: function (id,type,x,y,name) {
        this._super(id,type,x,y,name);

        this.inventory = [];
        this.inventorySize = 12;
        this.equipped = [];
    },

    getState : function() {
        var baseState = this._super();
        var inv = [],
            eq = [];
        _.each(this.inventory, function(item) {
            inv.push(item.getState())
        });

        _.each(this.equipped, function(item) {
            eq.push(item.id)
        });
        return baseState.concat([inv,eq]);
    },

    getInventoryItemById: function(id) {
        return _.find(this.inventory, function(item) {
            return item.id == id;
        });
    },

    pickUp: function(item) {
        for(var i = 0; i < this.inventorySize; i++) {
            if(typeof this.inventory[i] === "undefined") {
                break;
            }
        }
        this.inventory[i] = item;

        return true;
    },

    equip: function(item) {
        if(item.equipable) {
            this.equipped.push(item);

            if(item.properties) {
                // TODO
                //this.addProperties(item.properties);
            }
            return true;
        } else {
            return false;
        }
    },

    unequip: function(item) {
        var index = _.indexOf(this.equipped,item);
        if(index != -1) {
            delete this.equipped[index];

            if(item.properties) {
                // TODO
                //this.removeProperties(item.properties);
            }
        }

        this.equipped = _.compact(this.equipped);
    },

    drop: function(item) {
        var index = _.indexOf(this.inventory,item);

        this.unequip(item);
        delete this.inventory[index];

        item.setPosition(this.x, this.y);

        return true;
    },

    hasFreeInventorySlot: function() {
        return this.getNumItems() < this.inventorySize;
    },

    getNumItems: function() {
        return _.filter(this.inventory, function(entity) { return typeof entity !== "undefined"}).length;
    }
});

module.exports = Character;