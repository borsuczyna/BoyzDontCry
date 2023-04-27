import { BackgroundAnimation, LocationElements, Location, LocationPosition, Layer, Hotpoint, ElementWithCache, LogicMap } from './types';
import locationsData from './data/locations.json';
import positionsData from './data/positions.json';
import { CacheElement, loadSprite, unloadSprite } from '../library/cache';
import Render from '../render/main';
import { triggerEvent } from '../events/main';
import Camera from '../camera/main';
import Input from '../input/main';
import { Animation } from '../animations/main';
const locations: Location[] = locationsData as unknown as Location[];
// const positions: LocationPosition[] = positionsData as unknown as LocationPosition[];

function emptyLocationElements<T>(): LocationElements<T> {
    return {
        size: 1,
        elements: []
    };
}

export class World {
    camera: Camera = new Camera();

    location: string = '';
    layers: LocationElements<ElementWithCache<Layer>> = emptyLocationElements<ElementWithCache<Layer>>();
    hotpoints: LocationElements<ElementWithCache<Hotpoint>> = emptyLocationElements<ElementWithCache<Hotpoint>>();
    backgroundAnimations: LocationElements<ElementWithCache<BackgroundAnimation>> = emptyLocationElements<ElementWithCache<BackgroundAnimation>>();
    logicMap: LogicMap | undefined;

    // Loading locations
    private getLocationByName(name: string): Location | undefined {
        return locations.find(location => location.name === name);
    }

    private loadLayers(layers: LocationElements<Layer>): void {
        this.layers = layers as LocationElements<ElementWithCache<Layer>>;
        
        for(let layer of this.layers.elements) {
            let element: CacheElement | undefined  = loadSprite(layer.name, this.location);
            if(!element) throw new Error(`failed to load layer: "${layer.name}"`);
            layer.cache = element;
        }
    }

    private loadHotpoints(hotpoints: LocationElements<Hotpoint>): void {
        this.hotpoints = hotpoints as LocationElements<ElementWithCache<Hotpoint>>;

        for(let hotpoint of this.hotpoints.elements) {
            if(hotpoint.bitmap) {
                let element: CacheElement | undefined = loadSprite(hotpoint.bitmap, this.location);
                if(!element) throw new Error(`failed to load hotpoint: "${hotpoint.id}"`);
                hotpoint.cache = element;
            } else if(hotpoint.idleAnimation) {
                hotpoint.cache = [];
                hotpoint.animation = new Animation(hotpoint.idleAnimation, hotpoint.cache as CacheElement[]);
            }
        }
    }

    private logicMapLoaded(this: this, image: HTMLImageElement) {
        if(!this.logicMap) return;

        this.logicMap.width = image.width;
        this.logicMap.height = image.height;
        this.camera.limits = [this.logicMap.width, this.logicMap.height];
    }
    
    private loadLogicMap(logicMap: string): void { 
        let element: CacheElement | undefined = loadSprite(logicMap, this.location, this.logicMapLoaded.bind(this));
        if(!element) throw new Error(`failed to load logic map: "${this.location}/${logicMap}"`);

        this.logicMap = {
            cache: element,
            width: 1,
            height: 1
        }
    }

    unloadLocation(): void {
        this.location = '';

        // unload all sprites
        for(let layer of this.layers.elements) unloadSprite(layer.cache! as CacheElement);

        this.layers = emptyLocationElements<Layer>();
        this.hotpoints = emptyLocationElements<Hotpoint>();
        this.backgroundAnimations = emptyLocationElements<BackgroundAnimation>();
        this.logicMap = undefined;
    }

    setLocation(name: string): void {
        this.unloadLocation();

        let location: Location | undefined = this.getLocationByName(name);
        if(!location) return;

        triggerEvent('loading:toggleLoadingScreen', true);
        triggerEvent('loading:setProgress', 0);

        this.location = name;
        this.loadLogicMap(location.logicMap);
        this.loadLayers(location.layers);
        this.loadHotpoints(location.hotpoints);
    }
    
    // update and render
    render(render: Render): void {
        if(!this.location) return;
        
        // layers
        for(let layer of this.layers.elements) {
            if(!layer.cache) continue;
            render.drawSprite3D(layer.x - this.camera.x, layer.y - this.camera.y, layer.z, layer.cache! as CacheElement);
        }

        // hotpoints
        for(let hotpoint of this.hotpoints.elements) {
            if(!hotpoint.cache) continue;
            if(hotpoint.bitmap) {
                render.drawSprite3D(hotpoint.x - this.camera.x, hotpoint.y - this.camera.y, hotpoint.z, hotpoint.cache! as CacheElement);
            } else if(hotpoint.animation) {
                hotpoint.animation.update();
                hotpoint.animation.draw(render, hotpoint.x - this.camera.x, hotpoint.y - this.camera.y, hotpoint.z, 1, hotpoint.cache! as CacheElement[]);
            }
        }

        // draw queued 3d elements
        render.draw3DElements();
    }

    update(deltaTime: number, render: Render, input: Input) {
        let [width, height, scale]: [number, number, number] = [render.canvas.width, render.canvas.height, render.scale];
        if(input.isKeyDown('ArrowLeft')) this.camera.x -= deltaTime/2;
        if(input.isKeyDown('ArrowRight')) this.camera.x += deltaTime/2;

        this.camera.x = Math.max(Math.min(this.camera.x, this.camera.limits[0] - width / scale), 0);
        this.camera.y = Math.max(Math.min(this.camera.y, this.camera.limits[1] - height / scale), 0);
    }
}