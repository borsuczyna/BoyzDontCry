import graphicsData from './graphics.json';
const graphics = graphicsData as unknown as GraphicsData;

export type Sprite = [string, number];
interface GraphicsData {
    [library: string]: Sprite[];
};

// just remove .png and .jpg from animation name
export function clearAnimationName(animation: string): string {
    return animation.toLowerCase().replaceAll('.png', '').replaceAll('.jpg', '');
}

export function findSprite(library: string | undefined, targetAnimation: string): [number, string] | undefined {
    // if there's no library, try to find it in any library
    if(!library) {
        for(let library in graphics) {
            let result = findSprite(library, targetAnimation);
            if(result) return result;
        }

        return undefined;
    }

    // if library with given name doesn't exist, return undefined
    library = library.toUpperCase();
    if(!graphics[library]) return undefined;

    // if there's a library with given name, try to find the sprite in it
    let libraryData: Sprite[] | undefined = graphics[library];
    if(!libraryData) return undefined;

    for(let animation of libraryData) {
        if(clearAnimationName(animation[0]) == clearAnimationName(targetAnimation)) {
            return [animation[1], library];
        }
    }
    
    return undefined;
}