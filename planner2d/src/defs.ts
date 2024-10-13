export enum Mode {
  Floorplan,
  Room,
  Furniture,
  Presentation,
}

export enum MovableType {
  Openable = "Openable",
  Rectangle = "Rectangle",
  Ellipse = "Ellipse",
  Circle = "Circle",
  L = "L",
  U = "U",
}

export enum OpenableType {
  Left = "Left",
  Right = "Right",
  Double = "Double",
}

export enum FurnitureType {
  Rectangle,
  Circle,
  L,
  U,
}

export interface Point {
  x: number,
  y: number,
}

export interface Dim {
  w: number,
  h: number,
}

export enum Direction {
  Up,
  Down,
  Right,
  Left,
}

export interface Settings {
  language: string,
  mode: Mode,
  openableType: OpenableType,
  type: FurnitureType,
  readonly zoomFactor: number,
  readonly minZoom: number,
  readonly maxZoom: number,
  readonly deleteDim: Dim,
  isRemove: boolean,

  nodeTransSize: number,
  nodeExtendSize: number,
  nodeSnapDist: number,

  readonly furnitureRotateSize: number,
  readonly furnitureSnapAngle: number,

  showEdgeLabels: boolean,
  showRoomSize: boolean,
}

export type optionalPoint = { x: optionalNumber, y: optionalNumber };
export type optionalString = string | null;
export type optionalNumber = number | null;