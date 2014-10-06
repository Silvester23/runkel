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
        action: Types.Actions.TOGGLE_SCREEN,
        position: "absolute",
        align: "left",
        v_align: "bottom",
        offset: {x: 10, y: -12},
        label: "Inventar"
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
        action: Types.Actions.TOGGLE_SCREEN,
        position: "absolute",
        align: "left",
        v_align: "bottom",
        offset: {x: 84, y: -12},
        label: "Charakter"
    },

    InventoryScreen: {
        id: "screen_inventory",
        type: Types.GUIElements.SCREEN,
        z: 0,
        width: 224,
        height: 416,
        tier: 'main_screen',
        position: "absolute",
        align: "right",
        v_align: "top"
    },

    CharacterScreen: {
        id: "screen_character",
        type: Types.GUIElements.SCREEN,
        z: 0,
        width: 224,
        height: 416,
        tier: 'main_screen',
        position: "absolute",
        align: "right",
        v_align: "top"
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
    },

    ContextMenu: {
        id: "contextmenu",
        type: Types.GUIElements.CONTEXTMENU,
        x: 0,
        y: 0,
        z: -2,
        width: 160,
        height: 224
    }
};