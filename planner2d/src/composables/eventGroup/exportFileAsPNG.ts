import { useCanvasStore } from '../../store/canvasStore'

export function exportButton() {
  const { canvas } = useCanvasStore()
  const pom = document.createElement("a")
  pom.setAttribute("href", canvas.value.toDataURL())

  pom.setAttribute("download", "house.png")

  pom.style.display = "none"
  document.body.appendChild(pom)

  pom.click()

  document.body.removeChild(pom)
}