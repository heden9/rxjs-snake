import * as Rx from 'rxjs';
import { Observable } from 'rxjs';
import { Point2D, Config, Scene, CheckIsDie } from './types';
import {
  SNAKE_LENGTH,
  POINTS_PER_APPLE,
  nextDirection,
  DIRECTIONS,
  checkCollision,
  getRandomPosition,
  generateApples
} from './config';
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
      .share();

    this.score$ = this.snakeLength$
      .startWith(0)
      .scan(score => score + POINTS_PER_APPLE);
  }

  private initDirections(keydown$) {
    const _directions = this.config.directions;
    this.direction$ = keydown$
      .map((event: KeyboardEvent) => _directions[event.keyCode])
      .filter(directions => !!directions)
      .scan(nextDirection)
      .distinctUntilChanged();
  }
  getSnake$ = () => {
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
    const snake$ = (this.snake$ = ticks$
      .withLatestFrom(
        direction$,
        snakeLength$,
        (_, directions, snakeLength) => [directions, snakeLength]
      )
      .scan(move, generateSnake())
      .map(pos => ({ pos, config, instance: this }))
      .share());
    const cb = Rx.Observable.combineLatest(snake$, score$, (snake, score) => ({
      snake,
      score
    }));
    return cb;
  };
  _eat = apple$ => {
    this.snake$;
    apple$.scan(this.eat);
  };
  // checkIsDie: CheckIsDie = (players, index) => {
  //   const head = players[index].snake.pos[0];
  //   let killer;
  //   const body_self = players[index].snake.pos.slice(1);
  //   const body_others = players.filter((_, i) => i!==index).map(_ => _.snake.pos);
  //   const flag_self = body_self.some(segment => checkCollision(segment, head));
  //   const flag_others = body_others.some((_, i) => _.some((segment) => {
  //     const flag = checkCollision(segment, head);
  //     if (flag) {
  //       killer = i;
  //     }
  //     return flag
  //   }))
  //   if (flag_self){
  //     console.log('self');
  //   }
  //   if (flag_others){
  //     console.log('others');
  //     this.life --;
  //   }
  //   const isDie = flag_others && flag_self;
  //   return { isDie, killer };
  // }
  generateSnake = () => {
    let snake: Array<Point2D> = [];

    for (let i = this.config.length - 1; i >= 0; i--) {
      snake.push({ x: i, y: 0 });
    }

    return snake;
  };
  eat = (apples, { pos: snake }) => {
    let head = snake[0];

    for (let i = 0; i < apples.length; i++) {
      if (checkCollision(apples[i], head)) {
        apples.splice(i, 1);
        return [...apples, getRandomPosition(snake)];
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
