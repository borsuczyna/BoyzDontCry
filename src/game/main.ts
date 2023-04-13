import Render from "./render";

export default class Game {
    render: Render;

    constructor(canvas: HTMLCanvasElement) {
        this.render = new Render(canvas);
    }

    update(): void {
        this.render.clear();
    }
}