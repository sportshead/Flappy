import Point2D from "./Point2D";

export default class Rect2D extends Point2D {
    width: number;
    height: number;

    constructor(rect: Rect2D);
    constructor(point: Point2D, width?: number, height?: number);
    constructor(x?: number, y?: number, width?: number, height?: number);
    constructor(
        arg1: any = 0,
        arg2: number = 0,
        arg3: number = 0,
        arg4: number = 0
    ) {
        if (typeof arg1 === "number") {
            super(arg1, arg2);
            this.width = arg3 === 0 ? 1 : arg3;
            this.height = arg4 === 0 ? 1 : arg4;
        } else if (arg1 instanceof Rect2D) {
            const { x, y, width, height } = arg1;
            super(x, y);
            this.width = width;
            this.height = height;
        } else if (arg1 instanceof Point2D) {
            super(arg1);
            this.width = arg2 === 0 ? 1 : arg2;
            this.height = arg3 === 0 ? 1 : arg3;
        }
    }

    set(
        ...args: [rect: Rect2D] | [point: Point2D] | [x: number, y: number]
    ): Point2D {
        if (typeof args[0] === "number") {
            this.x = args[0];
            this.y = args[1];
        } else if (args[0] instanceof Rect2D) {
            const { x, y, width, height } = args[0];
            this.x = x;
            this.y = y;
            this.width = width;
            this.height = height;
        } else if (args[0] instanceof Point2D) {
            const { x, y } = args[0];
            this.x = x;
            this.y = y;
        }
        return this;
    }

    toArray(): [x: number, y: number, width: number, height: number] {
        return [this.x, this.y, this.width, this.height];
    }

    render(
        ctx: CanvasRenderingContext2D,
        fill: boolean | (string | CanvasGradient | CanvasPattern) = true,
        stroke: boolean | (string | CanvasGradient | CanvasPattern) = false
    ) {
        if (typeof fill !== "boolean") {
            ctx.fillStyle = fill;
            fill = true;
        }
        if (typeof stroke !== "boolean") {
            ctx.strokeStyle = stroke;
            stroke = true;
        }
        ctx.beginPath();
        ctx.rect(...this.toArray());
        ctx.closePath();
        if (fill) {
            ctx.fill();
        }
        if (stroke) {
            ctx.stroke();
        }
    }
}
