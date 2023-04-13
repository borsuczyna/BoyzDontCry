import Game from "./game/main";

let canvas: HTMLCanvasElement = document.getElementById('player') as HTMLCanvasElement;
let game: Game = new Game(canvas);

function updateGame() {
    requestAnimationFrame(updateGame);
    game.update();
}

requestAnimationFrame(updateGame);