import bg from "!!file-loader!./images/bg.jpg";
import bird from "!!file-loader!./images/bird.png";
import bird_up from "!!file-loader!./images/bird_up.png";
import bird_down from "!!file-loader!./images/bird_down.png";
import pipe from "!!file-loader!./images/pipe.png";
import pipe_up from "!!file-loader!./images/pipe_up.png";
import pipe_down from "!!file-loader!./images/pipe_down.png";
import Util from "./util";
import Menus from "./ui/menus";
import Logger, { AlertLogOutput, ConsoleLogOutput, Level } from "./Logger";
import CancellationTokenSource, {
    CancellationToken,
} from "./CancellationTokenSource";
import getCursorPosition from "./canvas/getCursorPosition";
import Rect2D from "./canvas/Rect2D";
import Pipe, { PipeConstants } from "./Pipe";

export const logger = new Logger(
    new ConsoleLogOutput(
        process.env.NODE_ENV === "production" ? Level.OFF : Level.ALL,
        process.env.NODE_ENV === "production" ? Level.OFF : Level.INFO,
        Level.WARN,
        Level.ERROR
    ),
    new AlertLogOutput(
        process.env.NODE_ENV === "production" ? Level.OFF : Level.FATAL
    )
);

const canvas = <HTMLCanvasElement>document.getElementById("main");
const ctx = canvas.getContext("2d");

export const Bird: Rect2D = new Rect2D(20, 50, 32, 32);
const gravity = 1; // gravity in pixels/frame, 60 fps
const jumpHeight = 1; // pixels/frame
export const floorY = 475;
let jumpCountDown = 0; // frames
let pipeCooldown = 300; // frames, initialize with 5 secs
const scrollX = 1; // pixels/frame

export const pipes: Pipe[] = [];

export const images: Map<string, HTMLImageElement> = new Map();

export let score = 0;

let JumpCST: CancellationTokenSource;

async function main() {
    const pressStart = new FontFace(
        "PressStart2P",
        'url("https://fonts.gstatic.com/s/pressstart2p/v8/e3t4euO8T-267oIAQAu6jDQyK3nVivNm4I81.woff2")'
    );

    document.fonts.add(await pressStart.load());

    logger.log(Level.INFO, "font loaded");

    images.set("bg", await Util.getImage(bg));
    logger.log(Level.INFO, "bg loaded");

    images.set("bird", await Util.getImage(bird));
    logger.log(Level.INFO, "bird loaded");
    images.set("bird_up", await Util.getImage(bird_up));
    logger.log(Level.INFO, "bird_up loaded");
    images.set("bird_down", await Util.getImage(bird_down));
    logger.log(Level.INFO, "bird_down loaded");

    images.set("pipe", await Util.getImage(pipe));
    logger.log(Level.INFO, "pipe loaded");
    images.set("pipe_up", await Util.getImage(pipe_up));
    logger.log(Level.INFO, "pipe_up loaded");
    images.set("pipe_down", await Util.getImage(pipe_down));
    logger.log(Level.INFO, "pipe_down loaded");

    canvas.addEventListener("click", (e) => {
        const click = getCursorPosition(canvas, e);
        logger.log(Level.DEBUG, `Click detected at `, click);
    });
    logger.log(Level.TRACE, "Click listener added.");

    await Menus.MainMenu(ctx);

    JumpCST = new CancellationTokenSource();
    bindJump(JumpCST.getToken());

    window.requestAnimationFrame(draw);
}
main().catch(console.error);

function bindJump(token: CancellationToken) {
    canvas.addEventListener("click", (e: MouseEvent) => {
        if (token.isCancellationRequested()) {
            return;
        }
        e.preventDefault();
        logger.log(Level.TRACE, "Jumped");
        jumpCountDown = 20;
    });
    document.body.addEventListener("keydown", (e: KeyboardEvent) => {
        if (token.isCancellationRequested()) {
            return;
        }
        logger.log(Level.TRACE, "Jumped");
        jumpCountDown = 20;
    });
}

function draw() {
    if (Bird.y + Bird.height >= floorY) {
        logger.log(Level.INFO, "game over, reason: floor");
        return gameOver();
    }

    reset();

    if (Bird.y < 0) {
        Bird.y = 0;
    }

    if (--pipeCooldown <= 0) {
        pipeCooldown = 120; // frames = 1 secs
        pipes.push(new Pipe(1000, Util.randomInt(floorY - 128, 64)));
    }

    const deleteIndexes = [];
    let ded = false; // to draw all the pipes
    for (let i = 0; i < pipes.length; i++) {
        const pipe = pipes[i];
        pipe.scroll(scrollX);
        if (pipe.x + PipeConstants.PIPE_WIDTH <= -10) {
            deleteIndexes.push(i);
            continue;
        }
        if (pipe.inFrame(canvas)) {
            pipe.render(ctx);
            // collision detection
            if (pipe.detectCollision(Bird, -10)) {
                logger.log(Level.INFO, "game over, reason: pipe");
                ded = true;
            }
            if (!pipe.passedThrough && Bird.x > pipe.x + PipeConstants.WIDTH) {
                logger.log(Level.INFO, "Score increased");
                score++;
                pipe.passedThrough = true;
            }
        }
    }

    ctx.fillStyle = "black";
    ctx.font = "50px PressStart2P";
    ctx.fillText(
        score.toString(),
        Util.center(score.toString(), canvas, 50),
        100
    );

    // draw bird on top of pipes
    if (--jumpCountDown >= 10) {
        ctx.drawImage(images.get("bird_up"), Bird.x, Bird.y);
        Bird.y -= jumpHeight;
    } else if (jumpCountDown > 0) {
        ctx.drawImage(images.get("bird"), Bird.x, Bird.y);
        Bird.y -= jumpHeight;
    } else {
        ctx.drawImage(images.get("bird_down"), Bird.x, Bird.y);
        Bird.y += gravity;
    }

    if (ded) {
        return gameOver();
    }

    window.requestAnimationFrame(draw);
}

export function reset() {
    ctx.drawImage(images.get("bg"), 0, 0, 256, 512);
}

function gameOver() {
    JumpCST.cancel();

    Menus.GameOverMenu(ctx).then(() => {
        logger.log(Level.INFO, "Game restarted, resetting variables...");

        Bird.set(new Rect2D(20, 50, 32, 32));

        jumpCountDown = 0; // frames
        pipeCooldown = 300; // frames, initialize with 5 secs

        score = 0;

        pipes.length = 0;

        JumpCST = new CancellationTokenSource();
        bindJump(JumpCST.getToken());

        logger.log(Level.INFO, "Game restarted successfully.");

        window.requestAnimationFrame(draw);
    });
}
