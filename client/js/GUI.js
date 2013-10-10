/*
 * Class to create and manage GUI elements
 */

define(['ImgButton','Screen','InventoryIcon','Table',
    '../GUIData/GUIData'], function (ImgButton,Screen,InventoryIcon,Table) {
    var GUI = Class.extend({
        init: function () {
            this.buttons = {};
            this.tables = {};
            this.screens = {};
            this.icons = {};
            this.elements = {};
            this.createGUIElements();
            this.alignAllElements();
        },

        alignAllElements: function() {
            var self = this;
            _.each(this.elements, function(element) {
                self.alignElement(element);
            });
        },

        createGUIElements: function() {
            // Create all GUI elements that are specified in GUIData.js
            var self = this;
            _.each(GUIElements, function(elemData) {
                switch(elemData.type) {
                    case Types.GUIElements.IMGBUTTON:
                        self.createImgButton(elemData);
                        break;
                    case Types.GUIElements.SCREEN:
                        self.createScreen(elemData);
                        break;
                    case Types.GUIElements.TABLE:
                        self.createTable(elemData);
                        break;
                }
            });
        },

        click: function(elemId, x, y) {
            try {
                if(this.elements[elemId]) {
                    this.elements[elemId].click(x, y);
                }
            }
            catch(e) {
                console.error("Error trying to click elemId " + elemId);
                throw(e);
            }
        },

        findElement: function(x,y) {
            // Find highest visible element at given position, if none return false
            var candidates = _.filter(this.elements, function(elem) {
                return elem.visible && elem.wasClicked(x,y);
            });

            if(_.size(candidates) == 0) {
                return false;
            }
            else if(_.size(candidates) == 1) {
                return candidates[_.keys(candidates)[0]];
            }
            else {
                var sorted = _.sortBy(candidates,function(candidate){return candidate.z});
                return sorted[0];
            }
        },

        activate: function(elemId) {
            if(this.elements[elemId]) {
                this.elements[elemId].activate();
            }
        },

        deactivate: function(elemId) {
            if(this.elements[elemId]) {
                this.elements[elemId].deactivate();
            }
        },

        getVisibleElements: function() {
            return _.filter(this.elements,function(elem){
                return elem.visible == true;
            });
        },

        applyToSameTier: function(elemId, callback) {
            // Apply callback function to all elements of the same tier as given element, except the element itself
            if(this.elements[elemId] && this.elements[elemId].tier) {
                var tier = this.elements[elemId].tier;
                var sameTier = _.filter(this.elements, function(elem){ return (elem.tier == tier && elem.id != elemId) });
                _.each(sameTier, function(elem) {
                    callback(elem);
                });
            }
        },

        deactivateSameTier: function(elemId) {
            // Deactivates all other elements of the same tier
            if(this.elements[elemId]) {
                this.applyToSameTier(elemId, function(elem) {elem.deactivate()});
            }
        },

        hideSameTier: function(elemId) {
            // Deactivates all other elements of the same tier
            if(this.elements[elemId]) {
                this.applyToSameTier(elemId, function(elem) {elem.hide()});
            }
        },

        show: function(elemId) {
            if(this.elements[elemId]) {
                this.elements[elemId].show();
            }
        },

        hide: function(elemId) {
            if(this.elements[elemId]) {
                this.elements[elemId].hide();
                this.hideChildren(elemId);
            }
        },

        hideChildren: function(elemId) {
            _.each(this.elements, function(element) {
                if(element.parent == elemId) {
                    console.log("hiding " + element.id);
                    element.hide();
                }
            });
        },

        toggleScreen: function(elemId) {
            elem = this.elements[elemId];
            if(this.elements[elemId]) {
                if(elem.visible) {
                    this.hide(elemId);
                } else {
                    // Hide all other other Screens of same tier before showing new screen
                    this.hideSameTier(elemId);
                    this.show(elemId);
                }
            }
        },

        createImgButton: function(elemData) {
            var btn = new ImgButton(elemData);
            var self = this;

            switch(elemData.action) {
                case Types.Actions.TOGGLE_SCREEN:
                    var screenId = elemData.id.replace(/button/,"screen");
                    btn.onClick(function() {
                        self.toggleScreen(screenId);
                        // ImgButtons should always deactivate all other buttons of the same tier
                        self.deactivateSameTier(this.id);
                    });
                    break;
            }

            // Register element in arrays
            this.buttons[elemData.id] = btn;
            this.elements[elemData.id] = btn;
        },

        createScreen: function(elemData) {
            var screen = new Screen(elemData);

            // Register element in arrays
            this.screens[elemData.id] = screen;
            this.elements[elemData.id] = screen;
        },

        createTable: function(elemData) {
            var table = new Table(elemData);
            table.width = table.cellsize * table.cols;
            table.height = table.cellsize * table.rows;

            this.tables[elemData.id] = table;
            this.elements[elemData.id] = table;
        },

        createInventoryIcons: function(inventory) {
            var inv = inventory,
                self = this,
                table = this.elements["table_inventory"];

            _.each(inv, function(item) {
                if(typeof item !== "undefined" && !_.any(self.icons, function(icon) {
                    return this.entity === item;
                })) {

                    var data = {};
                    data["id"] = "icon_" + item.id;
                    data["allowDrag"] = true;
                    data["entity"] = item;
                    data["sprite"] = item.getSprite();
                    data["width"] = item.sprite.width;
                    data["height"] = item.sprite.height;
                    data["z"] = -2;
                    data["cellIndex"] = _.indexOf(inv,item);

                    var icon = new InventoryIcon(data),
                        pos = table.getCellPosition(icon);
                    icon.setPosition(pos["x"],pos["y"]);

                    icon.onRelease(function() {
                        var index = table.getCellIndex(this);
                        if(index != this.cellIndex && index != -1) {
                            if(typeof inv[index] !== "undefined" && inv[index] !== this.entity) {
                                /* There was already a different icon at the index in the table.
                                 * First, change its cellIndex and then move it to the correct position.
                                 * Then, change the cellIndex and position of the released icon.
                                 * Finally, swap the corresponding items in the inventory array.
                                 */

                                try {
                                    iconId = "icon_" + inv[index].id;
                                    self.icons[iconId].cellIndex = this.cellIndex;
                                    var pos = table.getCellPosition(self.icons[iconId]);


                                    self.icons[iconId].setPosition(pos["x"],pos["y"]);
                                } catch(e) {
                                    console.error("Error: could not find " + iconId + " in ",self.icons);
                                }

                                inv[this.cellIndex] = inv[index];
                                this.cellIndex = index;
                                inv[index] = this.entity;

                            } else {
                                // The icon has moved to an empty cellindex. Apply change.
                                delete inv[this.cellIndex];
                                inv[index] = this.entity;
                                this.cellIndex = index;
                            }
                        }
                        pos = table.getCellPosition(this);
                        this.setPosition(pos["x"],pos["y"]);
                    });

                    self.icons[icon.id] = icon;
                    self.elements[icon.id] = icon;

                }
            });

        },

        alignElement: function(element) {
            var child = element,
                parent = this.elements[element.parent];
            if(parent && child.position == "relative") {
                if(child.align) {
                    switch(child.align) {
                        case "center":
                            child.x = parent.x + (parent.width - child.width)/2;
                            break;
                        case "left":
                            child.x = parent.x;
                            break;
                        case "right":
                            child.x = parent.x + (parent.width - child.width);
                            break;
                    }
                }
                if(child.v_align) {
                    switch(child.v_align) {
                        case "center":
                            child.y = parent.y + (parent.height - child.height)/2;
                            break;
                        case "top":
                            child.y = parent.y;
                            break;
                        case "bottom":
                            child.y = parent.y + (parent.height - child.height);
                            break;

                    }
                }
            }
        }
    });
    return GUI;
});