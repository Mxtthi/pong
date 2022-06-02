class Game {
    constructor() {
        this.isRunning = false;
        this.isPaused = false;
        this.isFinished = false;
        this.movement = window.innerHeight / 100;
        this.score = { "player1": 0, "player2": 0 }

        this.ball = new Ball();
    }

    increaseScore(player, value) {
        if (player == "player1") this.score.player1 += value;
        if (player == "player2") this.score.player2 += value;
        if (this.score.player1 >= 5) this.playerWon("Player 1");
        if (this.score.player2 >= 5) this.playerWon("Player 2");
        this.setScore();
    }

    setScore() {
        document.getElementById("score").innerHTML = this.score.player1 + " - " + this.score.player2;
    }

    playerWon(player) {
        clearInterval(game.move)
        game.move = "";
        game.isRunning = false;
        game.isFinished = true;
        document.getElementById("gameWon").innerHTML = player + " won";
    }

    pauseOrContinueGame() {
        if (game.isPaused == true) {
            clearInterval(game.move)
            game.move = "";
            document.getElementById("gameWon").innerHTML = "Paused";
        } else if (game.isPaused == false && game.isRunning == true && game.move == "") {
            document.getElementById("gameWon").innerHTML = "";
            game.move = setInterval(game.ball.moveBall, 10, game.ball);
        }
    }

    restart() {
        clearInterval(game.move);
        if (document.getElementsByClassName("circle").length > 0) document.getElementsByClassName("circle")[0].remove();
        document.getElementById("gameWon").innerHTML = "";
        game = new Game();
        game.setScore();
    }

    movePlattform(player, direction) {
        let elem = document.getElementById(player), res;
        if (elem.style.top == "") elem.style.top = game.ball.getPos(elem).y + "px";
        if (direction == "up") res = parseFloat(elem.style.top.slice(0, -2)) - this.movement;
        if (direction == "down") res = parseFloat(elem.style.top.slice(0, -2)) + this.movement;
        if (res < window.innerHeight - window.innerHeight / 6.6 && res > 0) {
            elem.style.top = res + "px";
        }
    }

    checkIfElementsOverlap(elem1, elem2) {
        let pos1 = elem1.getBoundingClientRect();
        let pos2 = elem2.getBoundingClientRect();

        return !(pos1.top > pos2.bottom || pos1.right < pos2.left || pos1.bottom < pos2.top || pos1.left > pos2.right);
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
            game.ball.xSpeed = window.innerWidth / game.ball.getRandomInt(200, 500);
            game.ball.ySpeed = window.innerHeight / game.ball.getRandomInt(100, 1000);
            console.log(game.ball.ySpeed);
            if (game.ball.getRandomInt(0, 1) == 0) game.ball.xSpeed *= -1;
            if (game.ball.getRandomInt(0, 1) == 0) game.ball.ySpeed *= -1;
        }

        game.ball.x += game.ball.xSpeed;
        game.ball.y += game.ball.ySpeed;

        document.getElementsByClassName("circle")[0].style.left = game.ball.x + "px";
        document.getElementsByClassName("circle")[0].style.top = game.ball.y + "px";

        game.ball.checkIfHit();
    }

    checkIfHit() {
        let ball = document.getElementsByClassName("circle")[0], p1 = document.getElementById("player1"), p2 = document.getElementById("player2");

        if (game.ball.x <= 0 || game.ball.x >= window.innerWidth) {
            ball.remove()
            if (game.ball.x <= 0) game.increaseScore("player2", 1);
            if (game.ball.x >= window.innerWidth) game.increaseScore("player1", 1);
            if (game.score.player1 < 5 && game.score.player2 < 5) {
                game.ball = new Ball();
            }
        };

        if (game.ball.y <= 0 || game.ball.y >= window.innerHeight - window.innerHeight / 50) game.ball.changeDirection("y");
        if (game.checkIfElementsOverlap(ball, p1) || game.checkIfElementsOverlap(ball, p2)) game.ball.changeDirection("x");
    }

    changeDirection(axis) {
        if (axis == "x") {
            console.log(game.ball.xSpeed, window.innerHeight / 250)
            if (game.ball.xSpeed > 0 && game.ball.xSpeed < window.innerWidth / 200 || game.ball.xSpeed < 0 && game.ball.xSpeed * -1 < window.innerWidth / 200) {
                game.ball.xSpeed *= 2;
            } else if (game.ball.xSpeed < window.innerWidth / 50) {
                game.ball.xSpeed *= 1.05;
            } else {
                game.ball.xSpeed *= 1.01;
            }
            game.ball.xSpeed *= -1;
            game.ball.ySpeed *= 1.02;
        }
        if (axis == "y") {
            game.ball.ySpeed *= -1;
        }
    }

    getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }
}