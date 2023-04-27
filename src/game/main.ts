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

    loadingScreen: LoadingScreenState = {
        visible: false
    };

    constructor(canvas: HTMLCanvasElement) {
        this.render = new Render(canvas);
        this.world = new World();
        this.input = new Input(canvas);

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

    update(): void {
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

        // render world
        this.world.render(this.render);

        // test
        this.render.drawRectangle(100, 100, 100, 100, 'black');

        let time: number | undefined = this.input.getHoldingTimeInPosition(100, 100, 100, 100);
        if(time) {
            let progress = (performance.now() - time)/500;
            let alpha = Math.min(1, progress * 3);
            let position: [number, number] = this.input.getTouchOrMousePosition();
            this.render.drawCircle(position[0], position[1], 20, 10, 0, progress * 360, `rgba(255, 255, 255, ${alpha})`);
        }
    }
}