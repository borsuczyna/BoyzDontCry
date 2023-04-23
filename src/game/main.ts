import Render from "../render/main";

export default class Game {
    render: Render;

    constructor(canvas: HTMLCanvasElement) {
        // initialize render
        this.render = new Render(canvas);
    }

    update(): void {
        // clear the canvas
        this.render.clear();
    }
}