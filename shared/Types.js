Types = {
    Orientations: {
        UP: 1,
        DOWN: 2,
        LEFT: 3,
        RIGHT: 4
    },

    Entities: {
        Characters: {
            PLAYER: 1,
            AVATAR: 2
        },

        Items: {
            LILLY: 3,
            BOOTS: 4
        }
    },

    Tiles: {
        GRASS: 1,
        SNOW: 2
    },

    Messages: {
        HELLO: 1,
        WELCOME: 2,
        SPAWN: 3,
        MESSAGE: 4,
        DESPAWN: 5,
        PICKUP: 6,
        MOVE: 7,
        DROP: 8,
        EQUIP: 9
    },

    ButtonStates: {
        BASE: "base",
        DOWN: "down",
        ACTIVE: "active",
        HOVER: "hover"
    },

    GUIElements: {
        IMGBUTTON: 1,
        SCREEN: 2,
        TABLE: 3,
        CONTEXTMENU: 4,
        CONTEXTMENUBUTTON: 5,
        INVENTORYICON: 6
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
};

Types.isItem = function(type) {
    return _.contains(Types.Entities.Items,type);
};

Types.isCharacter = function(type) {
    return _.contains(Types.Entities.Characters,type);
};

if(!(typeof exports === 'undefined')) {
    module.exports = Types;
}
