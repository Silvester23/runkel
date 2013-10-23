define(['Renderer','Player','Pathfinder','Updater','Drone','Map','Character','GUI','Item','Gameclient','Avatar', 'Entity',
    '../../shared/Types'], function(Renderer,Player,Pathfinder,Updater,Drone,Map,Character,GUI,Item,Gameclient,Avatar, Entity) {
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

            // Create Renderer and updater
            this.renderer = new Renderer(this);
            this.updater = new Updater(this);

            this.GUI = new GUI();

            // Create Pathfinder
            this.pathfinder = new Pathfinder();

            this.currentTime = new Date().getTime();


            this.initEntityGrid();

            this.dragElement = null;
            this.mouse = {x: 0, y: 0};



            this.connect();
        },

        connect: function() {
            // Create gameclient and set event callbacks

            var self = this;
            this.client = new Gameclient(this);

            this.client.onWelcome(function(id,x,y) {
                self.player = new Player(id,x,y);
                self.initPlayer(id);
                self.addEntity(self.player);
            })

            this.client.onSpawnCharacter(function(id,x,y) {
                if(!self.getEntityById(id)) {
                    var a = new Avatar(id,x,y);

                    self.initCharacter(a);
                    self.addEntity(a);
                } else {
                    console.log("Character already exists.");
                }
            })

            this.client.onSpawnItem(function(id,x,y) {
                if(!self.getEntityById(id)) {
                    var i = new Item(id,x,y);
                    var colors = ["blue","green","red","yellow"];
                    var color = colors[_.random(colors.length-1)];
                    i.setSprite("lilly");
                    i.setAnimation("idle",50);

                    i.sprite.image.src = "img/lilly_" + color + ".png";
                    self.addEntity(i);
                    self.registerEntityPosition(i);
                } else {
                    console.log("Item already exists.");
                }
            })

            this.client.onDespawn(function(id) {
                var entity = self.getEntityById(id);
                if(entity) {
                    console.log("Received despawn request on entity ID " + id);
                    self.removeEntity(entity);
                } else {
                    console.log("Invalid despawn request on entity ID " + id);
                }
            })

            this.client.onEntityMove(function(id, x, y) {
                var entity = self.getEntityById(id);
                if(entity) {
                    entity.walkTo(x,y);
                }
            });

            this.client.connect();

            this.start();
        },

        updateMaxTiles: function() {
            this.maxTileX = (this.app.viewport.width / _TILESIZE) - 1;
            this.maxTileY = (this.app.viewport.height / _TILESIZE) - 1;
        },


        initCharacter: function(character) {
            var self = this;
            if(character instanceof Character) {
                this.registerEntityPosition(character);

                character.onStep(function() {
                    self.registerEntityPosition(character);
                });

                character.onBeforeStep(function() {
                    self.unregisterEntityPosition(character);
                });

                character.onRequestPathTo(function(src,dest) {
                    return self.pathfinder.findPath(src, dest);
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
                            console.log("picking up " + entity.id);
                            self.unregisterEntityPosition(entity);
                            self.removeEntity(entity);
                            self.GUI.createInventoryIcons(self.player.inventory);
                            self.client.sendPickup(entity);
                        } else {
                            console.log("could not pick up " + entity.id);
                        }
                    }
                });
            });


            this.registerEntityPosition(this.player);

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
                this.addToEntityGrid(entity,entity.tileX,entity.tileY);
            }
        },

        unregisterEntityPosition: function(entity) {
            if(entity) {
                this.removeFromEntityGrid(entity,entity.tileX,entity.tileY);
            }
        },

        addToEntityGrid: function(entity, x, y) {
            try {
                this.entityGrid[y][x][entity.id] = entity;
            } catch(e) {
                console.log(x,y,entity);
                throw(e)
            }
        },

        removeFromEntityGrid: function(entity, x, y) {
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
            this.entities[entity.id] = entity;
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
                return true;
            } else {
                return false;
            }
        },

        click: function() {
            if(this.dragging()) {
                if(this.dragElement.release) {
                    this.dragElement.release();
                }
                this.dragElement = null;
                return;
            }
            var x = this.mouse.x,
                y = this.mouse.y;

            var guiElem = this.GUI.findElement(x,y);
            if(guiElem) {
                this.GUI.click(guiElem.id, x, y);
            } else if(this.app.isInBounds(x,y)) {

                var pos = this.getAbsoluteMouseGridPosition();
                if(!_.isEqual(pos,this.player.getGridPosition())) {
                    console.log(pos.x, pos.y);
                    var entity = this.getEntityAt(pos.x, pos.y),
                        walkTo = false;


                    if(entity) {
                        console.log("clicked " + entity.id);
                        if(entity instanceof Character) {
                            console.log("Don't walk onto other characters! That's just rude.");
                            walkTo = false;
                        } else if(entity instanceof Item) {
                            walkTo = true;
                            /*
                            this.client.sendMove(this.player.id,pos.x,pos.y);
                            this.player.walkTo(pos.x, pos.y);
                            */

                        }
                    } else {
                        walkTo = true;
                        //this.player.setGridPosition(pos.x,pos.y,true);
                    }
                    if(walkTo) {
                        this.client.sendMove(this.player.id,pos.x,pos.y);
                        this.player.walkTo(pos.x,pos.y);
                    }


                } else {
                    console.info("Clicked self.");
                }

            }
        },

        getAbsoluteMouseGridPosition: function() {
            var relPos = this.getRelativeMouseGridPosition(),
                x = this.player.tileX + (relPos.x-this.app.centerTiles.x),
                y = this.player.tileY + (relPos.y-this.app.centerTiles.y);

            x = x < 0 ? 0 : x;
            y = y < 0 ? 0 : y;

            x = x < this.map.width ? x : this.map.width-1;
            y = y < this.map.height ? y : this.map.height-1;

            return {x: x, y: y};
        },

        getRelativeMouseGridPosition: function() {
            var tileX = Math.floor(this.mouse.x / _TILESIZE),
                tileY = Math.floor(this.mouse.y / _TILESIZE);
            return {x: tileX, y: tileY};
        },

        rightclick: function() {
            var x = this.mouse.x,
                y = this.mouse.y;
            var guiElem = this.GUI.findElement(x,y);
            if(guiElem) {
                // Do nothing
            } else {
                // Debug function
                var pos = this.getAbsoluteMouseGridPosition(),
                    entities = this.getEntitiesAt(pos.x,pos.y);


                console.log(entities);
            }
            return false;
        },

        hover: function() {
            var x = this.mouse.x,
                y = this.mouse.y;

            if(!this.dragging()) {

                if(!this.GUI.findElement(x,y) && this.app.isInBounds(x,y)) {
                    var pos = this.getRelativeMouseGridPosition();
                    this.curTileX = pos.x;
                    this.curTileY = pos.y;
                }
            } else {
                this.dragElement.drag(x,y);
            }

        },

        dragging: function() {
            return this.dragElement != null;
        },

        start: function() {
            this.started = true;

            this.tick();

            console.info("Game started");
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
