define(['ImgButton','Screen','Player','Character','ContextMenu'], function(ImgButton,Screen,Player,Character,ContextMenu) {
    var Renderer = Class.extend({
        init: function(game) {
            
            this.game = game;
            this.lastFrame = new Date().getTime();
            this.lastTime = this.lastFrame;
            
            // Canvas and Context
            this.canvas = canvas;
            this.context = this.canvas.getContext('2d');

            // Backbuffer and -context
            this.backBuffer = document.createElement('canvas');
            this.backBuffer.width = this.canvas.width;
            this.backBuffer.height = this.canvas.height;
            this.backBuffercontext = this.backBuffer.getContext('2d');
            
            this.frameCount = 0;
            this.realFPS = 0;

            this.center = {x: 0, y: 0};
            this.centerTiles = this.game.app.centerTiles;

            // Debug enable
            this.grid = false;
            this.debug = false;
        },

        getContext: function() {
            return this.backBuffercontext;
        },


        drawGrid: function() {
                var ctx = this.getContext(),
                w = this.game.map.width,
                h = this.game.map.height;


            ctx.save();
            ctx.globalAlpha = 0.3;

            for(var i = 0; i <= w; i++) {
                ctx.fillRect(i*_TILESIZE, 0, 1, h * _TILESIZE);
            }

            for(i = 0; i <= h; i++) {
                ctx.fillRect(0, i*_TILESIZE, w * _TILESIZE, 1);
            }


            // Debug vis
            if(this.debug) {
                ctx.save();
                ctx.fillStyle = "red";
                for(i = 0; i < h; i++) {
                    for(var j = 0; j < w; j++) {
                        if(_.size(this.game.getEntitiesAt(j,i)) > 0) {
                            ctx.fillRect(j* _TILESIZE, i * _TILESIZE, _TILESIZE, _TILESIZE);
                        }
                    }
                }
                ctx.restore();
            }


            // Some random stuff for orientation
            ctx.fillRect(9 * _TILESIZE, 4 * _TILESIZE, 3 * _TILESIZE, 2 * _TILESIZE);
            ctx.fillRect(17 * _TILESIZE, 9 * _TILESIZE, 2 * _TILESIZE, 5 * _TILESIZE);



            ctx.restore();
        },


        drawTileHover: function() {
            var ctx = this.getContext();
            if(this.game.curTileX >= 0 && this.game.curTileX <= this.game.maxTileX
                && this.game.curTileY >= 0 && this.game.curTileY <= this.game.maxTileY) {

                var x = this.game.curTileX,
                    y = this.game.curTileY;
                ctx.save();
                ctx.strokeStyle = "blue";
                ctx.strokeRect(x * _TILESIZE, y * _TILESIZE, _TILESIZE, _TILESIZE);
                ctx.restore();

            }
        },

        drawTargetIndicator: function() {
            var ctx = this.getContext();
            if(this.game.player) {
                p = this.game.player.path;
                if(p !== null) {
                    x = p[p.length-1][0];
                    y = p[p.length-1][1];
                    ctx.save();
                    ctx.strokeStyle = "red";
                    ctx.strokeRect(x * _TILESIZE, y * _TILESIZE, _TILESIZE, _TILESIZE);
                    ctx.restore();
                }
            }
        },

        drawGUI: function() {
            var self = this,
                ctx = this.getContext();

            // Draw black footer bar
            ctx.fillRect(0,this.game.app.viewport.height,this.game.app.viewport.width,this.game.app.height-this.game.app.viewport.height);

            // Draw info box
            this.drawInfoBox();


            // Draw visible GUI elements
            _.each(this.game.GUI.elements, function(elem) {
                if(elem.visible) {
                    if(elem instanceof ImgButton) {
                        self.drawImgButton(elem);
                    }
                    else if(elem instanceof Screen) {
                        self.drawScreen(elem);
                    }
                    else if(elem instanceof ContextMenu) {
                        self.drawContextMenu(elem);
                    }
                }
            });
        },

        drawInfoBox: function() {
            var ctx = this.getContext(),
                width = 150,
                height = 30,
                offset = 15;
                x = this.game.app.viewport.width - width - offset,
                y = this.game.app.viewport.height + offset;
            ctx.clearRect(x, y, width, height);

            if(this.game.hoverEntity) {
                var info = this.game.hoverEntity.getInfo ? this.game.hoverEntity.getInfo() : this.game.hoverEntity.id;
                this.drawText(info,x+offset,y+height-offset);
            }
        },

        drawContextMenu: function(menu) {
            // Very much WIP

            var self = this,
                ctx = this.getContext();
            ctx.save();

            ctx.globalAlpha = 0.3;
            ctx.fillStyle = "#FFFFFF";
            ctx.fillRect(menu.x,menu.y,menu.width,menu.height);
            ctx.fillStyle = "#000000";
            ctx.strokeRect(menu.x,menu.y,menu.width,menu.height);


            // Draw buttons
            _.each(menu.buttons, function(button) {
                if(button.active) {
                    ctx.fillStyle = "#0000FF";
                } else {
                    ctx.fillStyle = "#FF0000";
                }
                ctx.globalAlpha = 0.5;
                ctx.fillRect(button.x,button.y,button.width,button.height);
                ctx.save();
                ctx.fillStyle = "#000000";
                ctx.strokeRect(button.x,button.y,button.width,button.height);
                ctx.restore();
                ctx.globalAlpha = 1;
                self.drawText(button.label,button.x + menu.padding[3],button.y + button.height/2);
            });


            ctx.restore();
        },

        drawScreen: function(screen) {
            this.drawStandardScreen(screen);
            switch(screen.id) {
                case "screen_inventory":
                    this.drawInventoryScreen(screen);
                    break;
                case "screen_character":
                    this.drawCharacterScreen(screen);
                    break;
            }
        },

        drawInventoryScreen: function(screen) {
            var p = this.game.player,
                inv = p.inventory,
                table = this.game.GUI.elements["table_inventory"],
                self = this,
                ctx = this.getContext(),
                y = screen.y+90,
                x = screen.x+50;

            this.drawTable(table);
            ctx.fillText("items: " + p.getNumItems(), x,y);

            _.each(inv, function(item) {
                try {
                    var icon = self.game.GUI.icons["icon_" + item.id];
                    if(icon) {
                        self.drawInventoryIcon(icon);
                    }
                } catch(e) {
                    console.log("error with icon at inv pos " + i);
                    throw(e);
                }
            });

        },

        drawTable: function(table) {
            var ctx = this.getContext(),
                x = table.x,
                y = table.y;
            ctx.save();
            ctx.globalAlpha = 0.3;

            for(var i = 0; i <= table.rows; i++) {
                ctx.fillRect(x,y+(i*table.cellsize),table.cellsize*(table.cols),1);
            }

            for(i = 0; i <= table.cols; i++) {
                ctx.fillRect(x+(i*table.cellsize),y,1,table.cellsize*(table.rows));
            }
            ctx.restore()
        },

        drawInventoryIcon: function(icon) {
            var ctx = this.getContext(),
                y = icon.entity.sprite.image.height - icon.height;

            ctx.drawImage(icon.entity.sprite.image, 0,y, icon.width, icon.height, icon.x,icon.y, icon.width, icon.height);
        },

        drawCharacterScreen: function(screen) {
            var ctx = this.getContext();
            var y = screen.y+80;
            var x = screen.x+40;
            this.drawText("Name: " + this.game.player.name, x,y);
            y += 20;
            this.drawText("Level: " + this.game.player.level, x,y);
            y += 20;

            this.drawText("Exp:", x,y);

            this.drawProgressBar(x+50,y-9,100,10,this.game.player.xp/100);

            // Debug
            y += 20;
            this.drawText("" + this.game.player.xp + "%", x+30, y);
        },

        drawProgressBar: function(x,y,width,height,fill) {
            var ctx = this.getContext();
            ctx.fillRect(x,y,width*fill,height);
            ctx.strokeRect(x,y,width,height);

        },

        drawStandardScreen: function(screen) {
            // WIP
            var ctx = this.getContext();
            ctx.save();
            ctx.fillStyle = "#AAA";

            // Draw background image if exists. Else draw grey rect
            if(screen.image) {
                ctx.drawImage(screen.image,screen.x,screen.y);
            } else {
                ctx.fillRect(screen.x,screen.y,screen.width,screen.height);
            }

            ctx.restore();
        },


        drawTextButton: function(button) {

        },

        drawImgButton: function(button) {
            var ctx = this.getContext();
            ctx.save();
            try {
                ctx.drawImage(button.image,button.x,button.y);
            } catch(e) {
                console.log(button);
                throw(e)
            }
            ctx.restore();
        },

        drawEntities: function() {
            var self = this;

            // calculate the time since the last frame
            var thisFrame = new Date().getTime();
            var dt = (thisFrame - this.lastFrame)/1000;
            this.lastFrame = thisFrame;

            // Draw all game objects
            this.game.forEachVisibleEntity(function(entity) {
                self.drawEntity(entity);
            });


        },

        drawEntity: function(entity) {
            var context = this.getContext(),
                sprite = entity.sprite,
                anim = entity.currentAnimation;

            if(anim && sprite) {
                frame = anim.currentFrame,
                x = frame.x,
                y = frame.y,
                w = sprite.width,
                h = sprite.height,
                dx = entity.x,
                dy = entity.y;

            context.save();


            if(entity instanceof Player) {
                context.translate(-(this.centerTiles.x * _TILESIZE - this.center.x ), -(this.centerTiles.y * _TILESIZE - this.center.y));
                context.translate(this.centerTiles.x * _TILESIZE, this.centerTiles.y * _TILESIZE);
            } else {
                context.translate(dx, dy);
            }

            try {
                context.drawImage(sprite.image, x, y, w, h, 0, 0, w, h);

                if(entity instanceof Character) {
                    _.each(entity.equipped, function(item) {
                        var sprite = item.sprite,
                            itemAnim = item.currentAnimation,
                            frame = anim.currentFrame;
                        if(sprite && itemAnim) {
                                index = frame.index < itemAnim.length ? frame.index : frame.index % itemAnim.length;

                            var frame = anim.currentFrame,
                                x = sprite.width * index,
                                y = sprite.height * anim.row,
                                dx = 0,
                                dy = 0,
                                w = sprite.width,
                                h = sprite.height;

                           // console.log(x,y,w,h);

                            context.drawImage(sprite.image, x, y, w, h, dx, dy, w, h);
                        }
                    });
                }

            } catch(e) {
                console.log(entity);
                throw(e);
            }
            context.restore();
            }
        },

        drawText: function(text, x, y, fontSize, fontFace, align) {
            var fontSize = typeof fontSize !== 'undefined' ? fontSize: '15px',
                fontFace = typeof fontFace !== 'undefined' ? fontFace:  'Courier',
                font = fontSize + " " + fontFace,
                ctx = this.getContext();
            ctx.save();
            if(typeof align !== 'undefined') {
                ctx.textAlign = align;
            }
            ctx.font = font;
            ctx.fillStyle = "black";
            ctx.fillText(text, x, y);
            ctx.restore();

        },

        drawBackground: function() {

            var ctx = this.getContext();
            /*
                tileSheet = new Image();
                /*w = this.game.map.width,
                * h = this.game.map.height;

            tileSheet.src = "/img/grass.png";
            */

            if(this.game.player) {

                var bounds = this.game.app.getVisibleTileBounds();

                for(var row = bounds.minY; row < bounds.maxY; row++) {
                    for(var col = bounds.minX; col < bounds.maxX; col++) {
                        var tile = this.game.map.tiles[row][col];

                        var x = tile.offset.x,
                            y = tile.offset.y;

                        ctx.drawImage(this.game.map.tileset, (x) * _TILESIZE, (y) * _TILESIZE, _TILESIZE, _TILESIZE, col * _TILESIZE, row * _TILESIZE, _TILESIZE, _TILESIZE);

                    }
                }
            }


        },

        renderFrame: function() {

            // Clear contexts
            this.backBuffercontext.clearRect(0,0,this.backBuffer.width,this.backBuffer.height);
            this.context.clearRect(0,0,this.backBuffer.width,this.backBuffer.height);

            var ctx = this.getContext();

            ctx.save();
            if(this.game.player) {
                this.center = {x: this.game.player.x, y: this.game.player.y};
            }

            // Draw dynamic objects first
            ctx.translate(this.centerTiles.x * _TILESIZE - this.center.x , this.centerTiles.y * _TILESIZE - this.center.y);

            // Draw background first!
            this.drawBackground();

            if(this.grid) {
                this.drawGrid();
            }

            this.drawTargetIndicator();

            // Draw visible entities
            this.drawEntities();

            ctx.restore();

            // Now draw static objects

            this.drawTileHover();

            
            // Debug FPS
            this.drawFPS();

            // Draw GUI
            this.drawGUI();


            // Copy buffer to canvas
            this.context.drawImage(this.backBuffer,0,0);

        },
        
        
        drawRect: function(x,y,w,h,ctx) {
            ctx.fillRect(x,y,w,h);
        },
        
        clearRect: function(x,y,w,h,ctx) {
            ctx.clearRect(x,y,w,h);
        },
        
        drawFPS: function() {
            var nowTime = new Date(),
                diffTime = nowTime.getTime() - this.lastTime;

            if (diffTime >= 1000) {
                this.realFPS = this.frameCount;
                this.frameCount = 0;
                this.lastTime = nowTime;
            }
            this.frameCount++;

            this.drawText("FPS: " + this.realFPS, 5, 15);
        }
    });
    return Renderer;
});