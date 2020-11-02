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
import BirdFacts from "./facts";

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
const gravity = 1.5; // gravity in pixels/frame, 60 fps
const jumpHeight = 2.5; // pixels/frame
export const floorY = 475;
let jumpCountDown = 0; // frames
let jumping = false;
let pipeCooldown = 0; // frames
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

    logger.info("font loaded");

    images.set("bg", await Util.getImage(bg));
    logger.info("bg loaded");

    images.set("bird", await Util.getImage(bird));
    logger.info("bird loaded");
    images.set("bird_up", await Util.getImage(bird_up));
    logger.info("bird_up loaded");
    images.set("bird_down", await Util.getImage(bird_down));
    logger.info("bird_down loaded");

    images.set("pipe", await Util.getImage(pipe));
    logger.info("pipe loaded");
    images.set("pipe_up", await Util.getImage(pipe_up));
    logger.info("pipe_up loaded");
    images.set("pipe_down", await Util.getImage(pipe_down));
    logger.info("pipe_down loaded");

    canvas.addEventListener("click", (e) => {
        const click = getCursorPosition(canvas, e);
        logger.debug(`Click detected at `, click);
    });
    logger.trace("Click listener added.");

    canvas.addEventListener("selectstart", (e) => {
        e.preventDefault();
    });
    logger.trace("Selection disabled.");

    BirdFacts.init();
    logger.trace("Bird facts initialized.");

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
        logger.debug("Jumped");
        jumpCountDown = 20;
    });
    document.addEventListener("keydown", (e: KeyboardEvent) => {
        if (token.isCancellationRequested()) {
            return;
        }
        logger.debug("Keydown", e.code, "detected");
        if (e.code === "Space") {
            logger.debug("Jumping");
            jumping = true;
        }
    });
    document.addEventListener("keyup", (e: KeyboardEvent) => {
        if (token.isCancellationRequested()) {
            return;
        }
        logger.debug("Keyup", e.code, "detected");
        if (e.code === "Space") {
            logger.debug("Stopped jumping");
            jumping = false;
        }
    });
    canvas.addEventListener(
        "touchstart",
        (e) => {
            if (token.isCancellationRequested()) {
                return;
            }
            logger.debug("Jumping");
            jumping = true;
        },
        { passive: true }
    );
    canvas.addEventListener("touchend", (e) => {
        if (token.isCancellationRequested()) {
            return;
        }
        e.preventDefault();
        logger.debug("Stopped jumping");
        jumping = false;
    });
    canvas.addEventListener("touchcancel", (e) => {
        if (token.isCancellationRequested()) {
            return;
        }
        e.preventDefault();
        logger.debug("Stopped jumping");
        jumping = false;
    });
}

function draw() {
    if (Bird.y + Bird.height >= floorY) {
        logger.info("game over, reason: floor");
        return gameOver();
    }

    reset();

    if (Bird.y < 0) {
        Bird.y = 0;
    }

    if (--pipeCooldown <= 0) {
        pipeCooldown = 175; // frames = 2 secs
        pipes.push(new Pipe(600, Util.randomInt(floorY - 128, 128)));
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
                logger.info("game over, reason: pipe");
                ded = true;
            }
            if (!pipe.passedThrough && Bird.x > pipe.x + PipeConstants.WIDTH) {
                logger.info("Score increased");
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
    if (--jumpCountDown >= 10 || jumping) {
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

    Menus.GameOverMenu(ctx)
        .then(() => {
            logger.info("Game restarted, resetting variables...");

            Bird.set(new Rect2D(20, 50, 32, 32));

            jumpCountDown = 0; // frames
            pipeCooldown = 0; // frames

            score = 0;

            pipes.length = 0;

            jumping = false;

            JumpCST = new CancellationTokenSource();
            bindJump(JumpCST.getToken());

            logger.info("Game restarted successfully.");

            window.requestAnimationFrame(draw);
        })
        .catch();
}
