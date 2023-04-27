import { addEventListener } from "../events/main";
import Input from "../input/main";
import Render from "../render/main";
import { World } from "../world/main";

interface LoadingScreenState {
    visible: boolean;
};

export default class Game {
    render: Render;
    world: World;
    input: Input;
    debugText: string[] = [];
    canvas: HTMLCanvasElement;

    loadingScreen: LoadingScreenState = {
        visible: false
    };

    constructor(canvas: HTMLCanvasElement) {
        this.render = new Render(canvas);
        this.world = new World();
        this.input = new Input(canvas);
        this.canvas = canvas;

        // Loading screen
        addEventListener('loading:toggleLoadingScreen', this.handleLoadingScreen.bind(this));
        addEventListener('game:addDebugText', this.handleDebugText.bind(this));
        addEventListener('cache:loading-finished', this.handleLoadingFinished.bind(this));
    }

    private handleLoadingScreen(this: this, visible: boolean): void {
        this.loadingScreen.visible = visible;
    }

    private handleDebugText(this: this, text: string): void {
        this.debugText.push(text);
    }

    private handleLoadingFinished(this: this): void {
        if(!this.loadingScreen.visible) return;
        this.loadingScreen.visible = false;
    }

    update(deltaTime: number): void {
        // clear the canvas
        this.render.clear();

        // loading screen
        if(this.loadingScreen.visible) {
            let c = 0;
            for(let text of ['Loading...', ...this.debugText]) {
                this.render.drawText(text, 20, 20 + (c++ * 15), 'white', 'left', 'top', '11px monospace');
            }
            return;
        }

        // update world
        this.world.update(deltaTime, this.render, this.input);

        // render world
        this.world.render(this.render);
    }
}