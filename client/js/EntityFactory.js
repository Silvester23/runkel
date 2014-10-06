define(['Boots','Avatar','Player'], function (Boots,Avatar,Player) {
    var EntityFactory = Class.extend({
        init: function () {
            this.builders = {};


            this.builders[Types.Entities.Items.BOOTS] = function(id,x,y,name) {
                return new Boots(id,x,y,name);
            };

            this.builders[Types.Entities.Characters.PLAYER] = function(id,x,y,name) {
                return new Player(id,x,y,name);
            };

            this.builders[Types.Entities.Characters.AVATAR] = function(id,x,y,name) {
                return new Avatar(id,x,y,name);
            };

        },

        createEntity: function(type,id,x,y,name) {
            if(_.isFunction(this.builders[type])) {
                return this.builders[type](id,x,y,name);
            }
        }


    });

    return EntityFactory;
});