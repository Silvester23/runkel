define(['ImgButton','Screen','Table','InventoryIcon','ContextMenu','ContextMenuButton'],
    function (ImgButton,Screen,Table,InventoryIcon,ContextMenu,ContextMenuButton) {
    var GUIElementFactory = Class.extend({
        init: function (GUI) {
            this.builders = {};
            this.GUI = GUI;


            this.builders[Types.GUIElements.IMGBUTTON] = this.createImgButton;
            this.builders[Types.GUIElements.SCREEN] = this.createScreen;
            this.builders[Types.GUIElements.TABLE] = this.createTable;
            this.builders[Types.GUIElements.CONTEXTMENU] = this.createContextMenu;
            this.builders[Types.GUIElements.CONTEXTMENUBUTTON] = this.createContextMenuButton;
            this.builders[Types.GUIElements.INVENTORYICON] = this.createInventoryIcon;


        },

        createElement: function(data) {
            if(_.isFunction(this.builders[data.type])) {
                return this.builders[data.type](data);
            }
        },

        createImgButton: function(elemData) {
            var btn = new ImgButton(elemData);
            var self = this;

            // Register element in arrays
            //this.buttons[elemData.id] = btn;
            //this.GUI.elements[elemData.id] = btn;
            return btn;
        },

        createScreen: function(elemData) {
            var screen = new Screen(elemData);

            return screen;

            // Register element in arrays
            //this.screens[elemData.id] = screen;
            //this.GUI.elements[elemData.id] = screen;
        },

        createContextMenu: function(elemData) {
            var contextMenu = new ContextMenu(elemData),
                self = this;

            return contextMenu;
        },

        createContextMenuButton: function(label) {
            var width = this.GUI.elements["contextmenu"].width,
                height = 32,
                id = "contextmenubutton_" + label.toLowerCase().replace(/ /g,"_"),
                data = {
                    id: id,
                    x: 0,
                    y: 0,
                    z: -3,
                    width: width,
                    height: height,
                    label: label,
                    position: "relative",
                    align: "center",
                    v_align: "top",
                    parent: this.GUI.elements["contextmenu"].id
                };
            return new ContextMenuButton(data);
        },

        createTable: function(elemData) {
            var table = new Table(elemData);
            table.width = table.cellsize * table.cols;
            table.height = table.cellsize * table.rows;

            return table;
        },

        createInventoryIcon: function(elemData) {
            return new InventoryIcon(elemData);
        }


    });

    return GUIElementFactory;
});