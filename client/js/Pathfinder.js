define([], function () {
    var Pathfinder = Class.extend({
        init: function () {

        },

        findPath: function (src, dest) {
            // TODO. This is just a placeholder

            path = [[src.x,src.y]];

            hordir = src.x < dest.x ? 1 : -1;
            verdir = src.y < dest.y ? 1 : -1;

            for (i = 1; i <= Math.abs(dest.x - src.x); i++) {
                path.push([src.x + i * hordir, src.y])
            }

            for (i = 1; i <= Math.abs(dest.y - src.y); i++) {
                path.push([path[path.length - 1][0], src.y + i * verdir])
            }

            return path;
        }
    });
    return Pathfinder;
});