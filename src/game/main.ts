import { addEventListener } from "../events/main";
import Input from "../input/main";
import Render from "../render/main";
import { World } from "../world/main";

interface LoadingScreenState {
    visible: boolean;
    progress: number;
    text: string;
};

export default class Game {
    render: Render;
    world: World;
    input: Input;
    debugText: string[] = [];
    canvas: HTMLCanvasElement;

    loadingScreen: LoadingScreenState = {
        visible: false,
        progress: 0,
        text: ''
    };

    constructor(canvas: HTMLCanvasElement) {
        this.render = new Render(canvas);
        this.world = new World();
        this.input = new Input(canvas);
        this.canvas = canvas;

        // Loading screen
        addEventListener('loading:toggleLoadingScreen', this.handleLoadingScreen.bind(this));
        addEventListener('loading:setProgress', this.handleLoadingScreenProgress.bind(this));
        addEventListener('loading:setText', this.handleLoadingScreenText.bind(this));
        addEventListener('game:addDebugText', this.handleDebugText.bind(this));
        addEventListener('cache:loading-finished', this.handleLoadingFinished.bind(this));
    }

    private handleLoadingScreen(this: this, visible: boolean): void {
        this.loadingScreen.visible = visible;
    }

    private handleLoadingScreenProgress(this: this, progress: number): void {
        this.loadingScreen.progress = progress;
    }

    private handleLoadingScreenText(this: this, text: string): void {
        this.loadingScreen.text = text;
    }

    private handleDebugText(this: this, text: string): void {
        this.debugText.push(text);
        if(this.debugText.length > 43) this.debugText.shift();
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
                this.render.drawText(text, 20, 20 + (c++ * 12), 'white', 'left', 'top', '10px monospace');
            }

            this.render.drawRectangle(this.canvas.width / 2 - 200, this.canvas.height - 25, 400, 8, '#aaaaaa');
            this.render.drawRectangle(this.canvas.width / 2 - 200, this.canvas.height - 25, 400 * this.loadingScreen.progress, 8, '#ffffff');
            this.render.drawText(this.loadingScreen.text, this.canvas.width / 2, this.canvas.height - 28, 'white', 'center', 'bottom', '10px monospace');

            return;
        }

        // update world
        this.world.update(deltaTime, this.render, this.input);

        // render world
        this.world.render(this.render);
    }
}