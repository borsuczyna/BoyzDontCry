import { findSprite } from "./main";

interface CacheElement {
    name: string;
    library?: string;
    sprite: number;
    image: HTMLImageElement;
    loaded: boolean;
};

const cache: CacheElement[] = [];

function checkFinishedLoading(): void {
    let finished: boolean = cache.every(element => element.loaded);
    
}

export function loadSprite(name: string, library?: string): boolean {
    let sprite: number | undefined = findSprite(library, name);
    if(!sprite) return false;

    // if there is cache with this id, return it
    let element: CacheElement | undefined = cache.find(element => element.sprite == sprite);
    if(element) return true;

    element = {
        name: name,
        library: library,
        sprite: sprite,
        image: new Image(),
        loaded: false
    }
    element.image.src = `graphics/${sprite}.png`;
    element.image.addEventListener('load', function() {
        if(element) element.loaded = true;
    });

    cache.push(element);

    return true;
}