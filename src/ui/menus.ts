import CancellationTokenSource from "../CancellationTokenSource";
import Rect2D from "../canvas/Rect2D";
import Size2D from "../canvas/Size2D";
import BirdFacts from "../facts";
import { Bird, images, logger, pipes, reset, score } from "../index";
import { Level } from "../Logger";
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

    private static facts = new BirdFacts();

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

        ctx.font = "10px PressStart2P";
        ctx.fillStyle = "black";

        const fact = this.facts.getFact().split("\n");
        ctx.fillText(fact[0], Util.center(fact[0], ctx.canvas, 10), 150);
        if (fact.length > 1) {
            ctx.fillText(fact[1], Util.center(fact[1], ctx.canvas, 10), 170);
        }
        if (fact.length > 2) {
            ctx.fillText(fact[2], Util.center(fact[2], ctx.canvas, 10), 190);
        }
        if (fact.length > 3) {
            ctx.fillText(fact[3], Util.center(fact[3], ctx.canvas, 10), 210);
        }

        const cts = new CancellationTokenSource();

        const playAgain = new Button(
            new Rect2D(20, 250, 220, 50),
            "PLAY AGAIN",
            "playAgain",
            5,
            "black",
            "blue",
            "20px",
            new Size2D(10, 35)
        );

        const share = new Button(
            new Rect2D(30, 340, 200, 50),
            "SHARE",
            "share",
            5,
            "black",
            "blue",
            "35px",
            new Size2D(15, 45)
        );

        const shareData: ShareData = {
            title: "Flappy Bird",
            text: `I got ${score} points in flappy bird!`,
            url: window.location.href,
        };

        const pressed = await Promise.race([
            playAgain.render(ctx, cts.getToken()),
            navigator.share
                ? share.render(ctx, cts.getToken())
                : new Promise(() => {}),
        ]);

        cts.cancel();

        if (pressed === "playAgain") {
            return;
        } else if (pressed === "share") {
            // figure out how to share it
            try {
                await navigator.share(shareData);
            } catch (e) {
                logger.error(`Share failed with error`, e);
            }
            return await this.GameOverMenu(ctx);
        }
    }
}
