import { CornerNode } from './classes/CornerNode'
import { Edge } from './classes/Edge'

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

export type MovableJSON = { type: MovableType, stroke: string, fill: string };

export type OpenableSnapType = { edge: Edge | null, pos: optionalNumber, orientation: optionalNumber };
export type OpenableJSON = { mov: MovableJSON, openableType: OpenableType, p: Point, dim: Dim, angle: number, snap: OpenableSnapType };

export type CornerSnap = { x: optionalNumber, y: optionalNumber, edge: Edge | null, pos: optionalNumber };
export type CornerJSON = { id: number, p: Point };
export type EdgeJSON = { id1: number, id2: number, stroke: string };

export type RectangleJSON = { mov: MovableJSON, name: string, p: Point, dims: Dim[], angle: number }

export type CornerNodes = {
  [key: number]: CornerNode,
};
export type Edges = {
  [key1: number]: {
    [key2: number]: Edge,
  },
};
export type GraphJSON = { nodes: CornerNodes, edges: Edges };
export interface Graph {
  count: number,
  nodes: CornerNodes,
  edges: Edges,
  addNode: (p: Point) => number,
  removeNode: (id: number) => void,
  addEdge: (id1: number, id2: number) => Edge | null,
  removeEdge: (id1: number, id2: number) => void,
  mergeNodes: (fromId: number, toId: number) => void,
  bisect: (id: number, edge: Edge, pos: number) => void,

  getFaces: () => CornerNode[][],

  reset: () => void,

  nextEdgeToSegment: (center: Point, p: Point) => Point | null,
  closestNodeToClick: (p: Point) => optionalNumber,
  handleNodeToNodeSnap: (node: CornerNode, p: Point, extendNode: boolean) => boolean,
  handleNodeToEdgeSnap: (node: CornerNode, p: Point, extendNode: boolean) => boolean,
  handleNodeToNeighborSnap: (node: CornerNode, p: Point, extendNode: boolean, change: boolean) => optionalPoint,
  handleNodeSnap: (node: CornerNode, p: Point, extendNode: boolean) => void,

  handleClick: (e: Point) => boolean,
  handleMove: (e: Point) => boolean,
  handleUnclick: (e: Point) => void,

  draw: () => void,
  drawFaces: () => void,
  drawEdges: () => void,
  drawNodes: () => void,
  drawExtend: () => void,

  toJSON: () => GraphJSON,
};

export type CircleJSON = { mov: MovableJSON, name: string, c: Point, r: number };

export type EllipseJSON = { mov: MovableJSON, name: string, c: Point, rX: number, rY: number, angle: number };

export type FloorplanImageJSON = { image: string, distance: number, node1: CornerJSON, node2: CornerJSON };

export interface FloorplanImage {
  image: HTMLImageElement | null,
  distance: number,
  node1: CornerNode,
  node2: CornerNode,
  readonly nodeSize: number,

  reset: () => void,

  handleClick: (e: Point) => boolean,
  handleMove: (e: Point) => boolean,
  handleUnclick: () => void,

  getCurrentScale: () => number,

  draw: () => void,
  drawEdge: () => void,
  drawNodes: () => void,

  toJSON: () => FloorplanImageJSON | {},
}

export interface Localization {
  en: string,
  de: string,
}