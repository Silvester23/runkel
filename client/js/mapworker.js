importScripts('../../shared/world.js', 'lib/underscore-min.js');

onmessage = function (event) {
    generateCollisionGrid()
    postMessage(mapData);
};


function generateCollisionGrid() {
    mapData.grid = [];
    for(var row = 0; row < mapData.height; row++) {
        mapData.grid[row] = []
        for(var col = 0; col < mapData.width; col++) {
            mapData.grid[row][col] = 0;
        }
    }
}