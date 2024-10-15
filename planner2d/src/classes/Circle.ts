import { Movable } from './Movable'
import { Mode, MovableType, Point, CircleJSON } from '../defs'
import { pointInCircle } from '../composables/calculations'
import { handleRemove } from '../composables/handleRemove'
import { drawDistance, drawDistanceToNextWall, restoreDefaultContext, setFontSize } from '../composables/updateCtx'

import { useSettingsStore } from '../store/settingsStore'
import { useProjectionStore } from '../store/projectionStore'
import { useCanvasStore } from '../store/canvasStore'

export class Circle extends Movable {
  name: string;
  c: Point;
  r: number;

  constructor(name: string, x: number, y: number, r: number) {
    super(MovableType.Circle);
    this.name = name;
    this.c = {
      x,
      y
    };
    this.r = r;
  }

  center(): Point {
    return this.c;
  }

  getDimSize(): number {
    const { settings } = useSettingsStore()
    if (this.r <= settings.value.furnitureRotateSize) {
      return this.r;
    }
    return settings.value.furnitureRotateSize;
  }

  setFontSize() {
    const { ctx } = useCanvasStore()
    setFontSize(1);
    const textDim = ctx.value.measureText(this.name);
    setFontSize(Math.min(Math.min(160, 2 * this.r), 2 * this.r / textDim.width));
  }

  handleClick(e: Point): boolean {
    const { projection } = useProjectionStore()
    if (pointInCircle(this.c, this.r, projection.to(e))) {
      this.translate = true;
      this.delta.x = e.x;
      this.delta.y = e.y;
      return true;
    }
    return false;
  }

  handleMove(e: Point): boolean {
    const { projection } = useProjectionStore()
    let changed = false;
    if (this.translate) {
      changed = true;

      this.c.x += (e.x - this.delta.x) / projection.scale;
      this.c.y += (e.y - this.delta.y) / projection.scale;

      this.delta.x = e.x;
      this.delta.y = e.y;

      handleRemove(e, this);
    }

    return changed;
  }

  draw() {
    const { ctx } = useCanvasStore()
    const { settings } = useSettingsStore()
    ctx.value.save();

    ctx.value.translate(this.c.x, this.c.y);

    this.setStyle(settings.value.mode === Mode.Room, true);

    ctx.value.beginPath();
    ctx.value.arc(0, 0, this.r, 0, 2 * Math.PI);
    ctx.value.stroke();

    ctx.value.beginPath();

    this.setFontSize();
    ctx.value.textBaseline = "middle";
    ctx.value.fillText(this.name, 0, 0, 2 * this.r);
    ctx.value.textBaseline = "alphabetic";

    const rotateSize = this.getDimSize();

    if (this.translate) {
      setFontSize(rotateSize);

      ctx.value.beginPath();

      ctx.value.moveTo(-this.r, -this.r);
      ctx.value.lineTo(this.r, -this.r);
      drawDistance(0, -this.r + rotateSize, 2 * this.r, null, "mm");
      ctx.value.stroke();
    }

    ctx.value.restore();

    this.drawWallDistances();
    restoreDefaultContext();
  }

  drawWallDistances() {
    const { settings } = useSettingsStore()
    const { ctx } = useCanvasStore()
    if (this.translate || this.rotate) {
      ctx.value.save();

      this.setStyle(settings.value.mode === Mode.Room, true);
      const rotateSize = this.getDimSize();
      setFontSize(rotateSize * 1.5);

      const center = this.center();

      // right
      drawDistanceToNextWall(center, { x: center.x + this.r, y: center.y });
      // left
      drawDistanceToNextWall(center, { x: center.x - this.r, y: center.y });
      // top
      drawDistanceToNextWall(center, { x: center.x, y: center.y - this.r });
      // bottom
      drawDistanceToNextWall(center, { x: center.x, y: center.y + this.r });

      ctx.value.restore();
    }
  }

  toJSON(): CircleJSON {
    return { mov: super.movableToJSON(), name: this.name, c: this.c, r: this.r };
  }
}