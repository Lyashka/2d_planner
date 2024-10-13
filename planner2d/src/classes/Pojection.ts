import { Point } from '../defs'

export class Projection {
  scale: number;
  p: Point;
  drag: boolean;
  delta: Point;

  constructor(scale: number, x: number = 0, y: number = 0) {
    this.scale = scale;
    this.p = { x: x, y: y };
    this.drag = false;
    this.delta = { x: 0, y: 0 };
  }
  to(q: Point): Point {
    return {
      x: (q.x - this.p.x) / this.scale,
      y: (q.y - this.p.y) / this.scale
    };
  };
  from(q: Point): Point {
    return {
      x: this.p.x + q.x * this.scale,
      y: this.p.y + q.y * this.scale
    };
  };
}