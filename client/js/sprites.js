define(['text!../sprites/ball.json','text!../sprites/avatar.json','text!../sprites/lilly.json'], function() {
    // Load list of sprites
    var sprites = {};
    
    _.each(arguments, function(spriteJson) {
        var sprite = JSON.parse(spriteJson);
        sprites[sprite.id] = sprite;
    });
    
    return sprites;
});