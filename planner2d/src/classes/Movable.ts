import { MovableType, Point } from '../defs'
import { useCanvasStore} from '../store/canvasStore'

export class Movable {
  type: MovableType;
  delta: Point;
  translate: boolean;
  rotate: boolean;
  remove: boolean;

  stroke: string;
  fill: string;

  constructor(type: MovableType) {
    this.type = type;
    this.delta = {
      x: 0,
      y: 0
    };
    this.translate = false;
    this.rotate = false;
    this.remove = false;

    this.stroke = "black";
    this.fill = "";
  }

  getFill(isDisabled: boolean, highlight: boolean = false): string {
    return this.remove ? "red" : isDisabled ? "gray" : highlight && (this.translate || this.rotate) ? "green" : this.fill;
  }
  getStroke(isDisabled: boolean, highlight: boolean = false): string {
    return this.remove ? "red" : isDisabled ? "gray" : highlight && (this.translate || this.rotate) ? "green" : this.stroke;
  }

  setStyle(isDisabled: boolean, highlight: boolean = false) {
    const { ctx } = useCanvasStore()
    ctx.value.fillStyle = this.getFill(isDisabled, highlight);
    ctx.value.strokeStyle = this.getStroke(isDisabled, highlight);
  }

  movableToJSON(): MovableJSON {
    return { type: this.type, stroke: this.stroke, fill: this.fill };
  }
}