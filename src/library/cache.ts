import { triggerEvent } from "../events/main";
import { findSprite } from "./main";

export interface CacheElement {
    name: string;
    library?: string;
    sprite: number;
    image: HTMLImageElement;
    loaded: boolean;
    width: number;
    height: number;
};

const cache: CacheElement[] = [];

function checkFinishedLoading(): void {
    let finished: boolean = cache.every(element => element.loaded);
    if(finished) triggerEvent('cache:loading-finished');
}

export function loadSprite(name: string, library?: string, customCallback?: (this: HTMLImageElement, ev?: Event) => void): CacheElement | undefined {
    let sprite: number | undefined = findSprite(library, name);
    if(!sprite) sprite = findSprite(undefined, name);
    if(!sprite) {
        triggerEvent('game:addDebugText', `failed to load sprite "${library}/${name}"`);
        return undefined;
    }

    // if there is cache with this id, return it
    let element: CacheElement | undefined = cache.find(element => element.sprite == sprite);
    if(element) return element;
    let format: string = sprite >= 18291 ? 'jpg' : 'png';

    // add debug text
    triggerEvent('game:addDebugText', `downloading sprite "${library}/${name}"`);

    // create element
    element = {
        name: name,
        library: library,
        sprite: sprite,
        image: new Image(),
        loaded: false,
        width: 1,
        height: 1,
    }
    element.image.src = `graphics/${sprite}.${format}`;

    // load listeners
    if(customCallback) element.image.addEventListener('load', customCallback);
    element.image.addEventListener('load', function(this) {
        if(element) {
            element.loaded = true;
            element.width = this.width;
            element.height = this.height;

            triggerEvent('game:addDebugText', `loaded sprite "${library}/${name}"`);
            checkFinishedLoading();
        }
    });

    // push to the cache
    cache.push(element);

    return element;
}