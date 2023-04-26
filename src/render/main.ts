import { CacheElement } from "../library/cache";

enum QueueType {
    Sprite
};

interface QueueElement {
    x: number;
    y: number;
    z: number;
    cache: CacheElement;
    type: QueueType;
};

export default class Render {
    width: number;
    height: number;
    context: CanvasRenderingContext2D;
    queue: QueueElement[] = [];

    constructor(canvas: HTMLCanvasElement) {
        this.width = canvas.width;
        this.height = canvas.height;
        this.context = canvas.getContext('2d')!;
    }

    drawRectangle(x: number, y: number, width: number, height: number, color: string = 'black'): void {
        this.context.fillStyle = color;
        this.context.fillRect(x, y, width, height);
    }

    drawText(text: string, x: number, y: number, color: string = 'string', alignX: CanvasTextAlign = 'left', alignY: CanvasTextBaseline = 'top', font: string = '15px Arial'): void {
        this.context.fillStyle = color;
        this.context.textAlign = alignX;
        this.context.textBaseline = alignY;
        this.context.font = font;
        this.context.fillText(text, x, y);
    }

    drawImage(x: number, y: number, width: number, height: number, cache: CacheElement): void {
        // cache.width, cache.height is number
        this.context.drawImage(cache.image, x, y, width, height);
    }

    clear(): void {
        this.queue = [];

        this.context.clearRect(0, 0, this.width, this.height);
        this.drawRectangle(0, 0, this.width, this.height, 'black');
    }

    drawSprite3D(x: number, y: number, z: number, cache: CacheElement): void {
        this.queue.push({
            x: x,
            y: y,
            z: z,
            cache: cache,
            type: QueueType.Sprite
        });
    }

    draw3DElements(): void {
        this.queue.sort((a, b) => a.z - b.z).forEach(element => {
            if (element.type === QueueType.Sprite) {
                this.drawImage(element.x, element.y, element.cache.width, element.cache.height, element.cache);
            }
        });
    }
}