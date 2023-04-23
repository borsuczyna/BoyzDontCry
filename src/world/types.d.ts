import { Animation } from '../animations/types';

interface Layer {
    name: string;
    background: boolean;
    x: number;
    y: number;
    depth: number;
}

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

interface World {
    name: string;
    logicMap: string;

    layers: {
        size: number;
        elements: Layer[];
    };

    hotpoints: {
        size: number;
        elements: Hotpoint[];
    };

    backgroundAnimations: {
        size: number;
        elements: BackgroundAnimation[];
    };

    miscelaneous: {
        objectsScalingFactor: number;
        musicVolume: number;
        backgroundSFXVolume: number;
    };
};