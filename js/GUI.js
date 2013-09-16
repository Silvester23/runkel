/*
 * Class to create and manage GUI elements
 */

define(['ImgButton','Screen',
    '../GUIData/GUIData'], function (ImgButton,Screen) {
    var GUI = Class.extend({
        init: function () {
            this.buttons = {};
            this.screens = {};
            this.elements = {};
            this.createGUIElements();
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
                }
            });
        },

        click: function(elemId, x, y) {

            if(this.elements[elemId]) {
                this.elements[elemId].click(x, y);
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
            }
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
        }
    });
    return GUI;
});