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
    canvas: HTMLCanvasElement;
    context: CanvasRenderingContext2D;
    queue: QueueElement[] = [];
    scale: number = 1;

    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
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

    drawCircle(x: number, y: number, size: number, borderWidth: number = size, startAngle: number = 0, sweepAngle: number = 360, color: string = 'black'): void {
        size = size - borderWidth/2;

        this.context.beginPath();
        this.context.arc(x, y, size, Math.PI * (startAngle - 180) / 180, Math.PI * (sweepAngle - 180) / 180);
        this.context.strokeStyle = color;
        this.context.lineWidth = borderWidth;
        this.context.stroke();
        this.context.closePath();
    }

    clear(): void {
        this.queue = [];
        
        let [width, height]: [number, number] = [this.canvas.width, this.canvas.height];
        this.scale = height/600;
        this.context.clearRect(0, 0, width, height);
        this.drawRectangle(0, 0, width, height, 'black');
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
                this.drawImage(element.x * this.scale, element.y * this.scale, element.cache.width * this.scale, element.cache.height * this.scale, element.cache);
            }
        });
    }
}