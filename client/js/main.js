requirejs(['App', 'Game'],
    function (App, Game) {
        _TILESIZE = 32;
        var canvas = document.getElementById('canvas');
        var app = new App();
        var game = new Game(app);
        app.setGame(game);

        // Get canvas offset
        // From http://www.quirksmode.org/js/findpos.html
        var curleft = curtop = 0,
            elem = canvas;
        if (elem.offsetParent) {
            do {
                curleft += elem.offsetLeft;
                curtop += elem.offsetTop;
            } while (elem = elem.offsetParent);
        }
        app.setOffset(curleft,curtop);

        canvas.onmousedown = function (evt) {
            app.setMouseCoordinates(evt);
            game.mousedown();
        };

        canvas.onclick = function (evt) {
            app.setMouseCoordinates(evt);
            game.click();
        };

        canvas.onmousemove = function (evt) {
            app.setMouseCoordinates(evt);
            game.hover();
        };

        canvas.oncontextmenu = function (evt) {
            app.setMouseCoordinates(evt);
            game.rightclick();
            return false;
        };
    }
);