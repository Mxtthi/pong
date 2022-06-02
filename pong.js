class Game {
    constructor() {
        this.isRunning = false;
        this.isPaused = false;
        this.score = { "player1": 0, "player2": 0 }

        this.ball = new Ball();
    }

    increaseScore(player, value) {
        if (player == "player1") this.score.player1 += value;
        if (player == "player2") this.score.player2 += value;
    }

    movePlattform(player, direction) {
        let elem = document.getElementById(player);

        if (elem.style.top == "") elem.style.top = game.ball.getPos(elem).y + "px";

        console.log(game.ball.getPos(elem));
        console.log(elem.style.top)
        if (direction == "up") elem.style.top = parseFloat(elem.style.top.slice(0, -2)) - 15 + "px";
        if (direction == "down") elem.style.top = parseFloat(elem.style.top.slice(0, -2)) + 15 + "px";
    }

    input(e) {
        if (!game.isRunning) {
            game.isRunning = true;
            game.move = setInterval(game.ball.moveBall, 1000, game.ball);
        }

        switch (e.key.toLowerCase()) {
            case "space":
                game.isPaused = !game.isPaused;
                break;
            case "tab":
                //restart game
                break;
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

class Ball {
    constructor() {

        this.xSpeed = 0;
        this.ySpeed = 0;

        this.spawnBall();
        this.x = this.getPos(document.getElementsByClassName("circle")[0]).x;
        this.y = this.getPos(document.getElementsByClassName("circle")[0]).y;
    }

    spawnBall() {
        let ball = document.createElement("div");
        ball.style.top = "50vh";
        ball.style.left = "50vw";
        ball.classList.add("circle");
        document.body.appendChild(ball);
    }

    getPos(elem) {
        return elem.getBoundingClientRect();
    }

    moveBall() {
        if (game.ball.xSpeed == 0 && game.ball.ySpeed == 0) {
            if (game.ball.getRandomInt(0, 1)) {
                game.ball.xSpeed = 10;
                game.ball.ySpeed = 1;
            } else {
                game.ball.xSpeed = -10;
                game.ball.ySpeed = 1;
            }
        }
        game.ball.x += game.ball.xSpeed;
        game.ball.y += game.ball.ySpeed;

        document.getElementsByClassName("circle")[0].style.left = game.ball.x + "px";
        document.getElementsByClassName("circle")[0].style.top = game.ball.y + "px";
    }

    getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }


}