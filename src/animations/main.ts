import animations from './animations.json';

interface Cycle {
    frames: number[];
    repeat: number;
};

interface Point {
    x: number;
    y: number;
};

interface Animation {
    name: string;
    fps: number;

    offset: {
        startX: number;
        startY: number;
        endX: number;
        endY: number;
        startTop: number;
        endTop: string;
    };

    popup: {
        x: number;
        y: number;
        direction: number;
    };

    size: number;
    cycles: Cycle[];
    points: Point[];
};