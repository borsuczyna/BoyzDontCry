import { Animation, Cycle, Point } from '../animations/types';
import worlds from './worlds.json';

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

function hasAnyDifferent(object: Object, valid: string[]): boolean | string {
    for(let key of Object.keys(object)) {
        if(!valid.includes(key)) {
            return key;
        }
    }

    return false;
}

// @ts-ignore
let newWorlds: World[] = worlds.Locations.Location.map(world => {
    // console.log(typeof world.Layers.Layer)
    
    if(!Array.isArray(world.Layers.Layer)) world.Layers.Layer = [world.Layers.Layer];
    if(!Array.isArray(world.Hotpoints.Hotpoint)) world.Hotpoints.Hotpoint = [world.Hotpoints.Hotpoint];
    
    // @ts-ignore
    if(typeof world.BackgroundAnimations.BackgroundAnimation == 'undefined') world.BackgroundAnimations.BackgroundAnimation = [];
    if(!Array.isArray(world.BackgroundAnimations.BackgroundAnimation)) world.BackgroundAnimations.BackgroundAnimation = [world.BackgroundAnimations.BackgroundAnimation];

    return {
        name: world._attributes.name,
        logicMap: world._attributes.GameLogicMap,
        layers: {
            size: parseInt(world.Layers.Size._attributes.Size),
            elements: world.Layers.Layer.map(layer => {
                return {
                    name: layer._attributes.name,
                    background: layer._attributes.Background == '1',
                    x: parseInt(layer.Position._attributes.x),
                    y: parseInt(layer.Position._attributes.y),
                    depth: parseInt(layer.Depth._attributes.z)
                };
            }),
        },
        hotpoints: {
            size: parseInt(world.Hotpoints.Size._attributes.Size),
            elements: world.Hotpoints.Hotpoint.map(hotpoint => {
                return {
                    id: hotpoint._attributes.id,
                    name: hotpoint._attributes.name,
                    x: parseInt(hotpoint._attributes.x),
                    y: parseInt(hotpoint._attributes.y),
                    z: parseInt(hotpoint._attributes.z),
                    visible: hotpoint._attributes.Visible == '1',
                    bitmap: hotpoint._attributes.bitmap,
                    // @ts-ignore
                    idleAnimation: hotpoint._attributes.idle_animation,
                };
            }),
        },
        backgroundAnimations: {
            size: parseInt(world.BackgroundAnimations.Size._attributes.Size),
            elements: world.BackgroundAnimations.BackgroundAnimation.map(backgroundAnimation => {
                let cycles: Cycle[] = [];

                if(!Array.isArray(backgroundAnimation.Animation.Cycle)) backgroundAnimation.Animation.Cycle = [backgroundAnimation.Animation.Cycle];
                cycles = backgroundAnimation.Animation.Cycle.map(cycle => {
                    return {
                        frames: cycle._attributes.frames.split(' ').filter(frame => frame != '').map(frame => parseInt(frame)),
                        repeat: parseInt(cycle._attributes.repeat),
                    };
                });

                return {
                    name: backgroundAnimation._attributes.name,
                    x: parseInt(backgroundAnimation._attributes.x),
                    y: parseInt(backgroundAnimation._attributes.y),
                    z: parseInt(backgroundAnimation._attributes.z),
                    
                    animation: {
                        name: backgroundAnimation._attributes.name,
                        fps: parseInt(backgroundAnimation.Animation._attributes.fps),

                        offset: {
                            startX: parseInt(backgroundAnimation.Animation._attributes.StartOffsetX),
                            startY: parseInt(backgroundAnimation.Animation._attributes.StartOffsetY),
                            endX: parseInt(backgroundAnimation.Animation._attributes.EndOffsetX),
                            endY: parseInt(backgroundAnimation.Animation._attributes.EndOffsetY),
                            startTop: parseInt(backgroundAnimation.Animation._attributes.StartTop),
                            endTop: parseInt(backgroundAnimation.Animation._attributes.EndTop)
                        },

                        popup: {
                            x: parseInt(backgroundAnimation.Animation._attributes.PopupX),
                            y: parseInt(backgroundAnimation.Animation._attributes.PopupY),
                            direction: parseInt(backgroundAnimation.Animation._attributes.PopupDirection),
                        },

                        size: parseInt(backgroundAnimation.Animation.Size._attributes.Size),
                        cycles: cycles,
                        points: []
                    }
                };
            }),
        },
        miscelaneous: {
            objectsScalingFactor: parseFloat(world.Miscelaneous._attributes.objectsScalingFactor),
            musicVolume: parseInt(world.Miscelaneous._attributes.MusicVolume || '100'),
            backgroundSFXVolume: parseInt(world.Miscelaneous._attributes.BackgroundSFXVolume || '100'),
        },
    } as World
});
console.log(worlds.Locations.Location)
console.log(newWorlds)