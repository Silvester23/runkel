define(['Entity', 'Transition'], function (Entity, Transition) {
    var Character = Entity.extend({
        init: function (id, x, y) {
            this._super(id, x, y);

            // Path movement
            this.path = null;
            this.step = 0;
            this.movement = new Transition();
            this.orientation = Types.Orientations.DOWN;


            // Milliseconds per tile. Standard movespeed
            this.movespeed = 200;

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
        }

    });
    return Character;
});