import type { CornerJSON, Point, CornerSnap } from '../defs'

export class CornerNode {
  id: number;
  p: Point;
  delta: Point;
  translate: boolean;
  extend: boolean;
  snap: CornerSnap;
  remove: boolean;

  constructor(id: number, x: number, y: number) {
    this.id = id;
    this.p = {
      x,
      y
    };
    this.delta = {
      x: 0,
      y: 0
    };
    this.translate = false;
    this.extend = false;
    this.snap = {
      x: null,
      y: null,
      edge: null,
      pos: null,
    };
    this.remove = false;
  }

  toJSON(): CornerJSON {
    return { id: this.id, p: this.p };
  }
}