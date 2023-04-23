import animationsData from './animations.json';
const animations: Animation[] = animationsData as unknown as Animation[];

export class Animation {
    private updateTimestamp: Date = new Date();
    name: string;

    

    constructor(name: string) {
        this.name = name;
    }
}