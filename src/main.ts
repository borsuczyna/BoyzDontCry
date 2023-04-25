import { addEventListener } from "./events/main";
import Game from "./game/main";
import { loadSprite } from "./library/cache";
import './world/main';

let canvas: HTMLCanvasElement = document.getElementById('player') as HTMLCanvasElement;
let game: Game = new Game(canvas);
game.world.setLocation('Polana z grobem');

function updateGame() {
    requestAnimationFrame(updateGame);
    game.update();
}

requestAnimationFrame(updateGame);

addEventListener('cache:loading-finished', () => {
    console.log('all downloaded')
});

loadSprite('RYCERZ_16')