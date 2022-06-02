class Game {
    constructor() {
        this.isRunning = false;
        this.isPaused = false;
        this.movement = window.innerHeight / 100;
        this.score = { "player1": 0, "player2": 0 }

        this.ball = new Ball();
    }

    increaseScore(player, value) {
        if (player == "player1") this.score.player1 += value;
        if (player == "player2") this.score.player2 += value;
        document.getElementById("score").innerHTML = this.score.player1 + " - " + this.score.player2;
    }

    movePlattform(player, direction) {
        let elem = document.getElementById(player), res;
        if (elem.style.top == "") elem.style.top = game.ball.getPos(elem).y + "px";
        if (direction == "up") res = parseFloat(elem.style.top.slice(0, -2)) - this.movement;
        if (direction == "down") res = parseFloat(elem.style.top.slice(0, -2)) + this.movement;
        console.log(res, window.innerHeight / 10)
        if (res < window.innerHeight - window.innerHeight / 10 && res > 0) {
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
            game.ball.xSpeed = 5;
            game.ball.ySpeed = 1;
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
            game.ball = new Ball();
        };

        if (game.ball.y <= 0 || game.ball.y >= window.innerHeight - window.innerHeight / 50) game.ball.ySpeed *= -1;
        if (game.checkIfElementsOverlap(ball, p1) || game.checkIfElementsOverlap(ball, p2)) game.ball.xSpeed *= -1;
    }

    getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }
}