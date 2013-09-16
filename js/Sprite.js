define(['sprites','Animation'], function(sprites,Animation) {
    var Sprite = Class.extend({
        init: function(name) {
            this.name = name;
            this.loadJSON(sprites[name]);
            this.image = new Image();
            this.image.src = this.filepath;
        },
        
        loadJSON: function(data) {
            this.id = data.id;
            this.filepath = "img/" + this.id + ".png";
            this.width = data.width;
            this.height = data.height;
            this.animationData = data.animations;
        },
        
        createAnimations: function() {
            var animations = {};
        
             for(var name in this.animationData) {
                var a = this.animationData[name];
                animations[name] = new Animation(name, a.length, a.row, this.width, this.height, a.standardSpeed);
             }

             return animations;
         },
        });
    return Sprite;
});