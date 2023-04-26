import { BackgroundAnimation, LocationElements, Location, LocationPosition, Layer, Hotpoint, ElementWithCache } from './types';
import locationsData from './data/locations.json';
import positionsData from './data/positions.json';
import { CacheElement, loadSprite } from '../library/cache';
import Render from '../render/main';
import { triggerEvent } from '../events/main';
const locations: Location[] = locationsData as unknown as Location[];
const positions: LocationPosition[] = positionsData as unknown as LocationPosition[];

function emptyLocationElements<T>(): LocationElements<T> {
    return {
        size: 1,
        elements: []
    };
}

export class World {
    location: string = '';
    layers: LocationElements<ElementWithCache<Layer>> = emptyLocationElements<ElementWithCache<Layer>>();
    hotpoints: LocationElements<ElementWithCache<Hotpoint>> = emptyLocationElements<ElementWithCache<Hotpoint>>();
    backgroundAnimations: LocationElements<ElementWithCache<BackgroundAnimation>> = emptyLocationElements<ElementWithCache<BackgroundAnimation>>();

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

    unloadLocation(): void {
        this.location = '';
        this.layers = emptyLocationElements<Layer>();
        this.hotpoints = emptyLocationElements<Hotpoint>();
        this.backgroundAnimations = emptyLocationElements<BackgroundAnimation>();
    }

    setLocation(name: string): void {
        this.unloadLocation();

        let location: Location | undefined = this.getLocationByName(name);
        if(!location) return;

        triggerEvent('loading:toggleLoadingScreen', true);

        this.location = name;
        this.loadLayers(location.layers);
    }

    render(render: Render): void {
        if(!this.location) return;

        for(let layer of this.layers.elements) {
            if(!layer.cache) continue;
            render.drawSprite3D(layer.x, layer.y, layer.z, layer.cache);
        }

        render.draw3DElements();
    }
}