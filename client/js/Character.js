define(['Entity', 'Transition','Item'], function (Entity, Transition,Item) {
    var Character = Entity.extend({
        init: function (id, x, y, name) {
            this._super(id, x, y, name);

            // Path movement
            this.path = null;
            this.step = 0;
            this.movement = new Transition();
            this.orientation = Types.Orientations.DOWN;

            // Milliseconds per tile. Standard movespeed
            this.movespeed = 200;

            this.inventory = [];
            this.inventorySize = 12;
            this.equipped = [];

        },

        pickUp: function(item) {
            if(item instanceof Item && this.hasFreeInventorySlot()) {
                for(var i = 0; i < this.inventorySize; i++) {
                    if(typeof this.inventory[i] === "undefined") {
                        break;
                    }
                }
                this.inventory[i] = item;

                item.setOwner(this);

                return true;
            } else {
                return false;
            }
        },

        equip: function(item) {
            if(item.equipable && _.indexOf(this.equipped, item) == -1) {
                this.equipped.push(item);

                if(item.properties) {
                    this.addProperties(item.properties);
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
                    this.removeProperties(item.properties);
                }
            }

            this.equipped = _.compact(this.equipped);
        },

        drop: function(item) {
            if(item instanceof Item) {
                var index = _.indexOf(this.inventory,item);

                this.unequip(item);
                delete this.inventory[index];

                if(this.drop_item_callback) {
                    this.drop_item_callback(item);
                }

                // Necessary so that the Game knows that the item was dropped successfully.
                return true;
            }
        },

        hasEquipped: function(item) {
            return _.indexOf(this.equipped, item) != -1;
        },


        addProperties: function(props) {
            for(var prop in props) {
                if(typeof props[prop] === "number") {
                    if(this[prop]) {
                        this[prop] += props[prop];
                    }
                }
            }
        },

        removeProperties: function(props) {
            for(var prop in props) {
                if(typeof props[prop] === "number") {
                    if(this[prop]) {
                        this[prop] -= props[prop];
                    }
                }
            }
        },

        hasFreeInventorySlot: function() {
            return this.getNumItems() < this.inventorySize;
        },

        getNumItems: function() {
            return _.filter(this.inventory, function(entity) { return typeof entity !== "undefined"}).length;
        },

        getInventoryItemById: function(id) {
            return _.find(this.inventory, function(item) {
                return item.id == id;
            });
        },

        requestPathTo: function (src, dest) {
            if (this.requestpath_callback) {
                return this.requestpath_callback(src,dest);
            }
            else
                return false;
        },

        onStopPathing: function (callback) {
            this.stop_pathing_callback = callback;
        },

        onRequestPathTo: function (callback) {
            this.requestpath_callback = callback;
        },

        onStep: function (callback) {
            this.step_callback = callback;
        },

        onBeforeStep: function (callback) {
            this.before_step_callback = callback;
        },

        onDropItem: function(callback) {
            this.drop_item_callback = callback;
        },

        followPath: function (path) {
            this.path = path;
            this.step = 0;
            this.nextStep();
        },

        continueTo: function (x,y) {
            var src = {x: this.path[this.step][0], y: this.path[this.step][1]};
            var dest = {x: x, y: y};
            this.path = this.requestPathTo(src, dest);
            this.step = 0;
        },

        walkTo: function (x,y) {
            var src = {x: this.tileX, y: this.tileY};
            var dest = {x: x, y: y};
            var path = this.requestPathTo(src,dest);

            if (!this.isMoving()) {
                if (path.length > 1) {
                    // Start new path
                    this.followPath(path);
                }
            } else {
                //if(path.length > 1) {
                // Adjust current path
                if (!_.isEqual(path[path.length - 1], this.path[this.path.length - 1])) {
                    this.continueTo(x,y);
                }
                //}
            }
        },

        nextStep: function () {
            var stop = false;
            if (this.before_step_callback) {

                this.before_step_callback();
            }

            this.updateGridPosition();

            if (this.interrupted) {
                stop = true;
                this.interrupted = false;
            }
            else {
                if (this.hasNextStep()) {
                    this.step += 1;
                    if (this.path[this.step][0] > this.path[this.step - 1][0]) {
                        this.orientation = Types.Orientations.RIGHT;
                        this.setAnimation("walk_right", 50);
                    } else if (this.path[this.step][0] < this.path[this.step - 1][0]) {
                        this.orientation = Types.Orientations.LEFT;
                        this.setAnimation("walk_left", 50);
                    } else if (this.path[this.step][1] > this.path[this.step - 1][1]) {
                        this.orientation = Types.Orientations.DOWN;
                        this.setAnimation("walk_down", 50);
                    } else if (this.path[this.step][1] < this.path[this.step - 1][1]) {
                        this.orientation = Types.Orientations.UP;
                        this.setAnimation("walk_up", 50);
                    }

                } else {
                    // No more steps. Stop moving
                    stop = true;
                }

                if (this.step_callback) {
                    this.step_callback();
                }
            }

            if (stop) {
                this.path = null;
                this.step = 0;
                this.idle();
                if (this.stop_pathing_callback) {
                    this.stop_pathing_callback();
                }
            }
        },

        stop: function () {
            if (this.isMoving()) {
                this.interrupted = true;
            }
        },

        idle: function () {
            switch (this.orientation) {
                case Types.Orientations.LEFT:
                    this.setAnimation("idle_left", 300);
                    break;
                case Types.Orientations.RIGHT:
                    this.setAnimation("idle_right", 300);
                    break;
                case Types.Orientations.UP:
                    this.setAnimation("idle_up", 300);
                    break;
                case Types.Orientations.DOWN:
                    this.setAnimation("idle_down", 300);
                    break;
            }
        },

        hasNextStep: function () {
            return ((this.path.length - 1) > this.step);
        },

        isMoving: function () {
            return this.path !== null;
        },

        updateGridPosition: function () {
            if (this.isMoving()) {
                this.setGridPosition(this.path[this.step][0], this.path[this.step][1]);
            }
        },

        getContextInformation: function() {
            var options = this._super();
            // No further options just yet
            return options;
        }

    });
    return Character;
});