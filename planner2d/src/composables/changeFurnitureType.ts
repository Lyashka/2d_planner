import { FurnitureType } from '../defs'
import { drawMain } from './drawMain'

import { useSettingsStore } from '../store/settingsStore'

export function changeFurnitureType(e: MouseEvent, type: FurnitureType) {
  const { settings } = useSettingsStore()
  settings.value.type = type;
  drawMain();
}