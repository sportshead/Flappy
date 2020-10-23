export default class Point2D {
    constructor(public x: number = 0, public y: number = 0) {}

    set(x: number, y: number) {
        this.x = x;
        this.y = y;
    }
}
