define(['Character'], function (Character) {
    var Updater = Class.extend({
        init: function (game) {
            this.game = game;

        },

        update: function() {
            this.updateCharacters();
            this.updateAnimations();
            this.updateTransitions();
            this.updateGUI();
        },

        updateGUI: function() {
            var now = this.game.currentTime
            _.each(this.game.GUI.elements,function(elem) {
                if(elem.update) {
                    elem.update(now);
                }
            });
        },

        updateCharacters: function() {
            var self = this;

            this.game.forEachEntity(function(entity) {
               if(entity instanceof Character) {
                   self.updateCharacter(entity);
               }
            });
        },

        updateAnimations: function() {
            var self = this;
            now = this.game.currentTime;


            this.game.forEachEntity(function(entity) {
                a = entity.currentAnimation;

                if(a) {
                    a.update(now);
                }
            });
        },

        updateCharacter: function(c) {
            var self = this;

            if(c.update) {
                c.update();
            }

            if(c.isMoving() && c.movement.inProgress === false) {

                if(c.orientation == Types.Orientations.RIGHT) {
                    c.movement.start(this.game.currentTime,
                                    function(x) {
                                        c.x = x;
                                    },
                                    function() {
                                        c.x = c.movement.endValue;
                                        c.nextStep();
                                    },
                                    c.x,
                                    c.x + _TILESIZE,
                                    c.movespeed);
                } else if(c.orientation == Types.Orientations.LEFT) {
                    c.movement.start(this.game.currentTime,
                        function(x) {
                            c.x = x;
                        },
                        function() {
                            c.x = c.movement.endValue;
                            c.nextStep();
                        },
                        c.x,
                        c.x - _TILESIZE,
                        c.movespeed);
                } else if(c.orientation == Types.Orientations.DOWN) {
                    c.movement.start(this.game.currentTime,
                        function(y) {
                            c.y = y;
                        },
                        function() {
                            c.y = c.movement.endValue;
                            c.nextStep();
                        },
                        c.y,
                        c.y + _TILESIZE,
                        c.movespeed);
                } else if(c.orientation == Types.Orientations.UP) {
                    c.movement.start(this.game.currentTime,
                        function(y) {
                            c.y = y;
                        },
                        function() {
                            c.y = c.movement.endValue;
                            c.nextStep();
                        },
                        c.y,
                        c.y - _TILESIZE,
                        c.movespeed);
                }
            }
        },

        updateTransitions: function() {
            var now = this.game.currentTime;
            this.game.forEachEntity(function(entity) {
                movement = entity.movement;
                if(movement) {
                    if(movement.inProgress) {
                        movement.step(now);
                    }
                }
            });
        }

        /*
        updateMovement: function() {
            game.forEachEntity(function(entity) {
                if(entity instanceof Character) {
                    c = entity;
                    if(c.isMoving()) {

                    }
                }
            });
        } */


    });
    return Updater;
})