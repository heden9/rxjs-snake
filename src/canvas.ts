import {
  CANVAS_WIDTH,
  CANVAS_HEIGHT,
  paintCell,
  wrapBounds,
  getSegmentColor
} from './config';
import { Directions, Point2D, Scene, Config } from './types';
export class Game {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  constructor(){
    this.create();
    this.registry();
  }
  create() {
    const canvas = document.createElement('canvas');
    canvas.width = CANVAS_WIDTH;
    canvas.height = CANVAS_HEIGHT;

    this.ctx = canvas.getContext('2d');
    this.canvas = canvas;
  }
  registry() {
    document.body.appendChild(this.canvas);
  }
  renderScene(players: Array<Scene>) {
    this.renderBackground();
    players.forEach(({ snake: { pos, config } }) => {
      this.renderSnake(pos, config);
    })
  }
  renderBackground() {
    const { ctx } = this;
    ctx.fillStyle = '#EEE';
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  }
  renderSnake(snake: Array<Point2D>, config: Config) {
    snake.forEach((segment, index) => paintCell(this.ctx, wrapBounds(segment), getSegmentColor(index, config.color)));
  }
}
export const game = new Game();
