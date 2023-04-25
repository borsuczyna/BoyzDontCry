import graphicsData from './graphics.json';
const graphics = graphicsData as unknown as GraphicsData;

export type Sprite = [string, number];
interface GraphicsData {
    [library: string]: Sprite[];
};

// just remove .png and .jpg from animation name
export function clearAnimationName(animation: string): string {
    return animation.replaceAll('.PNG', '').replaceAll('.JPG', '');
}

export function findSprite(library: string | undefined, targetAnimation: string): number | undefined {
    // if there's no library, try to find it in any library
    if(!library) {
        for(let library in graphics) {
            let sprite: number | undefined = findSprite(library, targetAnimation);
            if(sprite) return sprite;
        }

        return undefined;
    }

    // if library with given name doesn't exist, return undefined
    if(!graphics[library]) return undefined;

    // if there's a library with given name, try to find the sprite in it
    let libraryData: Sprite[] | undefined = graphics[library];
    if(!libraryData) return undefined;

    for(let animation of libraryData) {
        if(clearAnimationName(animation[0]) == clearAnimationName(targetAnimation)) {
            return animation[1];
        }
    }
    
    return undefined;
}