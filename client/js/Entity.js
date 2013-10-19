define(['Sprite'], function(Sprite) {
    var Entity = Class.extend({
        init: function (id, x, y) {
            this.x = _TILESIZE * x;
            this.y = _TILESIZE * y;

            this.tileX = x;
            this.tileY = y;
            this.id = id;

            // Visuals
            this.sprite = null;
            this.animations = null;
            this.currentAnimation = null;
            this.destroy = false;
        },

        setPosition: function (x, y) {
            this.x = x;
            this.y = y;
        },

        setGridPosition: function (tileX, tileY) {
            this.setPosition(tileX * _TILESIZE, tileY * _TILESIZE);
            this.tileX = tileX;
            this.tileY = tileY;
        },

        getGridPosition: function () {
            return {x: this.tileX, y: this.tileY};
        },

        setSprite: function (name) {
            sprite = new Sprite(name);
            if (this.sprite && this.sprite === sprite) {
                return;
            }

            this.sprite = sprite;

            this.animations = sprite.createAnimations();
        },

        getSprite: function () {
            return this.sprite;
        },

        setAnimation: function (name, speed) {
            a = this.getAnimationByName(name);

            if (typeof speed === 'undefined') {
                console.error("No animation speed specified");
            }

            if (a) {
                this.currentAnimation = a;
                this.currentAnimation.setSpeed(speed);
            }
        },


        getAnimationByName: function (name) {
            var animation = null;

            if (name in this.animations) {
                animation = this.animations[name];
            }
            else {
                console.error("No animation called " + name);
            }
            return animation;
        },

        setDestroy: function (v) {
            this.destroy = v;
        }

    });
    
return Entity;
});


