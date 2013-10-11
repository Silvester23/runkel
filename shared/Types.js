Types = {
    Orientations: {
        UP: 1,
        DOWN: 2,
        LEFT: 3,
        RIGHT: 4
    },

    Entities: {
        Characters: {
            AVATAR: 1,
            DRONE: 2
        },

        Items: {
            LILLY: 1
        }
    },

    Messages: {
        HELLO: 1,
        WELCOME: 2,
        SPAWN: 3,
        MESSAGE: 4,
        DESPAWN: 5,
        PICKUP: 6,
        MOVE: 7
    },

    ButtonStates: {
        BASE: "base",
        DOWN: "down",
        ACTIVE: "active"
    },

    GUIElements: {
        IMGBUTTON: 1,
        SCREEN: 2,
        TABLE: 3
    },

    Actions: {
        TOGGLE_SCREEN: 1
    },

    Clicks: {
        VIEWPORT: 1,
        HUD: 2
    }
};


Types.isEntity = function(type) {
    return _.some(Types.Entities, function(cat) {
        return _.contains(cat,type);
    });
}

Types.isCharacter = function(type) {
    return _.contains(Types.Entities.Characters,type);
}

if(!(typeof exports === 'undefined')) {
    module.exports = Types;
}
