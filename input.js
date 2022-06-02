let keys = [];

document.addEventListener("keydown",
    function (e) {
        if (!game.isRunning) {
            game.isRunning = true;
            game.move = setInterval(game.ball.moveBall, 1000, game.ball);
        }
        if (keys.includes(e.key) === false) {
            if (e.key == "Tab") {
                e.preventDefault();
                location.reload(true);
            }
            if (e.key == "Space") {
                e.preventDefault();
                game.isPaused = !game.isPaused;
            }
            keys.push(e.key);
        }
    },
    false);

document.addEventListener("keyup",
    function (e) {
        keys = keys.filter(t => t !== e.key);
    },
    false);

setInterval(() => {
    for (let i = 0; i < keys.length; i++) {
        switch (keys[i].toLowerCase()) {
            case "w":
                game.movePlattform("player1", "up");
                break;
            case "s":
                game.movePlattform("player1", "down");
                break;
            case "arrowup":
                game.movePlattform("player2", "up");
                break;
            case "arrowdown":
                game.movePlattform("player2", "down");
                break;
        }
    }
}, 10);