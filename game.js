let game;

window.onload = function () {
    console.log('Dokument geladen');
    game = new Game();
    document.addEventListener("keydown", game.input, false);
}