
import { useFloorplanImageStore } from '../store/floorplanImageStore'
import { useGraphStore } from '../store/graphStore'
import { useStateStore } from '../store/stateStore'


export function setState() {
  const { setState } = useStateStore()
  setState(createState())
}

function createState(): string {
  const { labels, openables, furniture, floorplanImage } = useFloorplanImageStore()
  const { graph } = useGraphStore()

  return JSON.stringify({ graph, labels, openables, furniture, floorplanImage }, null, "");
}

