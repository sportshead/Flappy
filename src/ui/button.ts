import { CancellationToken } from "../CancellationTokenSource";
import detectRectCollision from "../canvas/collision";
import Rect2D from "../canvas/Rect2D";
import Size2D from "../canvas/Size2D";
import roundRect, { RoundRectRadius } from "../canvas/roundRect";
import Util from "../util";
import getCursorPosition from "../canvas/getCursorPosition";
import { logger } from "..";
import { Level } from "../Logger";

export default class Button {
    id: string;
    constructor(
        public rectangle: Rect2D,
        public text: string,
        id?: string,
        public radius?: number | RoundRectRadius,
        public color?: string,
        public bgColor?: string,
        public fontSize?: string,
        public textMargin: Size2D = new Size2D(5, 5)
    ) {
        this.id = id ?? text;
    }

    /** @throws {OperationCanceledException} if isCancellationRequested is true */
    async render(
        ctx: CanvasRenderingContext2D,
        ct: CancellationToken
    ): Promise<string> {
        ct.throwIfCancellationRequested();
        this.bgColor ? (ctx.fillStyle = this.bgColor) : 0;
        const rect = this.rectangle;
        logger.debug(rect);
        this.radius
            ? roundRect(
                  ctx,
                  rect.x,
                  rect.y,
                  rect.width,
                  rect.height,
                  this.radius,
                  true,
                  false
              )
            : ctx.fillRect(rect.x, rect.y, rect.width, rect.height);

        this.fontSize ? (ctx.font = `${this.fontSize} PressStart2P`) : 0;
        this.color ? (ctx.fillStyle = this.color) : 0;
        ctx.fillText(
            this.text,
            rect.x + this.textMargin.width,
            rect.y + this.textMargin.height
        );

        const e = <MouseEvent>(
            await Util.promiseEventListener(ctx.canvas, "click")
        );
        ct.throwIfCancellationRequested();
        const clickPos = getCursorPosition(ctx.canvas, e);
        logger.debug(clickPos);
        if (detectRectCollision(rect, new Rect2D(clickPos), 5)) {
            logger.debug(`${this.id} clicked`);
            return this.id;
        } else {
            return await this.render(ctx, ct);
        }
    }
}
