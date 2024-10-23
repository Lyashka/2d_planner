import { Dim, Point } from '../defs'
import { useProjectionStore } from '../store/projectionStore'
import { useSettingsStore } from '../store/settingsStore'

export function toRad(angle: number): number {
  return Math.PI * angle / 180;
}

export function toDeg(angle: number): number {
  return 180 * angle / Math.PI;
}

export function rotate(c: Point, p: Point, angle: number): Point {
  const rad = toRad(angle);
  return {
    x: Math.cos(rad) * (p.x - c.x) - Math.sin(rad) * (p.y - c.y) + c.x,
    y: Math.sin(rad) * (p.x - c.x) + Math.cos(rad) * (p.y - c.y) + c.y
  };
}

export function angleBetweenPoints(p1: Point, p2: Point, p3: Point): number {
  return toDeg(Math.atan2(p3.y - p1.y, p3.x - p1.x) -
    Math.atan2(p2.y - p1.y, p2.x - p1.x));
}

export function toNextNumber(p: Point): Point {
  return { x: Math.round(p.x), y: Math.round(p.y) };
}

export function distance(p1: Point, p2: Point): number {
  return Math.sqrt((p2.x - p1.x) ** 2 + (p2.y - p1.y) ** 2);
}

export function translate(p: Point, dim: Dim, sc: number = 1): Point {
  return {
    x: p.x + dim.w / sc,
    y: p.y + dim.h / sc
  };
}

export function pointInCircle(c: Point, r: number, p: Point): boolean {
  return distance(c, p) <= r;
}

export function getIntersectionPoint(center: Point, border: Point, wall1: Point, wall2: Point): Point | null {
  const denom = (center.x - border.x) * (wall1.y - wall2.y) - (center.y - border.y) * (wall1.x - wall2.x);
  if (denom === 0) {
    return null;
  }
  const t = ((center.x - wall1.x) * (wall1.y - wall2.y) - (center.y - wall1.y) * (wall1.x - wall2.x)) / denom;
  const u = ((center.x - wall1.x) * (center.y - border.y) - (center.y - wall1.y) * (center.x - border.x)) / denom;

  if (t > 1 && u >= 0 && u <= 1) {
    return { x: center.x + t * (border.x - center.x), y: center.y + t * (border.y - center.y) };
  }
  return null;
}

export function getTrapezoidArea(p1: Point, p2: Point): number {
  return (p1.x - p2.x) * (p1.y + p2.y) / 2;
}

// snap utility
function snap(angle: number, value: number, diff: number): boolean {
  return angle % value < diff || angle % value > value - diff;
}

export function handleSnap(mov: Rectangle | Ellipse, values: number[], angle: number, diff: number): boolean {
  const { projection, floorplanProjection} = useProjectionStore()
  const { settings } = useSettingsStore()
  for (const value of values) {
    if (snap(angle, value, diff)) {
      mov.angle = value % 360;
      mov.delta = settings.value.mode === Mode.Floorplan ?
        floorplanProjection.from(rotate(mov.center(),
        mov.angleSnapPoint(),
        value % 360
      ))
        : projection.from(rotate(mov.center(),
        mov.angleSnapPoint(),
        value % 360
      ));
      return true;
    }
  }
  return false;
}

export function validNumericInput(...values: number[]) {
  for (const value of values) {
    if (isNaN(value) || value < 1) {
      return false;
    }
  }
  return true;
}