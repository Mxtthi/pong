let keys = [];

document.addEventListener("keydown",
    function (e) {
        if (game !== undefined && !game.isRunning && !game.isFinished) {
            game.isRunning = true;
            document.getElementById("gameWon").innerHTML = "";
            game.move = setInterval(game.ball.moveBall, 3, game.ball);
            game.pauseCheck = setInterval(game.pauseOrContinueGame, 1);
        }
        if (game !== undefined && keys.includes(e.key) === false) {
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
    if (game !== undefined && !game.isPaused) {
        for (let i = 0; i < keys.length; i++) {
            switch (keys[i].toLowerCase()) {
                case "w":
                    game.movePlattform("player1", "up");
                    break;
                case "s":
                    game.movePlattform("player1", "down");
                    break;
                case "h":
                    game.movePlattform("player2", "up");
                    break;
                case "n":
                    game.movePlattform("player2", "down");
                    break;
                case "ü":
                    game.movePlattform("player3", "up");
                    break;
                case "ä":
                    game.movePlattform("player3", "down");
                    break;
                case "arrowup":
                    game.movePlattform("player4", "up");
                    break;
                case "arrowdown":
                    game.movePlattform("player4", "down");
                    break;
            }
        }
    }
}, 10);