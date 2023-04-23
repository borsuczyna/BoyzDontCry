import graphicsData from './graphics.json';
const graphics = graphicsData as unknown as GraphicsData;

export type Sprite = [string, number];
interface GraphicsData {
    [library: string]: Sprite[];
};

export function clearAnimationName(animation: string): string {
    return animation.replaceAll('.PNG', '').replaceAll('.JPG', '');
}

export function findSprite(library: string | null, targetAnimation: string): number | undefined {
    if(!library) {
        for(let library in graphics) {
            let sprite: number | undefined = findSprite(library, targetAnimation);
            if(sprite) return sprite;
        }

        return undefined;
    }

    let libraryData: Sprite[] | undefined = graphics[library];
    if(!libraryData) return undefined;

    for(let animation of libraryData) {
        if(clearAnimationName(animation[0]) == clearAnimationName(targetAnimation)) {
            return animation[1];
        }
    }
    
    return undefined;
}