export default class Render {
    width: number;
    height: number;
    context: CanvasRenderingContext2D;

    constructor(canvas: HTMLCanvasElement) {
        this.width = canvas.width;
        this.height = canvas.height;
        this.context = canvas.getContext('2d')!;
    }

    drawRectangle(x: number, y: number, width: number, height: number, color: string): void {
        this.context.fillStyle = color;
        this.context.fillRect(x, y, width, height);
    }

    clear(): void {
        this.context.clearRect(0, 0, this.width, this.height);
        this.drawRectangle(0, 0, this.width, this.height, 'black');
    }
}