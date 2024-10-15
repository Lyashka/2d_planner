import { Localization } from '../defs'
import { useSettingsStore} from '../store/settingsStore'

export function getText(element: Localization): string {
  const { settings } = useSettingsStore()
  const key = settings.value.language as keyof typeof element;
  return key in element ? element[key] : element.en;
}