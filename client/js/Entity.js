define(['Sprite'], function(Sprite) {
    var Entity = Class.extend({
        init: function (id, x, y, name) {
            this.x = _TILESIZE * x;
            this.y = _TILESIZE * y;

            this.tileX = x;
            this.tileY = y;
            this.id = id;
            this.name = name;

            // Visuals
            this.sprite = null;
            this.animations = null;
            this.currentAnimation = null;
            this.destroy = false;

            this.visible = true;
        },

        setPosition: function (x, y) {
            this.x = x;
            this.y = y;
        },

        getInfo: function() {
            return this.name;
        },

        setGridPosition: function (tileX, tileY, dontmove) {
            this.tileX = tileX;
            this.tileY = tileY;

            if(!dontmove) {
                this.setPosition(tileX * _TILESIZE, tileY * _TILESIZE);
            }
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
        },

        getContextInformation: function() {
            // Returns an array with all context menu options
            var options = [
                {label: "Inspect " + this.name}
            ];

            return options;
        }

    });
    
return Entity;
});


