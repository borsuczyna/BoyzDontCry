import Game from "./game/main";
import './world/main';

let canvas: HTMLCanvasElement = document.getElementById('player') as HTMLCanvasElement;
let game: Game = new Game(canvas);
game.world.setLocation('Oboz Hippisow');

// @ts-ignore
window.game = game;

let lastTime: number = 0;
function updateGame(time: DOMHighResTimeStamp) {
    requestAnimationFrame(updateGame);
    game.update(time - lastTime);
    lastTime = time;
}

requestAnimationFrame(updateGame);