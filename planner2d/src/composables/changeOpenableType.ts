import { OpenableType } from '../defs'
import { drawMain } from './drawMain'

import { useSettingsStore } from '../store/settingsStore'

export function changeOpenableType(e: MouseEvent, type: OpenableType) {
  const { settings } = useSettingsStore()
  // resetElements("openableType");
  settings.value.openableType = type;
  // (e.currentTarget as HTMLButtonElement).className += " active";
  drawMain();
}