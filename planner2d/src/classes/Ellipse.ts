import { Movable } from './Movable'
import { EllipseJSON, Mode, MovableType, Point } from '../defs'
import { angleBetweenPoints, distance, handleSnap, pointInCircle, rotate, toRad } from '../composables/calculations'
import { handleRemove } from '../composables/handleRemove'
import { drawDistance, drawDistanceToNextWall, restoreDefaultContext, setFontSize } from '../composables/updateCtx'

import { useSettingsStore } from '../store/settingsStore'
import { useProjectionStore } from '../store/projectionStore'
import { useCanvasStore } from '../store/canvasStore'

export class Ellipse extends Movable {
  name: string;
  c: Point;
  rX: number;
  rY: number;
  f: number;
  z: number;
  angle: number;

  constructor(name: string, x: number, y: number, rX: number, rY: number) {
    super(MovableType.Ellipse);
    this.name = name;
    this.c = {
      x,
      y
    };
    this.rX = rX;
    this.rY = rY;
    this.f = Math.sqrt(Math.max(this.rX, this.rY) ** 2 - Math.min(this.rX, this.rY) ** 2);
    this.z = Math.min(this.rX, this.rY) ** 2 / Math.max(this.rX, this.rY);
    this.angle = 0;
  }

  center(): Point {
    return this.c;
  }

  getF1(): Point {
    return this.rX < this.rY ? { x: this.c.x, y: this.c.y - this.f } : { x: this.c.x - this.f, y: this.c.y };
  }

  getF2(): Point {
    return this.rX < this.rY ? { x: this.c.x, y: this.c.y + this.f } : { x: this.c.x + this.f, y: this.c.y };
  }

  getRotateSize(): number {
    const { settings } = useSettingsStore()
    if (this.z <= settings.value.furnitureRotateSize) {
      return this.z;
    }
    return settings.value.furnitureRotateSize;
  }

  getDimSize(): number {
    const { settings } = useSettingsStore()
    if (this.rX <= settings.value.furnitureRotateSize || this.rY <= settings.value.furnitureRotateSize) {
      return Math.min(this.rX, this.rY);
    }
    return settings.value.furnitureRotateSize;
  }

  pointInEllipse(p: Point): boolean {
    return distance(p, this.getF1()) + distance(p, this.getF2()) <= 2 * Math.max(this.rX, this.rY);
  }

  pointInRotCircle(other: Point, radius: number): boolean {
    const pRot = rotate(this.center(), other, -this.angle);
    return pointInCircle(this.angleSnapPoint(), radius, pRot);
  }

  pointInRotEllipse(other: Point): boolean {
    const pRot = rotate(this.center(), other, -this.angle);
    return this.pointInEllipse(pRot);
  }

  setFontSize() {
    const { ctx } = useCanvasStore()
    setFontSize(1);
    const textDim = ctx.value.measureText(this.name);
    setFontSize(Math.min(Math.min(160, 2 * this.rY), 2 * this.rX / textDim.width));
  }

  angleSnapPoint(): Point {
    return this.getF2();
  }

  handleClick(e: Point): boolean {
    const { projection } = useProjectionStore()
    if (this.rX !== this.rY && this.pointInRotCircle(projection.to(e), this.getRotateSize() / 2)) {
      this.rotate = true;
      this.delta.x = e.x;
      this.delta.y = e.y;
      return true;
    } else if (this.pointInRotEllipse(projection.to(e))) {
      this.translate = true;
      this.delta.x = e.x;
      this.delta.y = e.y;
      return true;
    }
    return false;
  }

  handleMove(e: Point): boolean {
    const { projection } = useProjectionStore()
    const { settings } = useSettingsStore()
    let changed = false;
    if (this.translate) {
      changed = true;

      this.c.x += (e.x - this.delta.x) / projection.scale;
      this.c.y += (e.y - this.delta.y) / projection.scale;

      this.delta.x = e.x;
      this.delta.y = e.y;

      handleRemove(e, this);
    } else if (this.rotate) {
      changed = true;
      const a = angleBetweenPoints(projection.from(this.center()),
        this.delta,
        e);
      if (!handleSnap(this, [360, 270, 180, 90], Math.abs((this.angle + a + 360) % 360), settings.value.furnitureSnapAngle)) {
        this.angle += a;

        this.delta.x = e.x;
        this.delta.y = e.y;
      }
    }

    return changed;
  }

  draw() {
    const { ctx } = useCanvasStore()
    const { settings } = useSettingsStore()

    ctx.value.save();

    ctx.value.translate(this.c.x, this.c.y);
    ctx.value.rotate(toRad(this.angle));

    this.setStyle(settings.value.mode === Mode.Room, true);

    ctx.value.beginPath();
    ctx.value.ellipse(0, 0, this.rX, this.rY, 0, 0, 2 * Math.PI);
    ctx.value.stroke();

    ctx.value.beginPath();

    this.setFontSize();
    ctx.value.textBaseline = "middle";
    ctx.value.fillText(this.name, 0, 0, 2 * this.rX);
    ctx.value.textBaseline = "alphabetic";

    const rotateSize = this.getRotateSize();

    if (settings.value.mode === Mode.Furniture && this.rX !== this.rY) {
      ctx.value.beginPath();
      const f = this.angleSnapPoint();
      ctx.value.arc(
        f.x - this.c.x,
        f.y - this.c.y,
        rotateSize / 2,
        0,
        2 * Math.PI
      );
      ctx.value.stroke();
    }

    const dimSize = this.getDimSize();

    if (this.translate || this.rotate) {
      setFontSize(dimSize);

      ctx.value.beginPath();

      ctx.value.moveTo(-this.rX, -this.rY);
      ctx.value.lineTo(this.rX, -this.rY);
      drawDistance(0, -this.rY + dimSize, 2 * this.rX, null, "mm");

      ctx.value.moveTo(-this.rX, -this.rY);
      ctx.value.lineTo(-this.rX, this.rY);

      ctx.value.translate(-this.rX + dimSize, 0);
      ctx.value.rotate(toRad(-90));
      drawDistance(0, 0, 2 * this.rY, null, "mm");

      ctx.value.stroke();
    }

    ctx.value.restore();

    this.drawWallDistances();
    restoreDefaultContext();
  }

  drawWallDistances() {
    const { ctx } = useCanvasStore()
    const { settings } = useSettingsStore()

    if (this.translate || this.rotate) {
      ctx.value.save();

      this.setStyle(settings.value.mode === Mode.Room, true);
      const rotateSize = this.getDimSize();
      setFontSize(rotateSize * 1.5);

      const center = this.center();

      // right
      drawDistanceToNextWall(center, rotate(center, { x: center.x + this.rX, y: center.y }, this.angle));
      // left
      drawDistanceToNextWall(center, rotate(center, { x: center.x - this.rX, y: center.y }, this.angle));
      // top
      drawDistanceToNextWall(center, rotate(center, { x: center.x, y: center.y - this.rY }, this.angle));
      // bottom
      drawDistanceToNextWall(center, rotate(center, { x: center.x, y: center.y + this.rY }, this.angle));

      ctx.value.restore();
    }
  }

  toJSON(): EllipseJSON {
    return { mov: super.movableToJSON(), name: this.name, c: this.c, rX: this.rX, rY: this.rY, angle: this.angle };
  }
}