define(['ImgButton','Screen'], function(ImgButton,Screen) {
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

            ctx.restore();
            this.drawTileHover();
        },


        drawTileHover: function() {
            var ctx = this.getContext();
            if(game.curTileX >= 0 && game.curTileX <= game.maxTileX
                && game.curTileY >= 0 && game.curTileY <= game.maxTileY) {

                var x = game.curTileX;
                var y = game.curTileY;
                ctx.save();
                ctx.strokeStyle = "blue";
                ctx.strokeRect(x * _TILESIZE, y * _TILESIZE, _TILESIZE, _TILESIZE);
                ctx.restore();

                p = this.game.player.avatar.path;
                if(p !== null) {
                    var x = p[p.length-1][0];
                    var y = p[p.length-1][1];
                    ctx.save();
                    ctx.strokeStyle = "red";
                    ctx.strokeRect(x * _TILESIZE, y * _TILESIZE, _TILESIZE, _TILESIZE);
                    ctx.restore();
                }

            }
        },

        drawGUI: function() {
            var self = this;
            var ctx = this.getContext();

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
            var p = this.game.player;
            var inv = p.inventory;
            var self = this;
            var ctx = this.getContext();
            var y = screen.y+130;
            var x = screen.x+50;

            ctx.save();
            ctx.globalAlpha = 0.3;
            // First, draw inventory grid
            var slotsize = 48;
            var maxSlotX = 2;
            var maxSlotY = 3;
            for(var i = 0; i <= maxSlotY+1; i++) {
                ctx.fillRect(x,y+(i*slotsize),slotsize*(maxSlotX+1),1);
            }

            for(var i = 0; i <= maxSlotX+1; i++) {
                ctx.fillRect(x+(i*slotsize),y,1,slotsize*(maxSlotY+1));
            }
            ctx.restore()

            ctx.fillText("items: " + inv.length, x,y);
            for(var i = 0; i < inv.length; i++) {

                var row = Math.floor(i / (maxSlotX+1));
                var col = i % (maxSlotX+1);

                var icon = this.game.GUI.icons["icon_" + inv[i].id];
                if(typeof icon.x == "undefined") {
                    var offset = (slotsize-icon.width)/2;
                    icon.x = x+col*slotsize + offset;
                }
                if(typeof icon.y === "undefined") {
                    var offset = (slotsize-icon.height)/2;
                    icon.y = y+row*slotsize + offset;
                }
                if(icon) {
                    this.drawInventoryIcon(icon);
                }
            }

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

            //this.drawText(screen.id, screen.x+10,screen.y+10);
            ctx.restore();
        },


        drawTextButton: function(button) {

        },

        drawImgButton: function(button) {
            var ctx = this.getContext();
            ctx.save();
            ctx.drawImage(button.image,button.x,button.y);
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
            context.translate(dx,dy);
            context.drawImage(sprite.image, x, y, w, h, 0, 0, w, h);
            context.restore();
            
        },
        
        drawText: function(text, x, y, font, align, ctx) {
            var font = typeof font !== 'undefined' ? font : '15px Courier';
            var ctx = typeof ctx !== 'undefined' ? ctx : this.getContext();
            ctx.save();
            if(typeof align !== 'undefined') {
                ctx.textAlign = align;
            }
            ctx.font = font;
            ctx.fillStyle = "black";
            ctx.fillText(text,x,y)
            ctx.restore();

        },
        
        renderFrame: function() {

            var grid = true;

            // Clear contexts
            this.backBuffercontext.clearRect(0,0,this.backBuffer.width,this.backBuffer.height);
            this.context.clearRect(0,0,this.backBuffer.width,this.backBuffer.height);

            
            // Draw visible entities
            this.drawEntities();


            if(grid) {
                this.drawGrid();
            }

            // Draw GUI
            this.drawGUI();

            
            // Debug FPS
            this.drawFPS();


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