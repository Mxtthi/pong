class Game {
    constructor(player) {
        this.player = player;
        this.teams = [];
        this.isRunning = false;
        this.isPaused = false;
        this.isFinished = false;
        this.lastHit;
        this.movement = window.innerHeight / 100;
        this.score = { "team1": 0, "team2": 0 }

        this.ball = new Ball();
        this.assignTeams();
        this.loadVisuals();
    }

    assignTeams() {
        if (this.player == 2) {
            this.teams[1] = "T1";
            this.teams[2] = "T2";
        } else {
            this.teams[1] = "T1";
            this.teams[2] = "T1";
            this.teams[3] = "T2";
            this.teams[4] = "T2";
        }
    }

    loadVisuals() {
        for (let i = 1; i <= this.player; i++) {
            let div = document.createElement("div");
            div.classList.add("block", "unselectable");
            div.id = "player" + i;
            if (this.player == 4) {
                if (i % 2) div.style.top = "15vh";
                else div.style.top = "70vh";
                if (i < 3) div.style.left = "5vw";
                else div.style.left = "95vw";
            }
            document.body.appendChild(div);
        }
        document.getElementById("settings").style.display = "none";
    }

    increaseScore(team, value) {
        if (team == "T1") this.score.team1 += value;
        if (team == "T2") this.score.team2 += value;
        if (this.score.team1 >= 5) this.playerWon("Blue");
        if (this.score.team2 >= 5) this.playerWon("Red");
        this.setScore();
    }

    setScore() {
        document.getElementById("score").innerHTML = this.score.team1 + " - " + this.score.team2;
    }

    playerWon(team) {
        clearInterval(game.move)
        game.move = "";
        game.isRunning = false;
        game.isFinished = true;
        document.getElementById("gameWon").innerHTML = team + " won";
    }

    pauseOrContinueGame() {
        if (game.isPaused == true) {
            clearInterval(game.move)
            game.move = "";
            document.getElementById("gameWon").innerHTML = "Paused";
        } else if (game.isPaused == false && game.isRunning == true && game.move == "") {
            document.getElementById("gameWon").innerHTML = "";
            game.move = setInterval(game.ball.moveBall, 3, game.ball);
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
        if (document.getElementById(player) == undefined) return;
        if (elem.style.top == "" || elem.style.top.includes("vh")) elem.style.top = game.ball.getPos(elem).y + "px";
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
            game.ball.xSpeed = window.innerWidth / game.ball.getRandomInt(100, 200);
            game.ball.ySpeed = window.innerHeight / game.ball.getRandomInt(150, 500);
            if (game.ball.getRandomInt(0, 1) == 0) {
                game.ball.xSpeed *= -1;
                game.lastHit = "T2";
            } else {
                game.lastHit = "T1";
            }
            if (game.ball.getRandomInt(0, 1) == 0) game.ball.ySpeed *= -1;
            if (game.player > 2) {
             game.ball.xSpeed*= 2;
             game.ball.ySpeed*= 2;
            }
        }

        game.ball.x += game.ball.xSpeed / 3;
        game.ball.y += game.ball.ySpeed / 3;

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
        };

        if (game.ball.y <= 0 || game.ball.y >= window.innerHeight - window.innerHeight / 50) {
            game.ball.changeDirection("y");
        }

        for (let i = 0; i < game.player; i++) {

            diffY = game.ball.getPos(playerArr[i]).top - game.ball.getPos(ball).top;
            diffX = game.ball.getPos(playerArr[i]).left - game.ball.getPos(ball).left;
            
            if (game.checkIfElementsOverlap(ball, playerArr[i])) {
                if (game.lastHit == game.teams[i + 1]) {
                    return;
                }
                else {
                    game.lastHit = game.teams[i + 1];
                    game.ball.changeDirection("x");
                }
            } else if (game.ball.xSpeed > 30 || game.ball.xSpeed < -30) {
                if (((diffX > -100 && diffX < 0 && game.ball.xSpeed > 0) || (diffX < 100 && diffX > 0 && game.ball.xSpeed < 0)) && diffY < 0 && diffY > -window.innerHeight * 0.15) {
                    console.log(diffY, window.innerHeight * 0.15)
                    if (game.lastHit == game.teams[i + 1]) {
                        return;
                    }
                    else {
                        game.lastHit = game.teams[i + 1];
                        game.ball.changeDirection("x");
                    }
                    console.log(diffX, diffY, "HIT")
                }
            }
        }
    }

    changeDirection(axis) {
        if (axis == "x") {
            if (game.ball.xSpeed > 0 && game.ball.xSpeed < window.innerWidth / 100 || game.ball.xSpeed < 0 && game.ball.xSpeed * -1 < window.innerWidth / 100) {
                game.ball.xSpeed *= 2;
            } else if (game.ball.xSpeed > 0 && game.ball.xSpeed < window.innerWidth / 75 || game.ball.xSpeed < 0 && game.ball.xSpeed * -1 < window.innerWidth / 75) {
                game.ball.xSpeed *= 1.5;
            } else if (game.ball.xSpeed > 0 && game.ball.xSpeed < window.innerWidth / 30 || game.ball.xSpeed < 0 && game.ball.xSpeed * -1 < window.innerWidth / 30) {
                game.ball.xSpeed *= 1.1;
            } else if (game.ball.xSpeed > 0 && game.ball.xSpeed < window.innerWidth / 10 || game.ball.xSpeed < 0 && game.ball.xSpeed * -1 < window.innerWidth / 10) {
                game.ball.xSpeed *= 1.05;
            } else {
                game.ball.xSpeed *= 1.01;
            }
            game.ball.xSpeed *= -1;
            game.ball.ySpeed *= 1.02;
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