import Point2D from "../canvas/Point2D";

export default function getCursorPosition(
    canvas: HTMLCanvasElement,
    event: MouseEvent
) {
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    return new Point2D(x, y);
}
