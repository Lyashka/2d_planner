import { getCurrProjection } from './getCurrProjection'
import { Mode, optionalNumber, Point } from '../defs'
import { drawMain } from './drawMain'

import { useCanvasStore } from '../store/canvasStore'
import { useSettingsStore } from '../store/settingsStore'
import { useFloorplanImageStore } from '../store/floorplanImageStore'
import { useGraphStore } from '../store/graphStore'

export function zoomToMiddle(factor: number) {
  const { canvas } = useCanvasStore()
  zoom({ x: canvas.value.width / 2, y: canvas.value.height / 2 }, factor);
}

export function centerProjection() {
  const { graph, floorPlanGraph} = useGraphStore()
  const { floorplanImage, openables ,labels, furniture } = useFloorplanImageStore()
  const { settings } = useSettingsStore()
  const { canvas } = useCanvasStore()
  const proj = getCurrProjection();
  let minX: optionalNumber = null;
  let minY: optionalNumber = null;
  let maxX: optionalNumber = null;
  let maxY: optionalNumber = null;

  const updateBoundary = (p: Point) => {
    if (minX === null || p.x < minX) { minX = p.x; }
    if (maxX === null || p.x > maxX) { maxX = p.x; }
    if (minY === null || p.y < minY) { minY = p.y; }
    if (maxY === null || p.y > maxY) { maxY = p.y; }
  };

  if (settings.value.mode !== Mode.Floorplan) {
    for (const openable of openables) {
      updateBoundary(openable.p);
    }
    for (const label of labels) {
      updateBoundary(label.p);
    }
    for (const fur of furniture) {
      updateBoundary(fur.center());
    }
    for (const node of Object.values(graph.nodes)) {
      updateBoundary(node.p);
    }
  }else{
    for (const openable of openables) {
      updateBoundary(openable.p);
    }
    for (const label of labels) {
      updateBoundary(label.p);
    }
    for (const fur of furniture) {
      updateBoundary(fur.center());
    }
    for (const node of Object.values(floorPlanGraph.nodes)) {
      updateBoundary(node.p);
    }
  }

  if (floorplanImage.value.image) {
    updateBoundary(floorplanImage.value.node1.p);
    updateBoundary(floorplanImage.value.node2.p);
    const image = floorplanImage.value.image;
    const imageScale = floorplanImage.value.getCurrentScale();
    updateBoundary({ x: image.x, y: image.y });
    updateBoundary({ x: image.x + image.width * imageScale, y: image.y + image.height * imageScale });
  }

  if (minX === null || minY === null || maxX === null || maxY === null) {
    return;
  }

  {// fix zoom with 20% border
    const a = proj.to({ x: 0, y: 0 });
    const b = proj.to({ x: canvas.value.width, y: canvas.value.height });
    const zoomValue = Math.min((b.x - a.x) / ((maxX - minX) * 1.2), (b.y - a.y) / ((maxY - minY) * 1.2));
    zoom(proj.p, zoomValue);
  }

  {// fix view of projection to middle
    const a = proj.to({ x: 0, y: 0 });
    const b = proj.to({ x: canvas.value.width, y: canvas.value.height });

    const newP = proj.from({ x: (minX + maxX) / 2 - (b.x - a.x) / 2, y: (minY + maxY) / 2 - (b.y - a.y) / 2 });
    proj.p = { x: proj.p.x - newP.x, y: proj.p.y - newP.y };
  }
  drawMain();
}

export function zoomEvent(e: WheelEvent) {
  const { settings } = useSettingsStore()
  zoom(e, e.deltaY > 0 ? 1 / settings.value.zoomFactor : e.deltaY < 0 ? settings.value.zoomFactor : null);
}

export function zoom(p: Point, factor: optionalNumber) {
  const { settings } = useSettingsStore()
  if (factor !== null) {
    const proj = getCurrProjection();
    const newScale = proj.scale * factor;
    if (newScale > settings.value.minZoom && newScale < settings.value.maxZoom) {
      proj.scale = newScale;
      proj.p.x = p.x - (p.x - proj.p.x) * factor;
      proj.p.y = p.y - (p.y - proj.p.y) * factor;

      drawMain();
    }
  }
}