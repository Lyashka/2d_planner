import { Movable } from './Movable'
import { Dim, Mode, MovableType, Point, RectangleJSON } from '../defs'
import { useCanvasStore} from '../store/canvasStore'
import { useSettingsStore } from '../store/settingsStore'
import { useProjectionStore } from '../store/projectionStore'

import { toRad, rotate, pointInCircle, translate, angleBetweenPoints, handleSnap } from '../composables/calculations'
import { setFontSize, drawDistance, restoreDefaultContext, drawDistanceToNextWall } from '../composables/updateCtx'
import { handleRemove } from '../composables/handleRemove'

export class Rectangle extends Movable {
  name: string
  p: Point
  dims: Dim[]
  angle: number

  constructor(name: string, type: MovableType, x: number, y: number, w: number, h: number) {
    super(type)
    this.name = name
    this.p = {
      x,
      y
    }
    this.dims = [
      {
        w,
        h
      }
    ]
    this.angle = 0
  }

  getMaxDim(): Dim {
    let result = { w: 0, h: 0 }
    for (const dim of this.dims) {
      result.w += dim.w
      result.h = Math.max(result.h, dim.h)
    }
    return result
  }

  getMinDim(): Dim {
    let result = { w: 0, h: Number.MAX_VALUE }
    for (const dim of this.dims) {
      result.w += dim.w
      result.h = Math.min(result.h, dim.h)
    }
    return result
  }

  center(): Point {
    const maxDim = this.getMaxDim()
    return {
      x: this.p.x + maxDim.w / 2,
      y: this.p.y + maxDim.h / 2
    }
  }

  pointInRotCircle(other: Point, radius: number): boolean {
    const pRot = rotate(this.center(), other, -this.angle)
    return pointInCircle(translate(this.p, { w: radius, h: radius }), radius, pRot)
  }

  getRotateSize(): number {
    const { settings } = useSettingsStore()
    const minDim = this.getMinDim()
    if (
      minDim.w / 2 <= settings.value.furnitureRotateSize ||
      minDim.h / 2 <= settings.value.furnitureRotateSize
    ) {
      return Math.min(minDim.w, minDim.h) / 2
    }
    return settings.value.furnitureRotateSize
  }

  pointInRotRectangle(other: Point): boolean {
    const pRot = rotate(this.center(), other, -this.angle)
    let currX = this.p.x
    for (const dim of this.dims) {
      if (
        currX <= pRot.x &&
        currX + dim.w >= pRot.x &&
        this.p.y <= pRot.y &&
        this.p.y + dim.h >= pRot.y
      ) {
        return true
      }
      currX += dim.w
    }
    return false
  }

  setFontSize() {
    const { ctx } = useCanvasStore()
    setFontSize(1)
    const textDim = ctx.value.measureText(this.name)
    const minDim = this.getMinDim()
    setFontSize(Math.min(Math.min(160, minDim.h), minDim.w / textDim.width))
  }

  angleSnapPoint(): Point {
    return this.p
  }

  handleClick(e: Point): boolean {
    const { projection } = useProjectionStore()
    console.log(projection)
    if (this.pointInRotCircle(projection.to(e), this.getRotateSize() / 2)) {
      this.rotate = true
      this.delta.x = e.x
      this.delta.y = e.y
      return true
    } else if (this.pointInRotRectangle(projection.to(e))) {
      this.translate = true
      this.delta.x = e.x
      this.delta.y = e.y
      return true
    }
    return false
  }

  handleMove(e: Point): boolean {
    const { projection } = useProjectionStore()
    const { settings } = useSettingsStore()
    let changed = false
    if (this.translate) {
      changed = true

      this.p.x += (e.x - this.delta.x) / projection.scale
      this.p.y += (e.y - this.delta.y) / projection.scale

      this.delta.x = e.x
      this.delta.y = e.y

      handleRemove(e, this)
    } else if (this.rotate) {
      changed = true
      const a = angleBetweenPoints(projection.from(this.center()), this.delta, e)
      if (
        !handleSnap(
          this,
          [360, 270, 180, 90],
          Math.abs((this.angle + a + 360) % 360),
          settings.value.furnitureSnapAngle
        )
      ) {
        this.angle += a

        this.delta.x = e.x
        this.delta.y = e.y
      }
    }

    return changed
  }

  draw() {
    const { settings } = useSettingsStore()
    const { ctx } = useCanvasStore()
    ctx.value.save()

    const c = this.center()
    const maxDim = this.getMaxDim()
    const minDim = this.getMinDim()

    ctx.value.translate(c.x, c.y)
    ctx.value.rotate(toRad(this.angle))

    this.setStyle(settings.value.mode === Mode.Room, true)

    if (this.dims.length > 0) {
      ctx.value.beginPath()

      let currX = -maxDim.w / 2
      let currY = -maxDim.h / 2

      let prevDim: Dim | null = null
      for (const dim of this.dims) {
        if (prevDim !== null) {
          currY += dim.h - prevDim.h
          ctx.value.lineTo(currX, currY)
          currX += dim.w
          ctx.value.lineTo(currX, currY)
        } else {
          ctx.value.moveTo(currX, currY)
          currY += dim.h
          ctx.value.lineTo(currX, currY)
          currX += dim.w
          ctx.value.lineTo(currX, currY)
        }
        prevDim = dim
      }

      currY = -maxDim.h / 2
      ctx.value.lineTo(currX, currY)
      ctx.value.closePath()

      ctx.value.stroke()
    }

    ctx.value.beginPath()

    this.setFontSize()
    ctx.value.textBaseline = 'middle'
    ctx.value.fillText(this.name, 0, -maxDim.h / 2 + minDim.h / 2, minDim.w)
    ctx.value.textBaseline = 'alphabetic'

    const rotateSize = this.getRotateSize()

    if (settings.value.mode === Mode.Furniture) {
      ctx.value.beginPath()
      ctx.value.arc(
        -maxDim.w / 2 + rotateSize / 2,
        -maxDim.h / 2 + rotateSize / 2,
        rotateSize / 2,
        0,
        2 * Math.PI
      )
      ctx.value.stroke()
    }

    if (this.translate || this.rotate) {
      setFontSize(rotateSize)

      ctx.value.beginPath()

      ctx.value.moveTo(-maxDim.w / 2, -maxDim.h / 2 + rotateSize)
      ctx.value.lineTo(-maxDim.w / 2 + maxDim.w, -maxDim.h / 2 + rotateSize)
      drawDistance(0, -maxDim.h / 2 + rotateSize, maxDim.w, null, 'mm')

      ctx.value.moveTo(-maxDim.w / 2 + rotateSize, -maxDim.h / 2)
      ctx.value.lineTo(-maxDim.w / 2 + rotateSize, -maxDim.h / 2 + maxDim.h)

      ctx.value.translate(-maxDim.w / 2 + rotateSize, 0)
      ctx.value.rotate(toRad(-90))
      drawDistance(0, 0, maxDim.h, null, 'mm')

      ctx.value.stroke()
    }

    ctx.value.restore()

    this.drawWallDistances()
    restoreDefaultContext()
  }

  drawWallDistances() {
    const { settings } = useSettingsStore()
    const { ctx } = useCanvasStore()
    if (this.translate || this.rotate) {
      ctx.value.save()

      this.setStyle(settings.value.mode === Mode.Room, true)
      const rotateSize = this.getRotateSize()
      setFontSize(rotateSize * 1.5)

      const center = this.center()
      const maxDim = this.getMaxDim()

      // right
      drawDistanceToNextWall(
        center,
        rotate(center, { x: center.x + maxDim.w / 2, y: center.y }, this.angle)
      )
      // left
      drawDistanceToNextWall(
        center,
        rotate(center, { x: center.x - maxDim.w / 2, y: center.y }, this.angle)
      )
      // top
      drawDistanceToNextWall(
        center,
        rotate(center, { x: center.x, y: center.y - maxDim.h / 2 }, this.angle)
      )
      // bottom
      drawDistanceToNextWall(
        center,
        rotate(center, { x: center.x, y: center.y + maxDim.h / 2 }, this.angle)
      )

      ctx.value.restore()
    }
  }

  toJSON(): RectangleJSON {
    return {
      mov: super.movableToJSON(),
      name: this.name,
      p: this.p,
      dims: this.dims,
      angle: this.angle
    }
  }
}