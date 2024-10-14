import { Point } from '../defs'
import { Movable } from '../classes/Movable'
import { CornerNode } from '../classes/CornerNode'

import { useCanvasStore } from '../store/canvasStore'
import { useSettingsStore } from '../store/settingsStore'

function willRemove(p: Point): boolean {
  const { canvas } = useCanvasStore()
  const { settings } = useSettingsStore()
  return p.x >= canvas.value.width - settings.value.deleteDim.w && p.x <= canvas.value.width && p.y >= 0 && p.y <= settings.value.deleteDim.h;
}

export function handleRemove(p: Point, elem: Movable | CornerNode) {
  if (willRemove(p)) {
    elem.remove = true;
    settings.value.isRemove = true;
  } else {
    if (elem.remove) {
      settings.value.isRemove = false;
    }
    elem.remove = false;
  }
}