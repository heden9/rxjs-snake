import * as Rx from "rxjs";
import { Observable } from "rxjs";
import { Point2D, Config, Scene, CheckIsDie, EatInfo } from "./types";
import {
  SNAKE_LENGTH,
  POINTS_PER_APPLE,
  nextDirection,
  DIRECTIONS,
  checkCollision,
  getRandomPosition,
  generateApples
} from "./config";

export class Snake {
  snakeLength$: Observable<number>;
  score$: Observable<number>;
  direction$: Observable<{}>; // 键盘方向
  config: Config;
  length$: Rx.BehaviorSubject<number>;
  snake$: Observable<{}>;
  ticks$: Observable<{}>;
  constructor(keydown$, config) {
    this.init(config);
    this.initDirections(keydown$);
  }
  private init(config) {
    this.config = {
      length: SNAKE_LENGTH,
      directions: DIRECTIONS,
      ...config
    };
    const length$ = (this.length$ = new Rx.BehaviorSubject<number>(
      this.config.length
    ));
    this.ticks$ = Rx.Observable.interval(config.speed);
    this.snakeLength$ = length$
      .scan((step, snakeLength) => snakeLength + step)
      .do(e => console.log(this.config.color))
      .share();

    this.score$ = this.snakeLength$
      .startWith(0)
      .scan(score => score + POINTS_PER_APPLE);
    // .skip(1)
    // .do(e => console.log(e))
  }

  private initDirections(keydown$) {
    const _directions = this.config.directions;
    this.direction$ = keydown$
      .map((event: KeyboardEvent) => _directions[event.keyCode])
      .filter(directions => !!directions)
      .scan(nextDirection)
      .distinctUntilChanged();
  }
  getSnake$ = apple$ => {
    const {
      direction$,
      ticks$,
      snakeLength$,
      move,
      length$,
      generateSnake,
      config,
      score$,
      eat
    } = this;
    const s1$ = (this.snake$ = ticks$
      .withLatestFrom(
        direction$,
        snakeLength$,
        (_, directions, snakeLength) => [directions, snakeLength]
      )
      .scan(move, generateSnake())
      .share());
    const eaten$ = s1$
      .withLatestFrom(apple$, (snake, apples) => ({ snake, apples }))
      .skip(1)
      .map(eat)
      .distinctUntilChanged()
      .do(e => apple$.next(e));
    const snake$ = s1$.map(snake => ({ pos: snake, config, instance: this }));
    return Rx.Observable.combineLatest(
      snake$,
      score$,
      length$,
      eaten$,
      (snake, score) => ({ snake, score })
    );
  };
  checkIsDie: any = otherPlayers => {};
  generateSnake = () => {
    let snake: Array<Point2D> = [];

    for (let i = this.config.length - 1; i >= 0; i--) {
      snake.push({ x: i, y: 0 });
    }

    return snake;
  };
  format = (apples, snake) => {
    return { apples, len: this.config.length };
  };
  eat = ({ apples, snake }: EatInfo) => {
    let head = snake[0];
    for (let i = 0; i < apples.length; i++) {
      if (checkCollision(apples[i], head)) {
        const _apples = apples.slice();
        _apples.splice(i, 1);
        this.length$.next(POINTS_PER_APPLE);
        return [..._apples, getRandomPosition(snake)];
      }
    }

    return apples;
  };
  move = (snake, [direction, snakeLength]) => {
    let nx = snake[0].x;
    let ny = snake[0].y;
    nx += direction.x;
    ny += direction.y;

    let tail;

    if (snakeLength > snake.length) {
      tail = { x: nx, y: ny };
    } else {
      tail = snake.pop();
      tail.x = nx;
      tail.y = ny;
    }

    snake.unshift(tail);

    return snake;
  };
}

// export const snake = new Snake();
