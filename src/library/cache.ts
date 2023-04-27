import { triggerEvent } from "../events/main";
import { findSprite } from "./main";

export interface CacheElement {
    name: string;
    library?: string;
    sprite: number;
    image: HTMLImageElement;
    loaded: boolean;
    downloading: boolean;
    width: number;
    height: number;
    src: string;
};

let cache: CacheElement[] = [];

function checkFinishedLoading(): void {
    let progress: number = cache.filter(element => element.loaded).length / cache.length;
    triggerEvent('loading:setProgress', progress);

    let finished: boolean = cache.every(element => element.loaded);
    if(finished) triggerEvent('cache:loading-finished');
}

function checkQueue(): void {
    let downloadingAnything: boolean = cache.some(element => element.downloading && !element.loaded);
    if(downloadingAnything) return;

    let next: CacheElement | undefined = cache.find(element => !element.loaded && !element.downloading);
    if(!next) return;

    next.downloading = true;
    next.image.src = next.src;
    triggerEvent('game:addDebugText', `downloading sprite "${next.library}/${next.name}"`);
    triggerEvent('loading:setText', `downloading "${next.library}/${next.name}"`);
}

export function unloadSprite(element: string | CacheElement): void {
    let finalElement: CacheElement | undefined;
    if(typeof element == 'string') finalElement = cache.find(cache => cache.name == element);
    else finalElement = element;
    if(!finalElement) return;

    triggerEvent('game:addDebugText', `unloaded sprite "${finalElement.library}/${finalElement.name}"`);

    finalElement.image.remove();
    cache = cache.filter(cache => cache != finalElement);
    finalElement = undefined;
}

export function loadSprite(name: string, library?: string, customCallback?: CallableFunction): CacheElement | undefined {
    let result: [number, string] | undefined = findSprite(library, name);
    if(!result) result = findSprite(undefined, name);
    if(!result) {
        triggerEvent('game:addDebugText', `failed to load sprite "${library}/${name}"`);
        return undefined;
    }
    let sprite: number = result[0];
    library = result[1];

    // if there is cache with this id, return it
    let element: CacheElement | undefined = cache.find(element => element.sprite == sprite);
    if(element) return element;
    let format: string = sprite >= 18291 ? 'jpg' : 'png';

    // add debug text
    triggerEvent('game:addDebugText', `queued sprite "${library}/${name}"`);

    // create element
    element = {
        name: name,
        library: library,
        sprite: sprite,
        image: new Image(),
        loaded: false,
        width: 1,
        height: 1,
        downloading: false,
        src: `graphics/${sprite}.${format}`
    }

    checkQueue();

    // load listeners
    if(customCallback) element.image.addEventListener('load', function(this, event) {
        customCallback(this, event);
    });
    
    element.image.addEventListener('load', function(this) {
        if(element) {
            element.loaded = true;
            element.width = this.width;
            element.height = this.height;

            triggerEvent('game:addDebugText', `loaded sprite "${library}/${name}"`);
            checkQueue();
            checkFinishedLoading();
        }
    });

    // push to the cache
    cache.push(element);

    return element;
}