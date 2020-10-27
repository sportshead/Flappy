export default class Size2D {
    width: number;
    height: number;

    constructor(point: Size2D);
    constructor(width?: number, height?: number);
    constructor(arg1: any = 0, arg2: number = 0) {
        if (typeof arg1 === "number") {
            this.width = arg1;
            this.height = arg2;
        } else if (arg1 instanceof Size2D) {
            const { width, height } = arg1;
            this.width = width;
            this.height = height;
        }
    }

    set(...args: [size: Size2D] | [width: number, height: number]): Size2D {
        if (typeof args[0] === "number") {
            this.width = args[0];
            this.height = args[1];
        } else if (args[0] instanceof Size2D) {
            const { width, height } = args[0];
            this.width = width;
            this.height = height;
        }
        return this;
    }
}
