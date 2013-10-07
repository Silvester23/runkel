requirejs(['App', 'Game'],
    function (App, Game) {
        _TILESIZE = 32;
        canvas = document.getElementById('canvas');
        context = canvas.getContext("2d");
        app = new App();
        game = new Game(app);
        app.setGame(game);
        game.start();
        // TEST
    }
);