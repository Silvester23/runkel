/*
 * Class to create and manage GUI elements
 */
//'ImgButton','Screen','InventoryIcon','Table','GUIElement','Entity','ContextMenu','ContextMenuButton',
// ImgButton,Screen,InventoryIcon,Table,GUIElement,Entity,ContextMenu,ContextMenuButton,
define(['GUIElementFactory', 'GUIElement','Entity','ContextMenuButton',
    '../GUIData/GUIData'], function (GUIElementFactory, GUIElement, Entity, ContextMenuButton) {
    var GUI = Class.extend({
        init: function (mouse) {
            this.mouse = mouse;
            //this.buttons = {};
            this.tables = {};
            this.screens = {};
            this.icons = {};
            this.elements = {};
            this.factory = new GUIElementFactory(this);
            this.createGUIElements();

            this.alignAllElements();
        },

        alignAllElements: function() {
            var self = this;
            _.each(this.elements, function(element) {
                self.alignElement(element);
            });
        },

        alignElement: function(element) {

            if(element.position == "relative") {
                var child = element,
                    parent = this.elements[element.parent];

                if(parent) {
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

            else if(element.position == "absolute") {
                switch(element.align) {
                    case "center":
                        element.x = (canvas.width - element.width) / 2;
                        break;
                    case "left":
                        element.x = 0;
                        break;
                    case "right":
                        element.x = canvas.width - element.width;
                }

                switch(element.v_align) {
                    case "center":
                        element.y = (canvas.height - element.height) / 2;
                        break;
                    case "bottom":
                        element.y = canvas.height - element.height;
                        break;
                    case "top":
                        element.y = 0;
                }
            }

            if(element.offset) {
                element.x += element.offset.x;
                element.y += element.offset.y;
            }
        },

        createGUIElements: function() {
            // Create all GUI elements that are specified in GUIData.js
            var self = this;
            _.each(GUIElements, function(elemData) {
                self.elements[elemData.id] = self.factory.createElement(elemData);

                if(elemData.type == Types.GUIElements.IMGBUTTON) {
                    var btn = self.elements[elemData.id];
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
                } else if(elemData.type == Types.GUIElements.CONTEXTMENU) {
                    var contextMenu = self.elements[elemData.id];
                    contextMenu.onShow(function() {
                        this.x = self.mouse.x;
                        this.y = self.mouse.y;
                    });
                }

            });

            // Create Dynamic Elements

            _.each(this.elements["contextmenu"].labels, function(label) {
                var button = self.factory.createContextMenuButton(label);
                self.elements["contextmenu"].addButton(button);
                //self.buttons[button.id] = button;
                self.elements[button.id] = button;
            })

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
                    data["type"] = Types.GUIElements.INVENTORYICON;
                    data["id"] = "icon_" + item.id;
                    data["allowDrag"] = true;
                    data["entity"] = item;
                    data["sprite"] = item.getSprite();
                    data["width"] = item.sprite.width;
                    data["height"] = item.sprite.height;
                    data["z"] = -2;
                    data["cellIndex"] = _.indexOf(inv,item);

                    var icon = self.factory.createElement(data),
                        pos = table.getCellPosition(icon);
                    icon.setPosition(pos["x"],pos["y"]);

                    icon.onRelease(function() {
                        var index = table.getCellIndex(this);
                        var elem = self.findElement(icon.x,icon.y,icon);
                        if(elem) {
                            // Icon was released in table or on another GUI element

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
                        } else {
                            // Icon was released outside of GUI
                            if(self.release_icon_callback) {
                                self.release_icon_callback(icon);
                            }
                        }
                    });

                    self.icons[icon.id] = icon;
                    self.elements[icon.id] = icon;

                }
            });

        },

        click: function(elemId, x, y) {
            console.log(elemId);
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

        findElement: function(x,y, ignore) {
            /* Find highest visible element at given position, if none return false.
               If ignore is specified, ignore that element
             */
            var candidates = _.filter(this.elements, function(elem) {
                return elem.visible && elem.wasClicked(x,y) && !_.isEqual(elem,ignore);
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


        deactivateSameTier: function(elemId) {
            // Deactivates all other elements of the same tier
            if(this.elements[elemId]) {
                this.applyToSameTier(elemId, function(elem) {elem.deactivate()});
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

        hideSameTier: function(elemId) {
            // Hides all other elements of the same tier
            if(this.elements[elemId]) {
                this.applyToSameTier(elemId, function(elem) {elem.hide()});
            }
        },

        showContextMenu: function(target) {
            var self = this,
                show = false,
                cM = this.elements["contextmenu"];

            cM.resetButtons();

            // Delete all obsolete context menu buttons
            _.each(this.elements, function(element) {
                if(element instanceof ContextMenuButton && !_.contains(cM.buttons, element)) {
                    delete self.elements[element.id];
                }
            });

            if(_.isFunction(target.getContextInformation)) {
                console.debug("Showing context on valid target");
                options = target.getContextInformation();
                _.each(options, function(o) {
                    var button = self.factory.createContextMenuButton(o.label);
                    if(o["action"]) {
                        button.onClick(o["action"]);
                    }
                    cM.addButton(button,true);
                    if(!self.elements[button.id]) {
                        self.elements[button.id] = button;
                    }
                });

                show = true;
            } else if(target === true) {
                console.debug("Showing context on Ground");
                show = true;
            } else {
                this.hideContextMenu();
                console.debug("Invalid target for context menu.");
            }

            if(show) {
                cM.refresh();
                this.show("contextmenu");
                _.each(cM.buttons, function(button) {
                    self.alignElement(button);
                });
            }
        },

        hideContextMenu: function() {
            this.hide("contextmenu");
            _.each(this.elements["contextmenu"].buttons, function(button) {
                button.blur();
            });
        },

        show: function(elemId) {
            if(this.elements[elemId]) {
                this.elements[elemId].show();
                this.showChildren(elemId);
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
                    element.hide();
                }
            });
        },

        showChildren: function(elemId) {
            _.each(this.elements, function(element) {
                if(element.parent == elemId) {
                    element.show();
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



        destroyInventoryIcon: function(icon) {
            if(icon.id) {
                delete this.icons[icon.id];
                delete this.elements[icon.id];
            } else {
                console.log("destroyInventoryIcon: invalid icon specified.");
            }
        },

        onReleaseIcon: function(callback) {
            this.release_icon_callback = callback;
        },

        setApp: function(app) {
            this.app = app;
        }


    });
    return GUI;
});