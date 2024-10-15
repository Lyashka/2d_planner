import { Dim, Mode, MovableType, OpenableType, optionalNumber, Point, Graph } from '../defs'
import { useCanvasStore} from '../store/canvasStore'
import { useSettingsStore } from '../store/settingsStore'
import { useProjectionStore} from '../store/projectionStore'
import { useGraphStore } from '../store/graphStore'

import { Movable } from './Movable'

import { angleBetweenPoints, distance, pointInCircle, rotate, toRad, translate, toDeg } from '../composables/calculations'
import { setFontSize, drawDistance } from '../composables/updateCtx'
import { handleRemove } from '../composables/handleRemove'


export class Openable extends Movable {
  openableType: OpenableType;
  p: Point;
  dim: Dim;
  angle: number;
  snap: OpenableSnapType;

  constructor(type: OpenableType, x: number, y: number, w: number, h: number) {
    super(MovableType.Openable);
    this.openableType = type;
    this.p = {
      x,
      y
    };
    this.dim = {
      w,
      h
    };
    this.angle = 0;
    this.snap = {
      edge: null,
      pos: null,
      orientation: null,
    }
  }

  center(): Point {
    return {
      x: this.p.x + this.dim.w / 2,
      y: this.p.y
    };
  }

  handle(): Point {
    return {
      x: this.p.x,
      y: this.p.y - this.dim.h
    }
  }

  pointInRotCircle(other: Point, radius: number): boolean {
    const pRot = rotate(this.center(), other, -this.angle);
    return pointInCircle(translate(this.handle(), { w: radius, h: radius }), radius, pRot);
  }

  getRotateSize(): number {
    const { settings } = useSettingsStore()
    if (this.dim.w / 2 <= settings.value.furnitureRotateSize || this.dim.h / 2 <= settings.value.furnitureRotateSize) {
      return Math.min(this.dim.w, this.dim.h) / 2;
    }
    return settings.value.furnitureRotateSize;
  }

  pointInRotRectangle(other: Point): boolean {
    const pRot = rotate(this.center(), other, -this.angle);
    const h = this.handle();
    if (h.x <= pRot.x && h.x + this.dim.w >= pRot.x && h.y <= pRot.y && h.y + this.dim.h >= pRot.y) {
      return true;
    }
    return false;
  }

  handleClick(e: Point): boolean {
    const { projection } = useProjectionStore()
    if (this.snap.edge === null && this.pointInRotCircle(projection.to(e), this.getRotateSize() / 2)) {
      this.rotate = true;
      this.delta.x = e.x;
      this.delta.y = e.y;
      return true;
    } else if (this.pointInRotRectangle(projection.to(e))) {
      this.translate = true;
      this.delta.x = e.x;
      this.delta.y = e.y;
      return true;
    }
    return false;
  }

  handleSnap(values: number[], angle: number, diff: number): boolean {
    const { projection } = useProjectionStore()
    for (const value of values) {
      if (snap(angle, value, diff)) {
        this.angle = value % 360;
        this.delta = projection.from(rotate(this.center(),
          { x: this.p.x, y: this.p.y - this.dim.h },
          value % 360
        ));
        return true;
      }
    }
    return false;
  }

  handleEdgeSnap(p: Point, graph: Graph) {
    // const { graph } = useGraphStore()
    const { projection } = useProjectionStore()
    const { settings } = useSettingsStore()
    const clickPos = projection.to(p);

    let minDist: optionalNumber = null;
    let minEdge: Edge | null = null;
    let minT: optionalNumber = null;
    let minOrientation: optionalNumber = null;

    for (const outEdges of Object.values(graph.edges)) {
      for (const edge of Object.values(outEdges)) {
        const node1 = graph.nodes[edge.id1] as CornerNode;
        const node2 = graph.nodes[edge.id2] as CornerNode;

        const t =
          ((node2.p.x - node1.p.x) * (clickPos.x - node1.p.x) + (node2.p.y - node1.p.y) * (clickPos.y - node1.p.y)) /
          ((node2.p.x - node1.p.x) ** 2 + (node2.p.y - node1.p.y) ** 2);

        if (t < 0 || t > 1) {
          continue;
        }
        const orientationDist =
          ((node2.p.x - node1.p.x) * (node1.p.y - clickPos.y) - (node1.p.x - clickPos.x) * (node2.p.y - node1.p.y)) /
          distance(node2.p, node1.p);
        const dist = Math.abs(orientationDist);
        if (dist < settings.value.nodeExtendSize && (minDist === null || dist < minDist)) {
          minDist = dist;
          minEdge = edge;
          minT = t;
          minOrientation = Math.sign(orientationDist) < 0 ? 1 : 0;

          const proj = {
            x: node1.p.x + t * (node2.p.x - node1.p.x),
            y: node1.p.y + t * (node2.p.y - node1.p.y)
          };

          const shift = { x: proj.x - this.dim.w / 2, y: proj.y };
          this.p = shift;
          this.delta = projection.from(proj);
          this.angle = toDeg(Math.atan2(node2.p.y - node1.p.y, node2.p.x - node1.p.x)) + minOrientation * 180;
        }
      }
    }

    this.snap.pos = minT;
    this.snap.orientation = minOrientation;

    if (this.snap.edge !== null && this.snap.edge !== minEdge) {
      for (let i = this.snap.edge.snapOpenables.length - 1; i >= 0; --i) {
        if (this.snap.edge.snapOpenables[i] === this) {
          this.snap.edge.snapOpenables.splice(i, 1);
          break;
        }
      }
    }
    if (this.snap.edge !== minEdge) {
      this.snap.edge = minEdge;
      if (this.snap.edge !== null) {
        this.snap.edge.snapOpenables.push(this);
      }
    }

    if (minDist === null) {
      this.snap.edge = null;
      this.snap.pos = null;
      this.snap.orientation = null;

      this.p.x += (p.x - this.delta.x) / projection.scale;
      this.p.y += (p.y - this.delta.y) / projection.scale;

      this.delta.x = p.x;
      this.delta.y = p.y;
    }
  }

  handleMove(e: Point, graph: Graph): boolean {
    const { projection } = useProjectionStore()
    const { settings } = useSettingsStore()
    let changed = false;
    if (this.translate) {
      changed = true;

      this.handleEdgeSnap(e, graph);

      handleRemove(e, this);
    } else if (this.rotate) {
      changed = true;
      const a = angleBetweenPoints(projection.from(this.center()),
        this.delta,
        e);
      if (!this.handleSnap([360, 270, 180, 90], Math.abs((this.angle + a + 360) % 360), settings.value.furnitureSnapAngle)) {
        this.angle += a;

        this.delta.x = e.x;
        this.delta.y = e.y;
      }
    }

    return changed;
  }

  draw() {
    const { graph } = useGraphStore()
    const { settings } = useSettingsStore()
    const { ctx } = useCanvasStore()
    ctx.value.save();

    const c = this.center();

    ctx.value.translate(c.x, c.y);
    ctx.value.rotate(toRad(this.angle));

    this.setStyle(settings.value.mode !== Mode.Room);

    switch (this.openableType) {
      case OpenableType.Left: {
        ctx.value.beginPath();
        ctx.value.moveTo(-this.dim.w / 2, 0);
        ctx.value.lineTo(-this.dim.w / 2, this.dim.w);
        ctx.value.stroke();

        ctx.value.beginPath();
        ctx.value.arc(-this.dim.w / 2, 0, this.dim.w, 0, Math.PI / 2);
        ctx.value.stroke();
        break;
      }
      case OpenableType.Right: {
        ctx.value.beginPath();
        ctx.value.moveTo(this.dim.w / 2, 0);
        ctx.value.lineTo(this.dim.w / 2, this.dim.w);
        ctx.value.stroke();

        ctx.value.beginPath();
        ctx.value.arc(this.dim.w / 2, 0, this.dim.w, Math.PI / 2, Math.PI);
        ctx.value.stroke();
        break;
      }
      case OpenableType.Double: {
        ctx.value.beginPath();
        ctx.value.moveTo(-this.dim.w / 2, 0);
        ctx.value.lineTo(-this.dim.w / 2, this.dim.w / 2);
        ctx.value.stroke();

        ctx.value.beginPath();
        ctx.value.arc(-this.dim.w / 2, 0, this.dim.w / 2, 0, Math.PI / 2);
        ctx.value.stroke();

        ctx.value.beginPath();
        ctx.value.moveTo(this.dim.w / 2, 0);
        ctx.value.lineTo(this.dim.w / 2, this.dim.w / 2);
        ctx.value.stroke();

        ctx.value.beginPath();
        ctx.value.arc(this.dim.w / 2, 0, this.dim.w / 2, Math.PI / 2, Math.PI);
        ctx.value.stroke();
        break;
      }
    }

    const rotateSize = this.getRotateSize();

    if (settings.value.mode === Mode.Room) {
      ctx.value.beginPath();
      ctx.value.rect(-this.dim.w / 2, -this.dim.h, this.dim.w, this.dim.h);
      ctx.value.stroke();

      if (this.snap.edge === null) {
        ctx.value.beginPath();
        ctx.value.arc(
          -this.dim.w / 2 + rotateSize / 2,
          -this.dim.h + rotateSize / 2,
          rotateSize / 2,
          0,
          2 * Math.PI
        );
        ctx.value.stroke();
      }
    }

    if (this.translate || this.rotate) {
      setFontSize(rotateSize * 2);

      ctx.value.beginPath();
      drawDistance(0, -this.dim.h + rotateSize * 2, this.dim.w, null, "mm");
      ctx.value.stroke();

      if (this.snap.edge !== null && this.snap.pos !== null && this.snap.orientation !== null) {
        const node1 = graph.nodes[this.snap.edge.id1] as CornerNode;
        const node2 = graph.nodes[this.snap.edge.id2] as CornerNode;

        const dist: number = distance(node1.p, node2.p);
        const dist1: number = dist * this.snap.pos - this.dim.w / 2;
        const dist2: number = dist * (1 - this.snap.pos) - this.dim.w / 2;

        if (dist1 > 0) {
          ctx.value.textAlign = this.snap.orientation === 0 ? "right" : "left";
          ctx.value.beginPath();
          drawDistance((this.snap.orientation - 1 / 2) * this.dim.w, -this.dim.h + rotateSize * 2, dist1, 0, "mm");
          ctx.value.stroke();
        }

        if (dist2 > 0) {
          ctx.value.textAlign = this.snap.orientation === 1 ? "right" : "left";
          ctx.value.beginPath();
          drawDistance((-this.snap.orientation + 1 / 2) * this.dim.w, -this.dim.h + rotateSize * 2, dist2, 0, "mm");
          ctx.value.stroke();
        }
      }
    }

    ctx.value.restore();
  }

  toJSON(): OpenableJSON {
    return { mov: super.movableToJSON(), openableType: this.openableType, p: this.p, dim: this.dim, angle: this.angle, snap: this.snap };
  }
}