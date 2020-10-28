export default class Point2D {
    x: number;
    y: number;

    constructor(point: Point2D);
    constructor(x?: number, y?: number);
    constructor(arg1: any = 0, arg2: number = 0) {
        if (typeof arg1 === "number") {
            this.x = arg1;
            this.y = arg2;

            this.init();
        } else if (arg1 instanceof Point2D) {
            const { x, y } = arg1;
            this.x = x;
            this.y = y;

            this.init();
        }
    }

    init() {}

    set(...args: [point: Point2D] | [x: number, y: number]): Point2D {
        if (typeof args[0] === "number") {
            this.x = args[0];
            this.y = args[1];
        } else if (args[0] instanceof Point2D) {
            const { x, y } = args[0];
            this.x = x;
            this.y = y;
        }
        return this;
    }
}
