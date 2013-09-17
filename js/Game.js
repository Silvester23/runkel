define(['Renderer','Player','Pathfinder','Updater','Drone','Map','Character','GUI','Item',
    'Types'], function(Renderer,Player,Pathfinder,Updater,Drone,Map,Character,GUI,Item) {
    var Game = Class.extend({
        init: function(app) {
            var self = this;
            this.app = app;

            // Viewport boundaries
            this.curTileX = -1;
            this.curTileY = -1;
            this.updateMaxTiles();

            // Entity handling
            this.entities = [];
            this.entityGrid = [];

            this.map = new Map();


            // Create Renderer and updater
            this.renderer = new Renderer(this);
            this.updater = new Updater(this);

            // Create Player
            this.player = new Player(this);
            this.initPlayer();


            this.GUI = new GUI();
            this.GUI.createInventoryIcons(this.player.inventory);

            // Create Pathfinder
            this.pathfinder = new Pathfinder();

            this.currentTime = new Date().getTime();


            this.initEntityGrid();

            // TESTS
            drone = new Drone();
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
            this.addEntity(lilly2);
            this.registerEntityPosition(lilly2);

            lilly4 = new Item("Schwertlilie3",5,3);
            lilly4.setSprite("lilly");
            lilly4.setAnimation("idle",50);
            this.addEntity(lilly4);
            this.registerEntityPosition(lilly4);

            lilly3 = new Item("Schwertlilie4",4,3);
            lilly3.setSprite("lilly");
            lilly3.setAnimation("idle",50);
            this.addEntity(lilly3);
            this.registerEntityPosition(lilly3);

            this.initCharacters();
            this.dragElement = null;
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

        initPlayer: function() {
            var self = this;

            this.player.avatar.onStopPathing(function() {
                _.each(self.getEntitiesAt(this.tileX,this.tileY), function(entity) {
                    if(entity instanceof Item) {
                        if(self.player.pickUp(entity)) {
                            self.unregisterEntityPosition(entity);
                            self.removeEntity(entity);
                            self.GUI.createInventoryIcons(self.player.inventory);
                            console.log("picked up " + entity.id);
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
            this.entities.push(entity);
        },

        removeEntity: function(entity) {
            this.entities = deleteIndex(this.entities,this.entities.indexOf(entity));
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

            guiElem = this.GUI.findElement(x,y)
            if(guiElem && guiElem.allowDrag) {
                this.dragElement = guiElem;
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
            // Set all stop-variables to false
            this.isStopped = false;
            this.stopping = false;


            this.tick();

            console.log("Game started");
        },

        stop: function() {
            var self = this;


            console.log("Game stopped.");
            this.isStopped = true;
        },

        reset: function() {
            this.hideEndScreen();

            // Clear entities
            this.entities.length = 0;

            this.player.reset();
            this.start();
        },

        tick: function() {
            // Loop function
            this.currentTime = new Date().getTime();

            this.updater.update();
            this.renderer.renderFrame();

            // Loop if game is running
            if(!this.isStopped) {
                requestAnimFrame(this.tick.bind(this));
            }
        }

    });
return Game;
});
