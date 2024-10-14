import { Openable } from './Openable'
import { EdgeJSON } from '../defs'

export class Edge {
  id1: number;
  id2: number;
  stroke: string;
  snapOpenables: Openable[];
  constructor(id1: number, id2: number) {
    this.id1 = id1;
    this.id2 = id2;
    this.stroke = "black";
    this.snapOpenables = [];
  }
  toJSON(): EdgeJSON {
    return { id1: this.id1, id2: this.id2, stroke: this.stroke };
  }
}