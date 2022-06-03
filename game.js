let game;

window.onload = function () {
    document.getElementById("2P").addEventListener("click", function () { game = new Game(2); }, false);
    document.getElementById("4P").addEventListener("click", function () { game = new Game(4); }, false);
}

