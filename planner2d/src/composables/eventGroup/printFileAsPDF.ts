import {useCanvasStore } from '../../store/canvasStore'

export function printButton() {
  const { canvas } = useCanvasStore()
  const dataUrl = canvas.value.toDataURL()

  let content = "<!DOCTYPE html>"
  content += "<html>"
  content += "<head><title>Name planner</title></head>"
  content += "<body>"
  content += "<img src=\"" + dataUrl + "\""
  content += "</body>"
  content += "</html>"

  const printWin = window.open("", "", "width=" + screen.availWidth + ",height=" + screen.availHeight)
  if (printWin !== null) {
    printWin.document.open()
    printWin.document.write(content)

    printWin.document.addEventListener('load', function () {
      printWin.focus()
      printWin.print()
      printWin.document.close()
      printWin.close()
    }, true)
  }
}