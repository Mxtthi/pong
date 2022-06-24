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
            game.ball.xSpeed = window.innerWidth / game.ball.getRandomInt(250, 400);
            game.ball.ySpeed = window.innerHeight / game.ball.getRandomInt(300, 600);
            if (game.ball.getRandomInt(0, 1) == 0) {
                game.ball.xSpeed *= -1;
                game.lastHit = "T2";
            } else {
                game.lastHit = "T1";
            }
            if (game.ball.getRandomInt(0, 1) == 0) game.ball.ySpeed *= -1;
        }

        game.ball.x += game.ball.xSpeed / 1.1;
        game.ball.y += game.ball.ySpeed / 1.1;

        document.getElementsByClassName("circle")[0].style.left = game.ball.x + "px";
        document.getElementsByClassName("circle")[0].style.top = game.ball.y + "px";

        game.ball.checkIfHit();
    }

    checkIfHit() {
        let ball = document.getElementsByClassName("circle")[0], playerArr = [], diffY, diffX;
        playerArr.push(document.getElementById("player1"))
        playerArr.push(document.getElementById("player2"));
        if (game.player == 4) {
            playerArr.push(document.getElementById("player3"));
            playerArr.push(document.getElementById("player4"));
        }

        if (game.ball.x <= 0 || game.ball.x >= window.innerWidth) {
            ball.remove()
            if (game.ball.x <= 0) game.increaseScore("T2", 1);
            if (game.ball.x >= window.innerWidth) game.increaseScore("T1", 1);
            if (game.score.team1 < 5 && game.score.team2 < 5) {
                game.ball = new Ball();
            }
            let clone = game.applause.cloneNode(true);
            clone.volume = 0.25;
            clone.play();
        };

        if (game.ball.y <= 0 || game.ball.y >= window.innerHeight - window.innerHeight / 50) {
            game.ball.changeDirection("y");
        }

        for (let i = 0; i < game.player; i++) {

            diffY = game.ball.getPos(playerArr[i]).top - game.ball.getPos(ball).top;
            diffX = game.ball.getPos(playerArr[i]).left - game.ball.getPos(ball).left;

            if (game.checkIfElementsOverlap(ball, playerArr[i])) {
                game.playAudio();
                if (game.lastHit == game.teams[i + 1]) {
                    return;
                }
                else {
                    game.lastHit = game.teams[i + 1];
                    game.ball.changeDirection("x");
                }
            } else if (game.ball.xSpeed > 30 || game.ball.xSpeed < -30) {
                if (((diffX > -500 && diffX < 0 && game.ball.xSpeed > 0) || (diffX < 500 && diffX > 0 && game.ball.xSpeed < 0)) && diffY < 0 && diffY > -window.innerHeight * 0.15) {
                    if (game.lastHit == game.teams[i + 1]) {
                        return;
                    }
                    else {
                        game.lastHit = game.teams[i + 1];
                        game.ball.changeDirection("x");
                    }
                }
                game.playAudio();
            }
        }
    }

    changeDirection(axis) {
        let multiplicator;
        if (axis == "x") {
            if (game.ball.xSpeed > 0 && game.ball.xSpeed < window.innerWidth / 250 || game.ball.xSpeed < 0 && game.ball.xSpeed * -1 < window.innerWidth / 250) {
                multiplicator = 2;
            } else if (game.ball.xSpeed > 0 && game.ball.xSpeed < window.innerWidth / 200 || game.ball.xSpeed < 0 && game.ball.xSpeed * -1 < window.innerWidth / 200) {
                multiplicator = 1.5;
            } else if (game.ball.xSpeed > 0 && game.ball.xSpeed < window.innerWidth / 150 || game.ball.xSpeed < 0 && game.ball.xSpeed * -1 < window.innerWidth / 150) {
                multiplicator = 1.1;
            } else if (game.ball.xSpeed > 0 && game.ball.xSpeed < window.innerWidth / 100 || game.ball.xSpeed < 0 && game.ball.xSpeed * -1 < window.innerWidth / 100) {
                multiplicator = 1.05;
            } else {
                multiplicator = 1.01;
            }
            game.ball.xSpeed *= multiplicator;
            game.ball.ySpeed *= multiplicator;
            game.ball.xSpeed *= -1;
            console.log(game.ball.xSpeed)
        }
        if (axis == "y") {
            game.ball.ySpeed *= -1;
        }
    }

    getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }
}