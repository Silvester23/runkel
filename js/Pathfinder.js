define([], function () {
    var Pathfinder = Class.extend({
        init: function () {

        },

        findPath: function(srcTile,dstTile) {
            // TODO. This is just a placeholder

            path = [srcTile];

            hordir = srcTile[0] < dstTile[0] ? 1 : -1;
            verdir = srcTile[1] < dstTile[1] ? 1 : -1;

            for(i = 1; i <= Math.abs(dstTile[0]-srcTile[0]); i++) {
                path.push([srcTile[0]+i*hordir,srcTile[1]])
            }

            for(i = 1; i <= Math.abs(dstTile[1]-srcTile[1]); i++) {
                path.push([path[path.length-1][0],srcTile[1]+i*verdir])
            }

            return path;
        }
    });
    return Pathfinder;
})