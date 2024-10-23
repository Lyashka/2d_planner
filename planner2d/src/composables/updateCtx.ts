import { getCurrProjection } from './getCurrProjection'
import { useCanvasStore } from '../store/canvasStore'
import { useGraphStore } from '../store/graphStore'
import { useSettingsStore } from '../store/settingsStore'
import { Point, Mode } from '../defs'
import { distance } from './calculations'


export function drawDistance(x: number, y: number, distance: number, precision: number | null = null, unit: string = "", factor: number = 1) {
  const { ctx } = useCanvasStore()
  const distanceInUnit = distance / factor;
  const output = (precision === null ? distanceInUnit : distanceInUnit.toFixed(precision)) + unit;
  ctx.value.fillText(output, x, y, distance);
}

export function restoreDefaultContext() {
  const { ctx } = useCanvasStore()
  const proj = getCurrProjection();
  ctx.value.lineWidth = 1.5 / proj.scale;
  ctx.value.lineJoin = "miter";
  setFontSize(15);
  ctx.value.textAlign = "center";
  ctx.value.textBaseline = "alphabetic";

  ctx.value.fillStyle = "black";
  ctx.value.strokeStyle = "black";
}

export function setFontSize(size: number, fixed: boolean = true, bold: boolean = false) {
  const { ctx } = useCanvasStore()
  const proj = getCurrProjection();
  ctx.value.font = (bold ? "normal 900 " : "") + (size / (fixed ? 1 : proj.scale)) + "px \"Segoe UI\", Arial, Helvetica, sans-serif";
}

export function drawDistanceToNextWall(center: Point, border: Point) {
  const { ctx } = useCanvasStore()
  const { graph, floorPlanGraph} = useGraphStore()
  const { settings } = useSettingsStore()

  const intersectionPoint = settings.value.mode === Mode.Floorplan ? floorPlanGraph.nextEdgeToSegment(center, border) : graph.nextEdgeToSegment(center, border)

  if (intersectionPoint !== null) {
    ctx.value.beginPath()
    ctx.value.moveTo(border.x, border.y)
    ctx.value.lineTo(intersectionPoint.x, intersectionPoint.y)
    ctx.value.stroke()

    const dist = distance(border, intersectionPoint)

    ctx.value.save()

    ctx.value.translate((border.x + intersectionPoint.x) / 2, (border.y + intersectionPoint.y) / 2)
    const angle = Math.atan2(border.y - intersectionPoint.y, border.x - intersectionPoint.x)

    ctx.value.rotate(angle < -Math.PI / 2 || angle > Math.PI / 2 ? angle + Math.PI : angle)

    ctx.value.beginPath()
    drawDistance(0, 0, dist, 0, "mm")
    ctx.value.stroke()

    ctx.value.restore()
  }
}