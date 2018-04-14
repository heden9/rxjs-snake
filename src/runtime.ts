import * as Rx from 'rxjs';
import { Observable } from 'rxjs';
import { SPEED, DIRECTIONS, nextDirection, checkCollision } from './config';
import { Snake } from './snake';
import { Game } from './canvas';
import { Scene } from './types';
class Runtime {
  tick$: Observable<number>;
  click$: Observable<{}>;
  keydown$: Observable<{}>;
  scene$: Observable<{}>;
  snakes: Array<Snake> = [];
  game$: Observable<{}>;
  constructor(){
    this.init();
  }
  private init(){
    this.tick$ = Rx.Observable.interval(SPEED, Rx.Scheduler.animationFrame);
    this.click$ = Rx.Observable.fromEvent(document, 'click')
    this.keydown$ = Rx.Observable.fromEvent(document, 'keydown')

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
    const snakes = this.snakes.map(snake => {
      const { direction$, snakeLength$, move, generateSnake, config } = snake;
      const snake$ = this.tick$
        .withLatestFrom(
          direction$,
          snakeLength$,
          (_, directions, snakeLength) => [directions, snakeLength]
        )
        .scan(move, generateSnake())
        .map((pos) => ({ pos, config, instance: snake }))
        .share();
      const cb = Rx.Observable.combineLatest(snake$, snake.score$, (snake, score) => ({snake, score}));
      return cb;
    });
    // const snakes$ = Rx.Observable.from(snakes);
    this.scene$ = Rx.Observable.combineLatest(...snakes);
    const game$ = this.tick$
      .withLatestFrom(this.scene$, (_, scene) => scene)
      .takeWhile((players: Array<Scene>) => !this.isGameOver(players))
      .map(((players: Array<Scene>) => {
        return players.filter(scene => scene.snake.instance.life > 0)
      }))
      .subscribe((players: Array<Scene>) => game.renderScene(players))
  }
}

export const runtime: Runtime = new Runtime();
