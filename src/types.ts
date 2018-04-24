import { Snake } from './snake';

export interface Point2D {
  x: number;
  y: number;
}

export interface Directions {
  [key: number]: Point2D;
}

export interface Scene {
  snake: {
    config: Config;
    pos: Array<Point2D>;
    instance: Snake;
  };
  score: number;
  apple?: Array<Point2D>;
}

export interface CheckIsDie {
  (players: Array<Scene>, index: number): {
    isDie: boolean;
    killer: number;
  };
}

export enum Key {
  LEFT = 37,
  RIGHT = 39,
  UP = 38,
  DOWN = 40
}

export interface Config {
  color: string;
  speed: number;
  length: number;
  directions: Directions;
}
