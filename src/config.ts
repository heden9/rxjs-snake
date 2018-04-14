import { Directions, Point2D } from './types';
export const ROWS = 50;
export const COLS = 100;
export const GAP_SIZE = 1;
export const CELL_SIZE = 10;
export const CANVAS_WIDTH = COLS * CELL_SIZE + (COLS - 1) * GAP_SIZE;
export const CANVAS_HEIGHT = ROWS * CELL_SIZE + (ROWS - 1) * GAP_SIZE;
export const SPEED = 200;
export const FPS = 60;
export const SNAKE_LENGTH = 5;
export const POINTS_PER_APPLE = 1;

export const DIRECTIONS: Directions = {
  37: { x: -1, y: 0 },
  39: { x: 1, y: 0 },
  38: { x: 0, y: -1 },
  40: { x: 0, y: 1 }
};

const isOpposite = (previous: Point2D, next: Point2D) => {
  return next.x === previous.x * -1 || next.y === previous.y * -1;
};

export function nextDirection(previous, next) {
  if (isOpposite(previous, next)) {
    return previous;
  }
  return next;
}

export function paintCell(ctx: CanvasRenderingContext2D, point: Point2D, color: string) {
  const x = point.x * CELL_SIZE + (point.x * GAP_SIZE);
  const y = point.y * CELL_SIZE + (point.y * GAP_SIZE);

  ctx.fillStyle = color;
  ctx.fillRect(x, y, CELL_SIZE, CELL_SIZE);
}

export function getSegmentColor(index: number, color: string = '#2196f3') {
  return index === 0 ? 'black' : color;
}

export function wrapBounds(point: Point2D) {
  point.x = point.x >= COLS ? 0 : point.x < 0 ? COLS - 1 : point.x;
  point.y = point.y >= ROWS ? 0 : point.y < 0 ? ROWS - 1 : point.y;

  return point;
}
export function checkCollision(a, b) {
  return a.x === b.x && a.y === b.y;
}
