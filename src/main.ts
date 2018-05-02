import { game } from './canvas';
import { runtime } from './runtime';

runtime.addSnake({
  color: 'red',
  length: 6,
  speed: 300,
});
runtime.addSnake({
  color: 'orange',
  length: 10,
  speed: 150,
});
runtime.addSnake({
  color: 'blue',
  length: 10,
  speed: 200,
  directions: {
    65: { x: -1, y: 0 },
    68: { x: 1, y: 0 },
    87: { x: 0, y: -1 },
    83: { x: 0, y: 1 }
  }
});
runtime.run(game);
