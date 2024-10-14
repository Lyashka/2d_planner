import { Mode } from '../defs'
import { useSettingsStore} from '../store/settingsStore'
import { useProjectionStore } from '../store/projectionStore'



export function getCurrProjection() {
  const { settings } = useSettingsStore()
  const { projection, floorplanProjection } = useProjectionStore()

  return settings.value.mode === Mode.Floorplan ? floorplanProjection : projection;
}