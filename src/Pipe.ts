import Point2D from "./canvas/Point2D";
import Rect2D from "./canvas/Rect2D";
import { floorY, images, logger } from "./index";
import { Level } from "./Logger";
export default class Pipe extends Point2D {
    static readonly PIPE_END = 44;
    static readonly PIPE_SIZE = 64;

    private topY: number;
    private bottomY: number;

    top: Rect2D;
    bottom: Rect2D;

    render(ctx: CanvasRenderingContext2D) {
        if (this.inFrame(ctx.canvas)) {
            logger.log(Level.TRACE, "Pipe rendering");
            ctx.drawImage(images.get("pipe_down"), this.x, this.y);
            ctx.drawImage(
                images.get("pipe"),
                this.top.x,
                this.top.y,
                this.top.width,
                this.y
            );
            logger.log(
                Level.TRACE,
                "Pipe successfully rendered at ",
                this.toPoint2D()
            );
        }
    }

    inFrame(canvas: HTMLCanvasElement): boolean {
        return this.x <= canvas.width;
    }

    toPoint2D(): Point2D {
        return new Point2D(this);
    }

    init() {
        this.topY = this.y + Pipe.PIPE_END;
        this.bottomY =
            this.y + Pipe.PIPE_SIZE + (Pipe.PIPE_SIZE - Pipe.PIPE_END);

        this.top = new Rect2D(this.x, 0, Pipe.PIPE_SIZE, this.topY);
        this.bottom = new Rect2D(
            this.x,
            this.bottomY,
            Pipe.PIPE_SIZE,
            floorY - this.bottomY
        );
    }
}
