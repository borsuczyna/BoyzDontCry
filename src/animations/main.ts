import { CacheElement, loadSprite } from '../library/cache';
import Render from '../render/main';
import animationsData from './animations.json';
import { Animation as AnimationType, Cycle } from './types';
const animations: AnimationType[] = animationsData as unknown as AnimationType[];

function dof02(n: number): string {
    if(n < 10) return `0${n}`;
    return `${n}`;
}

export class Animation {
    name: string;
    frame: number = 0;
    cycle: number = 0;
    
    // last keyframe change timestamp
    private updateTimestamp: Date = new Date();
    private data: AnimationType;
    private cacheArray: CacheElement[] = [];

    private findAnimationByName(name: string): AnimationType | undefined {
        return animations.find(animation => animation.name === name);
    }

    private loadSprites() {
        for(let cycle of this.data.cycles) {
            for(let sprite of cycle.frames) {
                let cache: CacheElement | undefined = loadSprite(`${this.name}_${dof02(sprite+1)}.PNG`);
                if(!cache) throw new Error(`sprite "${this.name}_${dof02(sprite+1)}.PNG" failed to load for animation "${this.name}"`);
                this.cacheArray[sprite] = cache;
            }
        }
    }

    update() {

    }

    getFrame(): number {
        let currentCycle: Cycle = this.data.cycles[this.cycle];
        let frame: number = currentCycle.frames[this.frame] || 0;
        return frame;
    }

    draw(render: Render, x: number, y: number, z: number, scale: number = 1, cache: CacheElement[]) {
        let frame: number = this.getFrame();
        render.drawSprite3D(x, y, z, cache[frame]);
    }

    constructor(name: string, cacheArray: CacheElement[]) {
        let animation = this.findAnimationByName(name);
        if(!animation) throw new Error(`animation ${name} not found`);

        this.name = name;
        this.data = animation;
        this.cacheArray = cacheArray;
        this.loadSprites();
    }
}