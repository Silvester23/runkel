define(['Renderer','Player','Pathfinder','Updater','Map','Character','GUI','Item','Gameclient','Avatar', 'Entity',
    'Boots','EntityFactory',
    '../../shared/Types'], function(Renderer,Player,Pathfinder,Updater,Map,Character,GUI,Item,Gameclient,Avatar, Entity,
                                    Boots, EntityFactory) {
    var Game = Class.extend({
        init: function(app) {
            var self = this;
            this.app = app;

            // Viewport boundaries
            this.curTileX = -1;
            this.curTileY = -1;
            this.updateMaxTiles();

            // Entity handling
            this.entities = {};
            this.entityGrid = [];

            this.map = new Map();
            this.renderer = new Renderer(this);
            this.updater = new Updater(this);
            this.pathfinder = new Pathfinder();
            this.entityFactory = new EntityFactory();

            this.currentTime = new Date().getTime();

            this.mouse = {x: 0, y: 0};

            this.GUI = new GUI(this.mouse);

            this.GUI.setApp(this.app);
            this.GUI.onReleaseIcon(function(icon) {
                var entity = icon.entity;
                if(entity.drop()) {
                    self.GUI.destroyInventoryIcon(icon);
                }
            });

            this.dragElement = null;
            this.hoverEntity = null;


        },

        connect: function() {
            // Create gameclient and set event callbacks

            var self = this;
            this.client = new Gameclient(this);

            this.client.onWelcome(function(id,x,y,name) {
                self.player = self.entityFactory.createEntity(Types.Entities.Characters.PLAYER,id,x,y,name);
                self.initPlayer(id);
                self.addEntity(self.player);

            });

            this.client.onSpawnCharacter(function(id,type,x,y,name,inventory,equipped) {
                if(!self.getEntityById(id)) {
                    var c = self.entityFactory.createEntity(type,id,x,y,name);
                    self.initCharacter(c);

                    _.each(inventory, function(itemData) {
                        var id = itemData[0],
                            type = itemData[1],
                            x = itemData[2],
                            y = itemData[3],
                            name = itemData[4];

                        var item = self.entityFactory.createEntity(type,id,x,y,name);
                        c.pickUp(item);
                    });

                    _.each(equipped, function(itemId) {

                        var item = _.find(c.inventory, function(i) {
                            return i.id == itemId;
                        });


                        c.equip(item);
                    });

                    self.addEntity(c);
                } else {
                    console.log("Character already exists.");
                }
            });

            this.client.onSpawnItem(function(id,type,x,y,name) {
                if(!self.getEntityById(id)) {
                    var item = self.entityFactory.createEntity(type,id,x,y,name);


                    self.addEntity(item);

                } else {
                    console.log("Item already exists.");
                }
            });

            this.client.onDespawn(function(id) {
                var entity = self.getEntityById(id);
                if(entity) {
                    console.log("Received despawn request on entity ID " + id);
                    self.removeEntity(entity);
                } else {
                    console.log("Invalid despawn request on entity ID " + id);
                }
            });

            this.client.onEntityMove(function(id, x, y) {
                var entity = self.getEntityById(id);
                if(entity) {
                    entity.walkTo(x,y);
                }
            });

            this.client.onEquip( function(charId, itemId) {
                var c = self.getEntityById(charId);
                if(c) {
                    var item = c.getInventoryItemById(itemId);
                    if(item) {
                        c.equip(item);
                    }
                }
            });

            this.client.onPickup( function(charId, itemId) {
                var c = self.getEntityById(charId);
                if(c) {
                    var item = self.getEntityById(itemId);
                    if(item) {
                        c.pickUp(item);
                    }
                    self.removeEntity(item);
                }
            });

            this.client.onDrop( function(charId, itemId, x, y) {
                var c = self.getEntityById(charId);
                if(c) {
                    var item = c.getInventoryItemById(itemId);
                    item.drop();
                }
            });

            this.client.connect();

        },

        updateMaxTiles: function() {
            this.maxTileX = (this.app.viewport.width / _TILESIZE) - 1;
            this.maxTileY = (this.app.viewport.height / _TILESIZE) - 1;
        },


        initCharacter: function(character) {
            var self = this;
            if(character instanceof Character) {

                character.onStep(function() {
                    self.registerEntityPosition(character);
                });

                character.onBeforeStep(function() {
                    self.unregisterEntityPosition(character);
                });

                character.onRequestPathTo(function(src,dest) {
                    return self.pathfinder.findPath(src, dest);
                });

                character.onDropItem( function(item) {
                    var pos = character.getGridPosition();
                    item.setGridPosition(pos.x,pos.y);
                    self.addEntity(item);

                    self.client.sendDrop(item);
                });
            }
        },

        initPlayer: function() {
            var self = this;

            this.GUI.createInventoryIcons(self.player.inventory);
            this.initCharacter(this.player);

            this.player.onStopPathing(function() {
                _.each(self.getEntitiesAt(this.tileX,this.tileY), function(entity) {
                    if(entity instanceof Item) {
                        if(self.player.pickUp(entity)) {
                            self.unregisterEntityPosition(entity);
                            self.removeEntity(entity);
                            self.GUI.createInventoryIcons(self.player.inventory);
                            self.client.sendPickup(entity);
                            if(self.player.equip(entity)) {
                                self.client.sendEquip(entity);
                            }
                        } else {
                            console.log("could not pick up " + entity.id);
                        }
                    }
                });
            });

        },

        initEntityGrid: function() {
            var row, col;
            for(row = 0; row < this.map.height; row++) {
                this.entityGrid[row] = [];
                for(col = 0; col < this.map.width; col++) {
                    this.entityGrid[row][col] = {};
                }
            }
            console.info("Entity grid initialized");
        },

        registerEntityPosition: function(entity) {
            if(entity) {
                this.addToEntityGrid(entity);
            }
        },

        unregisterEntityPosition: function(entity) {
            if(entity) {
                this.removeFromEntityGrid(entity);
            }
        },

        addToEntityGrid: function(entity) {
            var x = entity.tileX,
                y = entity.tileY;
            try {
                this.entityGrid[y][x][entity.id] = entity;
            } catch(e) {
                console.log(x,y,entity);
                throw(e)
            }
        },

        removeFromEntityGrid: function(entity) {
            var x = entity.tileX,
                y = entity.tileY;
            delete this.entityGrid[y][x][entity.id];
        },

        forEachEntity: function(callback) {
            _.each(this.entities, function(entity) {
                callback(entity);
            });
        },

        forEachVisibleEntity: function(callback) {
            var bounds = this.app.getVisibleTileBounds();
            var visibleEntities = _.filter(this.entities, function(entity) {
                return entity.visible &&
                       entity.tileX >= bounds.minX &&
                       entity.tileX < bounds.maxX &&
                       entity.tileY >= bounds.minY &&
                       entity.tileY < bounds.maxY;
            });
            _.each(visibleEntities, function(entity) {
                callback(entity);
            });
        },

        setRenderer: function(renderer) {
            this.renderer = renderer;
        },

        addEntity: function(entity) {
            if(!this.entities[entity.id]) {
                this.entities[entity.id] = entity;
                this.registerEntityPosition(entity);
            } else {
                console.log("Tried to add existing entity!");
            }
        },

        removeEntity: function(entity) {
            if(this.entities[entity.id]) {
                this.unregisterEntityPosition(entity);
                delete this.entities[entity.id];
            } else {
                console.log("Could not remove entity id " + id);
            }
        },

        getEntityAt: function(x,y) {
            var entities = this.entityGrid[y][x],
                entity = null;
            if(_.size(entities) > 0) {
                entity = entities[_.keys(entities)[0]];
            }

            return entity;
        },

        getEntityById: function(id) {
            var entity = this.entities[id];
            if(entity) {
                return entity;
            }
        },

        getEntitiesAt: function(x,y) {
            return this.entityGrid[y][x];
        },

        releaseElement: function() {
            if(this.dragElement.release) {
                this.dragElement.release();
            }
            this.dragElement = null;
        },

        mousedown: function() {
            var self = this, guiElem,
                x = this.mouse.x,
                y = this.mouse.y;

            guiElem = this.GUI.findElement(x, y);
            if(guiElem && guiElem.allowDrag) {
                this.dragElement = guiElem;
                guiElem.dragStartX = x;
                guiElem.dragStartY = y;
                guiElem.dragOriginX = guiElem.x;
                guiElem.dragOriginY = guiElem.y;
                guiElem.drag(x,y);

                this.GUI.hideContextMenu();
                return true;
            } else {
                return false;
            }
        },

        rightclick: function() {
            // TEST
            console.log(this.app.getVisibleTileBounds());


            if(this.dragging()) {
                this.releaseElement();
            }
            var x = this.mouse.x,
                y = this.mouse.y;

            var guiElem = this.GUI.findElement(x,y);
            if(guiElem) {
                this.GUI.showContextMenu(guiElem);
            } else if(this.app.isInViewport(x,y)) {

                var pos = this.getAbsoluteMouseGridPosition(),
                    entities = this.getEntitiesAt(pos.x,pos.y);
                if(_.size(entities) > 0) {
                    this.GUI.showContextMenu(_.values(entities)[0]);
                } else {
                    // Get position with potentially invalid tile indices
                    pos = this.getAbsoluteMouseGridPosition(true);
                    if(this.map.isInBounds(pos.x,pos.y)) {
                        // Click was on empty ground; send true as argument to GUI.
                        this.GUI.showContextMenu(true);
                    } else {
                        this.GUI.hideContextMenu();
                    }
                }
            } else {
                this.GUI.hideContextMenu();
            }


            return false;
        },

        click: function() {
            if(this.dragging()) {
                this.releaseElement();
                return;
            }
            var x = this.mouse.x,
                y = this.mouse.y;

            var guiElem = this.GUI.findElement(x,y);
            if(guiElem) {
                this.GUI.click(guiElem.id, x, y);
            } else if(this.app.isInViewport(x,y)) {

                var pos = this.getAbsoluteMouseGridPosition();
                if(!_.isEqual(pos,this.player.getGridPosition())) {
                    var entity = this.getEntityAt(pos.x, pos.y),
                        walkTo = false;

                    if(entity) {
                        console.log("clicked " + entity.id);
                        if(entity instanceof Character) {
                            console.log("Don't walk onto other characters! That's just rude.");
                            walkTo = false;
                        } else if(entity instanceof Item) {
                            walkTo = true;

                        }
                    } else {
                        walkTo = true;
                        //this.player.setGridPosition(pos.x,pos.y,true);
                    }
                    if(walkTo) {
                        this.client.sendMove(pos.x,pos.y);
                        this.player.walkTo(pos.x,pos.y);
                    }


                } else {
                    console.info("Clicked self.");
                }

            }
            this.GUI.hideContextMenu();
        },

        hover: function() {
            var oldEntity = this.hoverEntity;
            if(this.player) {
                var x = this.mouse.x,
                    y = this.mouse.y;

                if(!this.dragging()) {
                    var elem = this.GUI.findElement(x,y);
                    if((!elem) && this.app.isInViewport(x,y)) {
                        var relPos = this.getRelativeMouseGridPosition();
                        var absPos = this.getAbsoluteMouseGridPosition();
                        if(relPos.x != this.curTileX || relPos.y != this.curTileY) {
                            this.curTileX = relPos.x;
                            this.curTileY = relPos.y;
                        }

                        if(!this.hoverEntity || absPos.x != this.hoverEntity.tileX || absPos.y != this.hoverEntity.tileY) {
                            this.hoverEntity = this.getEntityAt(absPos.x,absPos.y);
                        }

                    } else if(elem) {
                        this.curTileX = undefined;
                        this.curTileY = undefined;

                        if(_.isFunction(elem.hover)) {
                            elem.hover();
                        }
                        this.hoverEntity = elem;

                    } else {
                        this.curTileX = undefined;
                        this.curTileY = undefined;
                    }
                } else if(this.app.isInViewport(x,y)) {
                    this.dragElement.drag(x,y);
                } else {
                    this.releaseElement();
                }
            }


            // Check if hoverEntity has changed and if possible, blur the old one
            if(oldEntity && this.hoverEntity !== oldEntity && _.isFunction(oldEntity.blur)) {
                oldEntity.blur()
            }
        },

        getAbsoluteMouseGridPosition: function(allowOutOfBounds) {

            var relPos = this.getRelativeMouseGridPosition(),
                x = this.player.tileX + (relPos.x-this.app.centerTiles.x),
                y = this.player.tileY + (relPos.y-this.app.centerTiles.y);


            if(!allowOutOfBounds) {
                x = x < 0 ? 0 : x;
                y = y < 0 ? 0 : y;

                x = x < this.map.width ? x : this.map.width-1;
                y = y < this.map.height ? y : this.map.height-1;
            }

            return {x: x, y: y};
        },

        getRelativeMouseGridPosition: function() {
            var tileX = Math.floor(this.mouse.x / _TILESIZE),
                tileY = Math.floor(this.mouse.y / _TILESIZE);
            return {x: tileX, y: tileY};
        },



        dragging: function() {
            return this.dragElement != null;
        },

        start: function() {
            var self = this;
            if(!this.started) {
                var wait = setInterval(function() {
                    if(self.map.isLoaded) {
                        self.initEntityGrid();
                        self.connect();
                        self.started = true;
                        self.tick();
                        console.info("Game started");
                        clearInterval(wait);
                    }
                }, 100)
            }
        },

        stop: function() {
            var self = this;


            console.log("Game stopped.");
            this.isStopped = true;
        },

        tick: function() {
            // Loop function
            if(this.started) {
                this.currentTime = new Date().getTime();

                this.updater.update();
                this.renderer.renderFrame();

                // Loop if game is running
                if(!this.isStopped) {
                    requestAnimFrame(this.tick.bind(this));
                }
            }
        }

    });
return Game;
});
