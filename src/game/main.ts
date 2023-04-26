import { addEventListener } from "../events/main";
import { loadSprite } from "../library/cache";
import Render from "../render/main";
import { World } from "../world/main";

interface LoadingScreenState {
    visible: boolean;
};

export default class Game {
    render: Render;
    world: World;
    debugText: string[] = [];

    loadingScreen: LoadingScreenState = {
        visible: false
    };

    constructor(canvas: HTMLCanvasElement) {
        this.render = new Render(canvas);
        this.world = new World();

        // Loading screen
        addEventListener('loading:toggleLoadingScreen', this.handleLoadingScreen.bind(this));
        addEventListener('game:addDebugText', this.handleDebugText.bind(this));
    }

    private handleLoadingScreen(this: this, visible: boolean): void {
        this.loadingScreen.visible = visible;
    }

    private handleDebugText(this: this, text: string): void {
        this.debugText.push(text);
    }

    update(): void {
        // clear the canvas
        this.render.clear();

        // loading screen
        if(this.loadingScreen.visible) {
            let c = 0;
            for(let text of ['Loading...', ...this.debugText]) {
                this.render.drawText(text, 20, 20 + (c++ * 15), 'white', 'left', 'top', '12px monospace');
            }
            return;
        }
    }
}