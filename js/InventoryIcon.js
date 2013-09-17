define(['GUIElement'], function (GUIElement) {
    var InventoryIcon = GUIElement.extend({
        init: function (entity) {
            var data = {};
            data["id"] = "icon_" + entity.id;
            data["allowDrag"] = true;
            data["entity"] = entity;
            data["sprite"] = entity.getSprite();
            data["width"] = entity.sprite.width;
            data["height"] = entity.sprite.height;
            data["z"] = -1;
            this._super(data);
        },


        drag: function(x,y) {

            this.x = x - this.width/2;
            this.y = y - this.height/2;

            //console.log("dragging to ", x, y);
        }
    });
    return InventoryIcon;
})