var spriteNames = ["avatar","lilly","boots"];
var spriteStrings = [];
for(var i = 0; i < spriteNames.length; i++) {
    spriteStrings.push("text!../sprites/{0}.json".format(spriteNames[i]));
}

define(spriteStrings, function() {
    // Load list of sprites
    var sprites = {};
    
    _.each(arguments, function(spriteJson) {
        var sprite = JSON.parse(spriteJson);
        sprites[sprite.id] = sprite;
    });
    
    return sprites;
});