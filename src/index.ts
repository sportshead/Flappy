import bg from "!!file-loader!./images/bg2.jpg";
import bird from "!!file-loader!./images/bird.jpg";
import Util from "./util";
import Menus from "./menus";
import Point2D from "./Point2D";

const { LOG } = Util;

const canvas = <HTMLCanvasElement>document.getElementById("main");
export const ctx = <CanvasRenderingContext2D>canvas.getContext("2d");

export const BirdPos: Point2D = new Point2D();

console.log(bg);
console.log(bird);

const images: Map<string, HTMLImageElement> = new Map();

async function main() {
    const pressStart = new FontFace(
        "PressStart2P",
        'url("https://fonts.gstatic.com/s/pressstart2p/v8/e3t4euO8T-267oIAQAu6jDQyK3nVivNm4I81.woff2")'
    );

    document.fonts.add(await pressStart.load());
    LOG("font loaded");

    images.set("bg", await Util.getImage(bg));
    LOG("bg loaded");
    images.set("bird", await Util.getImage(bird));
    LOG("bird loaded");

    await Menus.MainMenu();
}
main().catch(console.error);

export function reset() {
    ctx.drawImage(images.get("bg"), 0, 0, 256, 512);

    LOG("canvas resetted");
}
