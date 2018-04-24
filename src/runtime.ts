import * as Rx from "rxjs";
import { Observable } from "rxjs";
import {
  SPEED,
  DIRECTIONS,
  nextDirection,
  checkCollision,
  generateApples
} from "./config";
import { Snake } from "./snake";
import { Game } from "./canvas";
import { Scene } from "./types";
class Runtime {
  tick$: Observable<number>;
  click$: Observable<{}>;
  keydown$: Observable<{}>;
  scene$: Observable<{}>;
  snakes: Array<Snake> = [];
  game$: Observable<{}>;
  constructor() {
    this.init();
  }
  private init() {
    this.tick$ = Rx.Observable.interval(SPEED, Rx.Scheduler.animationFrame);
    this.click$ = Rx.Observable.fromEvent(document, "click");
    this.keydown$ = Rx.Observable.fromEvent(document, "keydown");

    /**
     * ---1---1---1---
     *
     */
  }
  isGameOver(players: Array<Scene>) {
    // let snake = scene.snake.pos;
    // let head = snake[0];
    // let body = snake.slice(1, snake.length);
    // return body.some(segment => checkCollision(segment, head));
    // players.forEach((scene, index) => {
    //   const { isDie, killer } = scene.snake.instance.checkIsDie(players, index);
    //   if (isDie) {
    //     this.snakes[killer]
    //   }
    // });
    return false;
  }
  addSnake(config) {
    const snake = new Snake(this.keydown$, config);
    this.snakes.push(snake);
  }
  run(game: Game) {
    const apple$ = new Rx.BehaviorSubject(generateApples());
    const snakes = this.snakes.map(snake => {
      return snake.getSnake$();
    });

    this.scene$ = Rx.Observable.combineLatest(snakes);
    const game$ = this.tick$
      .withLatestFrom(this.scene$, (_, scene) => scene)
      .takeWhile((players: Array<Scene>) => !this.isGameOver(players))
      .subscribe((players: Array<Scene>) => game.renderScene(players));
  }
}

export const runtime: Runtime = new Runtime();
