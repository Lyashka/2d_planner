import { Direction } from '../defs'
import { getCurrProjection } from './getCurrProjection'
import { drawMain } from './drawMain'

import { useCanvasStore } from '../store/canvasStore'

export function moveProjection(direction: Direction) {
  const { canvas } = useCanvasStore()
  const proj = getCurrProjection();

  switch (direction) {
    case Direction.Up: {
      proj.p.y -= canvas.value.height / 20;
      break;
    }
    case Direction.Down: {
      proj.p.y += canvas.value.height / 20;
      break;
    }
    case Direction.Left: {
      proj.p.x -= canvas.value.width / 20;
      break;
    }
    case Direction.Right: {
      proj.p.x += canvas.value.width / 20;
      break;
    }
  }
  drawMain();
}