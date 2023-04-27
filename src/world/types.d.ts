import { Animation } from '../animations/types';
import { CacheElement } from '../library/cache';

interface Layer {
    name: string;
    background: boolean;
    x: number;
    y: number;
    z: number;
};

interface Hotpoint {
    id: string;
    name: string;
    x: number;
    y: number;
    z: number;
    visible: boolean;
    bitmap?: string;
    idleAnimation?: string;
};

interface BackgroundAnimation {
    name: string;
    x: number;
    y: number;
    z: number;
    animation: Animation;
};

type ElementWithCache<T> = T & {
    cache?: CacheElement;
};

interface LocationElements<T> {
    size: number;
    elements: T[];
};

interface Location {
    name: string;
    logicMap: string;

    layers: LocationElements<Layer>;
    hotpoints: LocationElements<Hotpoint>;
    backgroundAnimations: LocationElements<BackgroundAnimation>;

    miscelaneous: {
        objectsScalingFactor: number;
        musicVolume: number;
        backgroundSFXVolume: number;
    };
};

interface LocationPosition {
    source: string;
    destination: string;
    fred: {
        x: number;
        y: number;
        direction: string;
    };
    grucha: {
        x: number;
        y: number;
        direction: string;
    };
}

interface LogicMap {
    width: number;
    height: number;
    cache: CacheElement;
};