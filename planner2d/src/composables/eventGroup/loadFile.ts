import { getText } from '../getText'
import { loc } from '../loc'
import { CornerJSON, EdgeJSON, EllipseJSON, FloorplanImageJSON, Graph, MovableType, RectangleJSON } from '../../defs'
import { CornerNode } from '../../classes/CornerNode'
import { setState } from '../setState'
import { drawMain } from '../drawMain'

import { useGraphStore } from '../../store/graphStore'
import { useFloorplanImageStore } from '../../store/floorplanImageStore'

import { Rectangle } from '../../classes/Rectangle'
import { Openable } from '../../classes/Openable'
import { Circle } from '../../classes/Circle'
import { Ellipse } from '../../classes/Ellipse'

export function loadInput(inputUpload) {


  const files = inputUpload.value.files;
  const file = files?.item(0)

  if (!file) {
    return;
  }

  const reader = new FileReader();
  reader.readAsText(file, "UTF-8");

  reader.onload = readerEvent => {
    const target = readerEvent.target;
    if (target) {
      const content = target.result as string;
      loadFloorplan(content, file.name)
    }
  };
}

function loadFloorplan(content: string, fileName: string) {
  const { floorplanImage, labels, openables, furniture } = useFloorplanImageStore()
  const { graph } = useGraphStore()
  let floorPlanner;
  try {
    floorPlanner = JSON.parse(content);
  } catch (err) {
    alert(getText(loc.fileIO.errorAtFile) + " " + fileName + ".\n\n" + getText(loc.fileIO.errorMessage) + "\n" + err);
    console.error(err);
    return;
  }
  console.log(graph)
  graph.reset();
  labels.length = 0;
  openables.length = 0;
  furniture.length = 0;
  floorplanImage.value.reset();

  if (floorPlanner.graph) {
    let maxId = -1;
    for (const id in floorPlanner.graph.nodes) {
      const node = floorPlanner.graph.nodes[id] as CornerJSON;
      if (maxId < node.id) {
        maxId = node.id;
      }
      graph.nodes[node.id] = new CornerNode(node.id, node.p.x, node.p.y);
    }
    graph.count = maxId + 1;

    for (const i in floorPlanner.graph.edges) {
      for (const j in floorPlanner.graph.edges[i]) {
        const edge = floorPlanner.graph.edges[i][j] as EdgeJSON;
        graph.addEdge(edge.id1, edge.id2);
      }
    }
  }

  if (floorPlanner.labels) {
    for (const label of floorPlanner.labels) {
      labels.push(loadRectangle(label as RectangleJSON));
    }
  }

  if (floorPlanner.openables) {
    for (const openable of floorPlanner.openables) {
      openables.push(loadOpenable(openable as OpenableJSON, graph));
      console.log(openables)
    }
  }

  if (floorPlanner.furniture) {
    for (const fur of floorPlanner.furniture) {
      switch (fur.mov.type) {
        case MovableType.Circle: {
          furniture.push(loadCircle(fur as CircleJSON));
          break;
        }
        case MovableType.Ellipse: {
          furniture.push(loadEllipse(fur as EllipseJSON));
          break;
        }
        case MovableType.Rectangle:
        case MovableType.L:
        case MovableType.U: {
          furniture.push(loadRectangle(fur as RectangleJSON));
          break;
        }
      }
    }
  }

  if (floorPlanner.floorplanImage && floorPlanner.floorplanImage.image) {
    const floorplanImageJson = floorPlanner.floorplanImage as FloorplanImageJSON;
    const img = new Image();
    img.onload = (onLoadResult) => {
      const image = onLoadResult.target as HTMLImageElement;
      floorplanImage.image = image;

      setState();
      drawMain();
    };
    img.onerror = () => {
      alert(getText(loc.fileIO.errorAtFile) + ".");
    };
    img.src = floorplanImageJson.image;

    floorplanImage.value.distance = floorplanImageJson.distance;

    const node1 = floorplanImageJson.node1;
    floorplanImage.value.node1 = new CornerNode(node1.id, node1.p.x, node1.p.y);

    const node2 = floorplanImageJson.node2;
    floorplanImage.value.node2 = new CornerNode(node2.id, node2.p.x, node2.p.y);
  }

  setState();

  drawMain();
}

function loadRectangle(rect: RectangleJSON): Rectangle {
  const newFur = new Rectangle(rect.name, rect.mov.type, rect.p.x, rect.p.y, 100, 100);
  newFur.dims = rect.dims;
  newFur.angle = rect.angle;
  newFur.stroke = rect.mov.stroke;
  newFur.fill = rect.mov.fill;
  return newFur;
}

function loadOpenable(openable: OpenableJSON, graph: Graph): Openable {
  const newOpenable = new Openable(openable.openableType, openable.p.x, openable.p.y, openable.dim.w, openable.dim.h);
  newOpenable.angle = openable.angle;

  newOpenable.snap.pos = openable.snap.pos;
  newOpenable.snap.orientation = openable.snap.orientation;
  if (openable.snap.edge) {
    console.log(graph)
    newOpenable.snap.edge = graph.edges[openable.snap.edge.id1]![openable.snap.edge.id2]!;
    newOpenable.snap.edge.snapOpenables.push(newOpenable);
  }

  newOpenable.stroke = openable.mov.stroke;
  newOpenable.fill = openable.mov.fill;
  return newOpenable;
}

function loadCircle(circle: CircleJSON): Circle {
  const newCircle = new Circle(circle.name, circle.c.x, circle.c.y, circle.r);
  newCircle.stroke = circle.mov.stroke;
  newCircle.fill = circle.mov.fill;
  return newCircle;
}

function loadEllipse(ellipse: EllipseJSON): Ellipse {
  const newEllipse = new Ellipse(ellipse.name, ellipse.c.x, ellipse.c.y, ellipse.rX, ellipse.rY);
  newEllipse.stroke = ellipse.mov.stroke;
  newEllipse.fill = ellipse.mov.fill;
  newEllipse.angle = ellipse.angle;
  return newEllipse;
}
