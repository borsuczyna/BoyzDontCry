export interface Cycle {
    frames: number[];
    repeat: number;
};

export interface Point {
    x: number;
    y: number;
};

export interface Animation {
    name: string;
    fps: number;

    offset: {
        startX: number;
        startY: number;
        endX: number;
        endY: number;
        startTop: number;
        endTop: number;
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