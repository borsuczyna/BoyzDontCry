import Render from "../render/main";
import { World } from "../world/main";

export default class Game {
    render: Render;
    world: World;

    constructor(canvas: HTMLCanvasElement) {
        this.render = new Render(canvas);
        this.world = new World();
    }

    update(): void {
        // clear the canvas
        this.render.clear();
    }
}