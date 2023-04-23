import animationsData from './animations.json';
import { Animation as AnimationType } from './types';
const animations: AnimationType[] = animationsData as unknown as AnimationType[];

export class Animation {
    name: string;
    frame: number = 0;
    cycle: number = 0;

    // last keyframe change timestamp
    private updateTimestamp: Date = new Date();

    constructor(name: string) {
        this.name = name;
    }
}