define(['ImgButton','Screen','Player'], function(ImgButton,Screen,Player) {
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
        },

        getContext: function() {
            return this.backBuffercontext;
        },


        drawGrid: function() {
            var ctx = this.getContext();

            ctx.save();
            ctx.globalAlpha = 0.3;

            for(i = 0; i < 640/_TILESIZE; i++) {
                ctx.fillRect(i*_TILESIZE, 0, 1, 480);
            }

            for(i = 0; i < 480/_TILESIZE; i++) {
                ctx.fillRect(0, i*_TILESIZE, 640, 1);
            }



            ctx.fillRect(319,-200,2,800);
            ctx.fillRect(-300,207,1000,2);


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

            _.each(this.game.GUI.elements, function(elem) {
                if(elem.visible) {
                    if(elem instanceof ImgButton) {
                        self.drawImgButton(elem);
                    }
                    else if(elem instanceof Screen) {
                        self.drawScreen(elem);
                    }
                }
            });
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

            //console.log(table);
            for(var i = 0; i <= table.rows; i++) {
                ctx.fillRect(x,y+(i*table.cellsize),table.cellsize*(table.cols),1);
            }

            for(i = 0; i <= table.cols; i++) {
                ctx.fillRect(x+(i*table.cellsize),y,1,table.cellsize*(table.rows));
            }
            ctx.restore()
        },

        drawInventoryIcon: function(icon) {
            var ctx = this.getContext();
            ctx.drawImage(icon.entity.sprite.image, icon.x,icon.y);
        },

        drawCharacterScreen: function(screen) {
            var ctx = this.getContext();
            var y = screen.y+80;
            var x = screen.x+40;
            this.drawText("Name: " + this.game.player.name, x,y);
            y += 20;
            this.drawText("Level: " + this.game.player.level, x,y);
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
            this.game.forEachEntity(function(entity) {
                self.drawEntity(entity,self.backBuffercontext);
            });


        },

        drawEntity: function(entity,context) {
            var sprite = entity.sprite;
            var anim = entity.currentAnimation;


            if(anim && sprite) {
                var frame = anim.currentFrame,
                x = frame.x,
                y = frame.y,
                w = sprite.width,
                h = sprite.height,
                dx = entity.x,
                dy = entity.y;

            }

            context.save();
            if(entity instanceof Player) {
                context.translate(-(this.centerTiles.x * _TILESIZE - this.center.x ), -(this.centerTiles.y * _TILESIZE - this.center.y));
                context.translate(this.centerTiles.x * _TILESIZE, this.centerTiles.y * _TILESIZE);
            } else {
                context.translate(dx, dy);
            }

            try {
                context.drawImage(sprite.image, x, y, w, h, 0, 0, w, h);
            } catch(e) {
                console.log(entity);
                throw(e);
            }
            context.restore();

        },

        drawText: function(text, x, y, font, align, ctx) {
            var font = typeof font !== 'undefined' ? font : '15px Courier',
                ctx = typeof ctx !== 'undefined' ? ctx : this.getContext();
            ctx.save();
            if(typeof align !== 'undefined') {
                ctx.textAlign = align;
            }
            ctx.font = font;
            ctx.fillStyle = "black";
            ctx.fillText(text, x, y);
            ctx.restore();

        },

        renderFrame: function() {

            var grid = true;

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

            // Draw visible entities
            this.drawEntities();

            if(grid) {
                this.drawGrid();
            }

            this.drawTargetIndicator();

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
        
            //this.drawText("FPS: " + this.realFPS + " / " + this.maxFPS, 30, 30, false);
            this.drawText("FPS: " + this.realFPS, 5, 15);
        }
    });
    return Renderer;
});