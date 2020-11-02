import detectRectCollision from "./canvas/collision";
import Point2D from "./canvas/Point2D";
import Rect2D from "./canvas/Rect2D";
import { floorY, images, logger } from "./index";
import { Level } from "./Logger";

export default class Pipe extends Point2D {
    top: Rect2D;
    topPipe: Rect2D;

    bottom: Rect2D;
    bottomPipe: Rect2D;

    passedThrough: boolean = false;

    inFrame(canvas: HTMLCanvasElement): boolean {
        return this.x <= canvas.width;
    }

    toPoint2D(): Point2D {
        return new Point2D(this);
    }

    init() {
        this.top = new Rect2D(
            this.x + PipeConstants.OFFSET,
            0,
            PipeConstants.PIPE_WIDTH,
            this.y
        );
        this.topPipe = new Rect2D(
            this.x,
            this.y,
            PipeConstants.WIDTH,
            PipeConstants.PIPE_HEIGHT
        );

        this.bottom = new Rect2D(
            this.x + PipeConstants.OFFSET,
            this.y +
                PipeConstants.PIPE_HEIGHT +
                PipeConstants.PIPE_HEIGHT +
                PipeConstants.PIPE_GAP,
            PipeConstants.PIPE_WIDTH,
            floorY -
                (this.y +
                    PipeConstants.PIPE_HEIGHT +
                    PipeConstants.PIPE_HEIGHT +
                    PipeConstants.PIPE_GAP)
        );
        this.bottomPipe = new Rect2D(
            this.x,
            this.y + PipeConstants.PIPE_HEIGHT + PipeConstants.PIPE_GAP,
            PipeConstants.WIDTH,
            PipeConstants.PIPE_HEIGHT
        );
    }

    detectCollision(target: Rect2D, margin?: number) {
        return (
            detectRectCollision(target, this.top, margin) ||
            detectRectCollision(target, this.topPipe, margin) ||
            detectRectCollision(target, this.bottom, margin) ||
            detectRectCollision(target, this.bottomPipe, margin)
        );
        return false;
    }

    render(ctx: CanvasRenderingContext2D) {
        logger.trace("Rendering", this);

        this.top.render(ctx, "#00ff66");
        this.topPipe.render(ctx, "#00d154");

        this.bottom.render(ctx, "#00ff66");
        this.bottomPipe.render(ctx, "#00d154");

        logger.trace("Render successful");
    }

    scroll(x: number) {
        logger.debug("Scrolling", this, "by", x, "px.");

        this.x -= x;

        this.top.x -= x;
        this.topPipe.x -= x;
        this.bottom.x -= x;
        this.bottomPipe.x -= x;
    }
}

export enum PipeConstants {
    WIDTH = 64,
    OFFSET = 12,
    PIPE_WIDTH = WIDTH - OFFSET * 2,
    PIPE_HEIGHT = 20,
    PIPE_GAP = 48,
}
