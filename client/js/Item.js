define(['Entity'], function (Entity) {
    var Item = Entity.extend({
        init: function (id, x, y, name, owner) {
            this._super(id, x, y, name);
            this.owner = owner;
        },

        setOwner: function(character) {
            this.owner = character;
        },

        drop: function() {
            // Returns true if the item was dropped successfully, false otherwise
            console.log(this);
            if(this.owner) {
                return this.owner.drop(this);
            } else {
                console.error("WARNING: Trying to drop an item without owner");
            }

            return false;
        }
    });
    return Item;
});