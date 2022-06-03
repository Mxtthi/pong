let keys = [];

document.addEventListener("keydown",
    function (e) {
        if (game !== undefined && !game.isRunning && !game.isFinished) {
            game.isRunning = true;
            document.getElementById("gameWon").innerHTML = "";
            game.move = setInterval(game.ball.moveBall, 2.5, game.ball);
            game.pauseCheck = setInterval(game.pauseOrContinueGame, 10);
        }
        if (keys.includes(e.key) === false) {
            if (e.key == "Tab") {
                e.preventDefault();
                game.restart();
            }
            if (e.key == " ") {
                e.preventDefault();
                game.isPaused = !game.isPaused;
                console.log(game.isPaused)
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
    if (!game.isPaused) {
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
    }
}, 10);