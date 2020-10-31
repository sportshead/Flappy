import CancellationTokenSource from "../CancellationTokenSource";
import Rect2D from "../canvas/Rect2D";
import Size2D from "../canvas/Size2D";
import { Bird, images, pipes, reset, score } from "../index";
import Util from "../util";
import Button from "./button";

export default class Menus {
    static async MainMenu(ctx: CanvasRenderingContext2D): Promise<void> {
        reset();

        const cts = new CancellationTokenSource();

        const play = new Button(
            new Rect2D(20, 220, 220, 70),
            "PLAY",
            "play",
            5,
            "black",
            "blue",
            "50px",
            new Size2D(15, 60)
        );

        const pressed = await Promise.race([play.render(ctx, cts.getToken())]);

        cts.cancel();

        if (pressed === "play") {
            return;
        }
    }

    static async GameOverMenu(ctx: CanvasRenderingContext2D): Promise<void> {
        reset();

        for (let i = 0; i < pipes.length; i++) {
            const pipe = pipes[i];
            if (pipe.inFrame(ctx.canvas)) {
                pipe.render(ctx);
            }
        }

        ctx.drawImage(images.get("bird"), Bird.x, Bird.y);

        ctx.font = "25px PressStart2P";
        ctx.fillStyle = "black";
        ctx.fillText("GAME OVER", 15, 70);
        ctx.fillText(
            `SCORE: ${score}`,
            Util.center(`SCORE: ${score}`, ctx.canvas, 25),
            120
        );

        const cts = new CancellationTokenSource();

        const playAgain = new Button(
            new Rect2D(20, 220, 220, 50),
            "PLAY AGAIN",
            "playAgain",
            5,
            "black",
            "blue",
            "20px",
            new Size2D(10, 35)
        );

        const share = new Button(
            new Rect2D(30, 310, 200, 50),
            "SHARE",
            "share",
            5,
            "black",
            "blue",
            "35px",
            new Size2D(15, 45)
        );

        const pressed = await Promise.race([
            playAgain.render(ctx, cts.getToken()),
            share.render(ctx, cts.getToken()),
        ]);

        cts.cancel();

        if (pressed === "playAgain") {
            return;
        } else if (pressed === "share") {
            // figure out how to share it
            return await this.GameOverMenu(ctx);
        }
    }
}
