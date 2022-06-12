class Game {
    constructor(player) {
        this.player = player;
        this.teams = [];
        this.isRunning = false;
        this.isPaused = false;
        this.isFinished = false;
        this.lastHit;
        this.movement = window.innerHeight / 75;
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
            game.pauseAudio();
            document.getElementById("gameWon").innerHTML = "Paused";
        } else if (game.isPaused == false && game.isRunning == true && game.move == "") {
            document.getElementById("gameWon").innerHTML = "";
            game.move = setInterval(game.ball.moveBall, 15, game.ball);
            game.resumeAudio();
        }
    }

    restart() {
        clearInterval(game.move);
        if (document.getElementsByClassName("circle").length > 0) document.getElementsByClassName("circle")[0].remove();
        document.getElementById("gameWon").innerHTML = "";
        for (let i = 1; i <= game.player; i++) {
            if (i <= 2 || i > 2 && game.player > 2) document.getElementById("player" + i).remove();
        }
        game = new Game(game.player);
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

    startAudio() {
		this.audio = new Audio('./other/pongchingchong.mp3');
		this.audio.play();
	}

	pauseAudio() {
        this.audio.pause();
    }
    
    resumeAudio() {
        this.audio.play();
    }
}