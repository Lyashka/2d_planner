
import { useGraphStore } from '../../store/graphStore'
import { useFloorplanImageStore } from '../../store/floorplanImageStore'
import { setState } from '../setState'


export function saveAsJsonFile() {
  const { graph } = useGraphStore()
  const { labels, openables, furniture, floorplanImage } = useFloorplanImageStore()
  const pom = document.createElement("a")
  pom.setAttribute("href", "data:text/plain;charset=utf-8," +
    encodeURIComponent(JSON.stringify({ graph, labels, openables, furniture, floorplanImage }, null, " ")))

  pom.setAttribute("download", "house.json")

  pom.style.display = "none"
  document.body.appendChild(pom)

  pom.click();

  document.body.removeChild(pom)

  setState()
}