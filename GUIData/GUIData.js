/*
 * JSON for all GUI elements
 */

GUIElements = {
    InventoryButton: {
        id: "button_inventory",
        type: Types.GUIElements.IMGBUTTON,
        x: 5,
        y: 406,
        z: 0,
        width: 64,
        height: 64,
        tier: 'main_navigation',
        action: Types.Actions.TOGGLE_SCREEN
    },

    CharacterButton: {
        id: "button_character",
        type: Types.GUIElements.IMGBUTTON,
        x: 74,
        y: 406,
        z: 0,
        width: 64,
        height: 64,
        tier: 'main_navigation',
        action: Types.Actions.TOGGLE_SCREEN
    },

    InventoryScreen: {
        id: "screen_inventory",
        type: Types.GUIElements.SCREEN,
        x: 416,
        y: 0,
        z: 0,
        width: 224,
        height: 416,
        tier: 'main_screen'
    },

    CharacterScreen: {
        id: "screen_character",
        type: Types.GUIElements.SCREEN,
        x: 416,
        y: 0,
        z: 0,
        width: 224,
        height: 416,
        tier: 'main_screen'
    },

    InventoryTable: {
        id: "table_inventory",
        type: Types.GUIElements.TABLE,
        z: -1,
        cellsize: 48,
        rows: 4,
        cols: 3,
        position: "relative",
        align: "center",
        v_align: "center",
        parent: "screen_inventory"
    }
}