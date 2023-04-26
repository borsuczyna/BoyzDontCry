import { BackgroundAnimation, LocationElements, Location, LocationPosition, Layer, Hotpoint } from './types';
import locationsData from './data/locations.json';
import positionsData from './data/positions.json';
import { loadSprite } from '../library/cache';
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
    layers: LocationElements<Layer> = emptyLocationElements<Layer>();
    hotpoints: LocationElements<Hotpoint> = emptyLocationElements<Hotpoint>();
    backgroundAnimations: LocationElements<BackgroundAnimation> = emptyLocationElements<BackgroundAnimation>();

    // Loading locations
    private getLocationByName(name: string): Location | undefined {
        return locations.find(location => location.name === name);
    }

    private loadLayers(layers: LocationElements<Layer>): void {
        this.layers = layers;
        
        for(let layer of layers.elements) {
            let success: boolean = loadSprite(layer.name, this.location, (ev) => {
                triggerEvent('game:addDebugText', `loaded layer "${layer.name}"`);
            });
            triggerEvent('game:addDebugText', success ? `layer "${layer.name}" queued` : `failed to queue layer "${layer.name}"`);
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
}