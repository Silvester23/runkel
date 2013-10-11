define(['Renderer','Player','Pathfinder','Updater','Drone','Map','Character','GUI','Item','Gameclient','Avatar',
    '../../shared/Types'], function(Renderer,Player,Pathfinder,Updater,Drone,Map,Character,GUI,Item,Gameclient,Avatar) {
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

            this.initCharacters();
            this.dragElement = null;

            this.createTestEntities();

            this.connect();
        },

        // Test and Debug function!
        createTestEntities: function() {
            var self = this;
            // TESTS
            drone = new Drone("drone");
            drone.onRequestPathTo(function(src,dest) {
                return self.pathfinder.findPath(src,dest);
            });
            this.addEntity(drone);

            lilly = new Item("Schwertlilie",12,9);
            lilly.setSprite("lilly");
            lilly.setAnimation("idle",50);
            this.addEntity(lilly);
            this.registerEntityPosition(lilly);


            lilly2 = new Item("Schwertlilie2",3,3);
            lilly2.setSprite("lilly");
            lilly2.setAnimation("idle",50);
            lilly2.sprite.image.src = "img/lilly_red.png";
            this.addEntity(lilly2);
            this.registerEntityPosition(lilly2);

            lilly4 = new Item("Schwertlilie3",5,3);
            lilly4.setSprite("lilly");
            lilly4.setAnimation("idle",50);
            lilly4.sprite.image.src = "img/lilly_yellow.png";
            this.addEntity(lilly4);
            this.registerEntityPosition(lilly4);

            lilly3 = new Item("Schwertlilie4",4,3);
            lilly3.setSprite("lilly");
            lilly3.setAnimation("idle",50);
            lilly3.sprite.image.src = "img/lilly_blue.png";
            this.addEntity(lilly3);
            this.registerEntityPosition(lilly3);
        },

        connect: function() {
            var self = this;
            this.client = new Gameclient(this);

            this.client.onWelcome(function(id) {
                self.player = new Player(id);
                self.initPlayer(id);
                self.GUI.createInventoryIcons(self.player.inventory);
                self.addEntity(self.player.avatar);
                console.log("added player and avatar");
            })

            this.client.onSpawn(function(id) {
                var a = new Avatar(id);
                self.addEntity(a);
                console.log("spawned");
            })

            this.client.onDespawn(function(data) {
                var id = data[1];
                if(self.entities[id]) {
                    console.log("Received despawn request on entity ID " + id);
                    self.removeEntity(self.entities[id]);
                } else {
                    console.log("Invalid despawn request on entity ID " + id);
                }
            })
            this.client.connect();

            this.start();
        },

        updateMaxTiles: function() {
            this.maxTileX = (this.app.viewport.width / _TILESIZE) - 1;
            this.maxTileY = (this.app.viewport.height / _TILESIZE) - 1;
        },

        initCharacters: function() {
            var self = this;
            this.forEachEntity(function(entity) {
                if(entity instanceof Character) {
                    self.registerEntityPosition(entity);
                    entity.onStep(function() {
                        self.registerEntityPosition(entity);
                    });

                    entity.onBeforeStep(function() {
                        self.unregisterEntityPosition(entity);
                    });

                    entity.onRequestPathTo(function(src,dest) {
                        return self.pathfinder.findPath(src,dest);
                    });
                }
            });
        },

        initPlayer: function(id) {
            var self = this;
            this.player.createAvatar(id);
            this.player.avatar.onStopPathing(function() {
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

            this.registerEntityPosition(this.player.avatar);
            this.player.avatar.onStep(function() {
                self.registerEntityPosition(self.player.avatar);
            });

            this.player.avatar.onBeforeStep(function() {
                self.unregisterEntityPosition(self.player.avatar);
            });

            this.player.avatar.onRequestPathTo(function(src,dest) {
                return self.pathfinder.findPath(src,dest);
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
                this.addToEntityGrid(entity,entity.tileX,entity.tileY);
            }
        },

        unregisterEntityPosition: function(entity) {
            if(entity) {
                this.removeFromEntityGrid(entity,entity.tileX,entity.tileY);
            }
        },

        addToEntityGrid: function(entity, x, y) {
            this.entityGrid[y][x][entity.id] = entity;
        },

        removeFromEntityGrid: function(entity, x, y) {
            delete this.entityGrid[y][x][entity.id];
        },

        forEachEntity: function(callback) {
            _.each(this.entities, function(entity) {
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
            delete this.entities[entity.id];
        },

        getEntityAt: function(x,y) {
            var entities = this.entityGrid[y][x],
                entity = null;
            if(_.size(entities) > 0) {
                entity = entities[_.keys(entities)[0]];
            }

            return entity;
        },

        getEntitiesAt: function(x,y) {
            return this.entityGrid[y][x];
        },

        mousedown: function(evt) {
            var self = this,
                offset = getOffset(canvas),
                x, y, guiElem;

            x = evt.clientX - offset[0];
            y = evt.clientY -  offset[1];

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

        click: function(evt) {
            // Rework getOffset(canvas) part!
            var self = this,
                offset = getOffset(canvas),
                x, y, tiles, target, type, elem;

            x = evt.clientX - offset[0];
            y = evt.clientY -  offset[1];

            var guiElem = this.GUI.findElement(x,y);
            if(guiElem) {
                this.GUI.click(guiElem.id, x, y);
            } else if(this.app.isInBounds(x,y)) {
                tiles = getTiles([x,y]);

                console.log(tiles[0],tiles[1]);
                target = this.getEntityAt(tiles[0],tiles[1]);

                if(target) {
                    console.log("clicked " + target.id);
                }

                this.player.avatar.walkTo(tiles);
            }
        },

        rightclick: function(evt) {
            // Temporary test function
            var self = this,
                offset = getOffset(canvas),
                x, y, tiles, target, type, elem;

            x = evt.clientX - offset[0];
            y = evt.clientY -  offset[1];

            var guiElem = this.GUI.findElement(x,y);
            if(guiElem) {
                // Do nothing
            } else if(this.app.isInBounds(x,y)) {
                tiles = getTiles([x,y]);

                console.log(tiles[0],tiles[1]);
                target = this.getEntityAt(tiles[0],tiles[1]);

                if(target) {
                    console.log("right clicked " + target.id);
                }

                this.entities["drone"].walkTo(tiles);
                //console.log(this.entities["drone"].walkTo);
            }
            return false;
        },

        hover: function(evt) {
            var self = this,
                offset = getOffset(canvas),
                evtX, evtY, tiles;

            evtX = evt.clientX - offset[0];
            evtY = evt.clientY -  offset[1];

            if(!this.dragging()) {
                if(!this.GUI.findElement(evtX,evtY) && this.app.isInBounds(evtX,evtY)) {
                    tiles = getTiles([evtX,evtY]);
                    this.curTileX = tiles[0];
                    this.curTileY = tiles[1];
                }
            } else {
                this.dragElement.drag(evtX,evtY);
            }

        },

        dragging: function() {
            return this.dragElement != null;
        },

        start: function() {
            this.started = true;

            this.tick();

            console.log("Game started");
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
