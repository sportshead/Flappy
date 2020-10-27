import Rect2D from "./Rect2D";

/**
 * Detects if two rectangles are colliding.
 * @param {Rect2D} rect1 First rectangle
 * @param {Rect2D} rect2 Second rectangle
 * @param {Number} [margin] Margin for hitbox, can be negative
 * @returns {Boolean} Whether or not the rectangles are colliding.
 */
export default function detectRectCollision(
    rect1: Rect2D,
    rect2: Rect2D,
    margin: number = 0
): boolean {
    /* return rect1.x < rect2.x + rect2.width &&
        rect1.x + rect1.width > rect2.x &&
        rect1.y < rect2.y + rect2.height &&
        rect1.y + rect1.height > rect2.y; */
    return (
        detectXCollision(rect1, rect2, margin) &&
        detectYCollision(rect1, rect2, margin)
    );
}

/**
 * Detects if two rectangles are colliding on the x axis.
 * @param {Object} rect1 First rectangle
 * @param {Number} rect1.x x coordinate of rect1
 * @param {Number} rect1.width width of rect1
 * @param {Object} rect2 Second rectangle
 * @param {Number} rect2.x x coordinate of rect2
 * @param {Number} rect2.width width of rect2
 * @param {Number} [margin] Margin for hitbox, can be negative
 * @returns {Boolean} Whether or not the rectangles are colliding on the x axis.
 */
export function detectXCollision(
    rect1: { x: number; width: number },
    rect2: { x: number; width: number },
    margin = 0
) {
    return (
        rect1.x - margin < rect2.x + rect2.width &&
        rect1.x + rect1.width > rect2.x - margin
    );
}

/**
 * Detects if two rectangles are colliding on the y axis.
 * @param {Object} rect1 First rectangle
 * @param {Number} rect1.y y coordinate of rect1
 * @param {Number} rect1.height height of rect1
 * @param {Object} rect2 Second rectangle
 * @param {Number} rect2.y y coordinate of rect2
 * @param {Number} rect2.height height of rect2
 * @param {Number} [margin] Margin for hitbox, can be negative
 * @returns {Boolean} Whether or not the rectangles are colliding on the y axis.
 */
export function detectYCollision(
    rect1: { y: number; height: number },
    rect2: { y: number; height: number },
    margin = 0
) {
    return (
        rect1.y - margin < rect2.y + rect2.height &&
        rect1.y + rect1.height > rect2.y - margin
    );
}
