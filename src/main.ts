import Game from "./game/main";
import './world/main';

let canvas: HTMLCanvasElement = document.getElementById('player') as HTMLCanvasElement;
let game: Game = new Game(canvas);
game.world.setLocation('Toaleta');

// @ts-ignore
window.game = game;

function updateGame() {
    requestAnimationFrame(updateGame);
    game.update();
}

requestAnimationFrame(updateGame);