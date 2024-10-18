<template>
<v-layout>
  <v-main>
    <div id="container">


      <div id="content">
        <canvas id="canvas">Your browser does not support the HTML 5 Canvas.</canvas>

        <div class="navBar">
          <button type="button" id="navZoomIn" class="navBarButton" @click="navZoomIn">⊕</button>
          <button type="button" id="navCenter" class="navBarButton" @click="navCenter">⊚</button>
          <button type="button" id="navZoomOut" class="navBarButton" @click="navZoomOut">⊖</button>
        </div>







        <div id="sidebar">

          <div class="tab mode buttonRow">
            <button type="button" id="floorplanButton" class="tabLinks mode" @click="changeToFloorplanMode">floorplan</button>
            <button type="button" id="roomButton" class="tabLinks mode" @click="changeToRoomMode">room</button>
            <button type="button" id="furnitureButton" class="tabLinks mode" @click="changeToFurnitureMode">furniture</button>
            <button type="button" id="presentationButton" class="tabLinks mode" @click="changeToPresentationMode">presentation</button>
          </div>

          <table>
            <tbody>
            <tr>
              <td><label id="distanceInputLabel" for="distanceInput"></label></td>
              <td class="inputTD">
                <input type="number" id="distanceInput" class="w100pc" min="1" value="1000" required="">
              </td>
            </tr>
            <tr>
              <td colspan="2">
                <label id="loadFloorplanButton" class="loadInputClass w100pc" for="loadFloorplan"></label>
                <input type="file" id="loadFloorplan" class="loadFileClass">
              </td>
            </tr>
            <tr>
              <td colspan="2">
                <button id="clearFloorplanButton" class="addButton"></button>
              </td>
            </tr>
            </tbody>
          </table>



          <table>
            <tbody>
            <tr>
              <td><label id="nameInputLabel" for="nameInput"></label></td>
              <td class="inputTD">
                <input id="nameInput" class="w100pc" value="Couch" v-model="nameInput">
              </td>
            </tr>
            <tr>
              <td><label id="typeInputLabel" for="circleButton"></label></td>
              <td class="tab furnitureType buttonRow">
                <button type="button" id="circleButton" class="tabLinks furnitureType" @click="changeToCircleType">○</button>
                <button type="button" id="rectangleButton" class="tabLinks furnitureType" @click="changeToRectangleType">▭</button>
                <button type="button" id="LButton" class="tabLinks furnitureType" @click="changeToLType">╔</button>
                <button type="button" id="UButton" class="tabLinks furnitureType" @click="changeToUType">╔╗</button>
              </td>
            </tr>
            <tr>
              <td><label id="circleWidthInputLabel" for="circleWidthInput">Круг</label></td>
              <td class="inputTD">
                <input type="number" id="circleWidthInput" class="w100pc" min="1" value="1000" required="" v-model="circleWidthInput">
                <input type="number" id="circleHeightInput" class="w100pc" min="1" value="1000" required="" v-model="circleHeightInput">
              </td>
            </tr>

            <tr>
              <td><label id="widthInputLabel" for="widthInput">Прямоугольник</label></td>
              <td class="inputTD">
                <input type="number" id="widthInput" class="w100pc" min="1" value="2000" required="" v-model="widthInput">
                <input type="number" id="heightInput" class="w100pc" min="1" value="1000" required="" v-model="heightInput">
              </td>
            </tr>

            <tr>
              <td><label id="LWidthInputLabel" for="LWidthInput1">Г-образная</label></td>
              <td class="inputTD">
                <input type="number" id="LWidthInput1" class="w50pc" min="1" value="1000" required="" v-model="LWidthInput1">
                <input type="number" id="LWidthInput2" class="w50pc" min="1" value="1000" required="" v-model="LWidthInput2">
              </td>
              <td class="inputTD">
                <input type="number" id="LHeightInput1" class="w50pc" min="1" value="2000" required="" v-model="LHeightInput1">
                <input type="number" id="LHeightInput2" class="w50pc" min="1" value="1000" required="" v-model="LHeightInput2">
              </td>
            </tr>


            <tr>
              <td><label id="UWidthInputLabel" for="UWidthInput1">П-образная</label></td>
              <td class="inputTD">
                <input type="number" id="UWidthInput1" class="w33pc" min="1" value="1000" required="" v-model="UWidthInput1">
                <input type="number" id="UWidthInput2" class="w33pc" min="1" value="1000" required="" v-model="UWidthInput2">
                <input type="number" id="UWidthInput3" class="w33pc" min="1" value="1000" required="" v-model="UWidthInput3">
              </td>
              <td class="inputTD">
                <input type="number" id="UHeightInput1" class="w33pc" min="1" value="2000" required="" v-model="UHeightInput1">
                <input type="number" id="UHeightInput2" class="w33pc" min="1" value="1000" required="" v-model="UHeightInput2">
                <input type="number" id="UHeightInput3" class="w33pc" min="1" value="2000" required="" v-model="UHeightInput3">
              </td>
            </tr>

            <tr>
              <td colspan="2">
                <button id="addFurnitureButton" class="addButton" @click="addFurnitureButton">add Furniture</button>
              </td>
            </tr>
            </tbody>
          </table>

          <!--         Чекбоксы и кнопки СОХРАНИТЬ, ЗАГРУЗИТЬ, ЭКСПОРТ, ПРИНТ-->
          <div style="display: flex; flex-direction: column">
            <label for="edgeLabelCheckbox">Длины стен</label>
            <input type="checkbox" id="edgeLabelCheckbox" class="checkboxClass" v-model="edgeLabelCheckbox" @input="edgeLabelCheckboxInput">

            <label for="roomSizeCheckbox">Квадратные метры помещения</label>
            <input type="checkbox" id="roomSizeCheckbox" class="checkboxClass" v-model="roomSizeCheckbox" @input="roomSizeCheckboxInput">
            <button type="button" id="saveButton" @click="saveButton">save</button>
            <label id="loadButton" class="loadInputClass" for="loadInput">load</label>
            <input type="file" id="loadInput" class="loadFileClass" @input="loadInput">
            <button type="button" id="exportButton" @click="exportButton">export</button>
            <button type="button" id="printButton" @click="printButton">print</button>
          </div>

        </div>


        <div>
          <!--        Изменение размера узлов-->
          <label id="nodeTransSliderLabel" for="nodeTransSlider">Corner Size</label>
          <input type="range" id="nodeTransSlider" class="w100pc" min="5" max="750" v-model="nodeTransSlider" @input="setNodeTransSize">
          <label id="nodeExtendSliderLabel" for="nodeExtendSlider">Label</label>
          <input type="range" id="nodeExtendSlider" class="w100pc" min="5" max="750" v-model="nodeExtendSlider" @input="setNodeExtendSize">

          <!--        Добавление лейблов-->
          <label id="labelNameInputLabel" for="labelNameInput">  name</label>
          <input id="labelNameInput" value="Livingroom" class="w100pc" v-model="labelNameInput">
          <label id="labelHeightInputLabel" for="labelHeightInput">heigth</label>
          <input type="number" id="labelHeightInput" class="w100pc" min="1" value="1000" required="" v-model="labelHeightInput">
          <button id="addLabelButton" class="addButton" @click="addLabelButton">add lable</button>


          <!--        Добавление дверей-->
          <label id="openableWidthInputLabel" for="openableWidthInput">Door/Window</label>
          <input type="number" id="openableWidthInput" class="w100pc" min="1" v-model="openableWidthInput" required="">
          <label id="openableTypeInputLabel" for="leftOpenableButton"> type</label>
          <button type="button" id="leftOpenableButton" class="tabLinks openableType" @click="changeToLeftOpenableType" >L</button>
          <button type="button" id="rightOpenableButton" class="tabLinks openableType" @click="changeToRightOpenableType" >R</button>
          <button type="button" id="doubleOpenableButton" class="tabLinks openableType" @click="changeToDoubleOpenableType">D</button>
          <button id="addOpenableButton" class="addButton" @click="addOpenableButton"> add </button>
        </div>

      </div>


    </div>
  </v-main>

  <SideBar/>
</v-layout>


</template>

<script setup lang="ts">
import SideBar from './components/SideBar.vue'



import { onMounted, ref } from 'vue'

import {
  Mode,
  MovableType,
  OpenableType,
  FurnitureType,
  Point,
  Dim,
  Direction,
  optionalPoint,
  optionalString,
  optionalNumber,
  CornerSnap,
  CornerJSON,
  EdgeJSON,
  RectangleJSON,
  CornerNodes,
  Edges,
  GraphJSON,
  Graph,
  EllipseJSON,
  FloorplanImageJSON,
  FloorplanImage,
  Localization

} from './defs'

import { useCanvasStore } from './store/canvasStore'
import { useSettingsStore } from './store/settingsStore'
import { useProjectionStore} from './store/projectionStore'
import { useGraphStore } from './store/graphStore'
import { useFloorplanImageStore } from './store/floorplanImageStore'

import { Openable } from './classes/Openable'
import { Movable } from './classes/Movable'
import { CornerNode } from './classes/CornerNode'
import { Edge } from './classes/Edge'
import { Rectangle } from './classes/Rectangle'
import { Circle } from './classes/Circle'
import { Ellipse} from './classes/Ellipse'

import { getCurrProjection } from './composables/getCurrProjection'
import { handleRemove } from './composables/handleRemove'
import { drawMain } from './composables/drawMain'
import { setFontSize, drawDistance, restoreDefaultContext, drawDistanceToNextWall } from './composables/updateCtx'
import { getText } from './composables/getText'
import { zoomToMiddle, centerProjection, zoomEvent, zoom } from './composables/zoomProjection'
import { moveProjection } from './composables/moveProjection'
import { changeOpenableType } from './composables/changeOpenableType'
import { changeFurnitureType } from './composables/changeFurnitureType'

import { loc } from './composables/loc'

import {
  toRad,
  toDeg,
  rotate,
  angleBetweenPoints,
  toNextNumber,
  distance,
  translate,
  pointInCircle,
  getIntersectionPoint,
  getTrapezoidArea,
  handleSnap
} from './composables/calculations'

const { canvas, ctx } = useCanvasStore()
const { settings } = useSettingsStore()
const { projection, floorplanProjection } = useProjectionStore()
const { graph } = useGraphStore()
const { floorplanImage, labels, openables, furniture } = useFloorplanImageStore()


// state will lazily track changes since init or last save/load as string
let state: optionalString = null;












// под новую верстку переделать
const floorplanButton = ref({})
const roomButton = ref({})
const furnitureButton = ref({})
const presentationButton = ref({})


function changeMode(e: MouseEvent, mode: Mode) {
  // resetElements("mode");

  settings.value.mode = mode;

  switch (mode) {
    case Mode.Floorplan: {
      floorplanButton.value = { display: 'block' }
      break;
    }
    case Mode.Room: {
      roomButton.value = { display: 'block' }
      break;
    }
    case Mode.Furniture: {
      furnitureButton.value = { display: 'block'}
      break;
    }
    case Mode.Presentation: {
      presentationButton.value = { display: 'block', color: 'red' }
      break;
    }
  }
  // (e.currentTarget as HTMLButtonElement).className += " active";

  drawMain();
}

//функции переключения режима работы со схемой
function changeToFloorplanMode(e: MouseEvent) { changeMode(e, Mode.Floorplan); }
function changeToRoomMode(e: MouseEvent) { changeMode(e, Mode.Room); }
function changeToFurnitureMode(e: MouseEvent) { changeMode(e, Mode.Furniture); }
function changeToPresentationMode(e: MouseEvent) { changeMode(e, Mode.Presentation); }


//Функции переключения типв дверей для режима room
function changeToLeftOpenableType(e: MouseEvent) { changeOpenableType(e, OpenableType.Left); }
function changeToRightOpenableType(e: MouseEvent) { changeOpenableType(e, OpenableType.Right); }
function changeToDoubleOpenableType(e: MouseEvent) { changeOpenableType(e, OpenableType.Double); }


// Функции переключения типа стола для режима furniture
function changeToRectangleType(e: MouseEvent) { changeFurnitureType(e, FurnitureType.Rectangle); }
function changeToCircleType(e: MouseEvent) { changeFurnitureType(e, FurnitureType.Circle); }
function changeToLType(e: MouseEvent) { changeFurnitureType(e, FurnitureType.L); }
function changeToUType(e: MouseEvent) { changeFurnitureType(e, FurnitureType.U); }





// Room Mode
const labelNameInput = ref('room')
const labelHeightInput = ref(1000)

function addLabelButton() {
  if (!validNumericInput(labelHeightInput.value) || !labelNameInput.value) {
    alert(getText(loc.room.label.inputError));
    return;
  }
  const start = projection.to({ x: 10, y: 100 });
  setFontSize(labelHeightInput.value)
  labels.push(new Rectangle(labelNameInput.value, MovableType.Rectangle, start.x, start.y, ctx.value.measureText(labelNameInput.value).width, labelHeightInput.value));
  console.log("add Label:", labelNameInput.value);
  drawMain();
}

function validNumericInput(...values: number[]) {
  for (const value of values) {
    if (isNaN(value) || value < 1) {
      return false;
    }
  }
  return true;
}

const openableWidthInput = ref(1000)
function addOpenableButton() {
  if (!validNumericInput(openableWidthInput.value)) {
    alert(getText(loc.room.openable.inputError));
    return;
  }
  const start = projection.to({ x: 10, y: 100 })
  openables.push(new Openable(settings.value.openableType, start.x, start.y, openableWidthInput.value, 180))
  console.log("add Openable:", settings.value.openableType)
  drawMain()
}






// Furniture Mode
const nameInput = ref('NameInput')

//Для квадрата
const widthInput = ref(2000)
const heightInput = ref(1000)

//Для круга
const circleWidthInput = ref(1000)
const circleHeightInput = ref(1000)

//Для L-образной фигуры
const LWidthInput1 = ref(1000)
const LHeightInput1 = ref(2000)

const LWidthInput2 = ref(1000)
const LHeightInput2 = ref(1000)

//Для П-образной фигуры
const UWidthInput1 = ref(1000)
const UHeightInput1 = ref(2000)

const UWidthInput2 = ref(1000)
const UHeightInput2 = ref(1000)

const UWidthInput3 = ref(1000)
const UHeightInput3 = ref(2000)

function addFurnitureButton() {

  switch (settings.value.type) {

    case FurnitureType.Rectangle: {
      if (!validNumericInput(widthInput.value, heightInput.value)) {
        alert(getText(loc.furniture.add.inputError));
        return;
      }
      const start = projection.to({ x: 10, y: 100 });
      furniture.push(new Rectangle(nameInput.value, MovableType.Rectangle, start.x, start.y, widthInput.value, heightInput.value));
      break;
    }

    case FurnitureType.Circle: {
      if (!validNumericInput(circleWidthInput.value, circleHeightInput.value)) {
        alert(getText(loc.furniture.add.inputError));
        return;
      }
      const start = projection.to({ x: 10, y: 100 });
      furniture.push(circleWidthInput.value === circleHeightInput.value ?
        new Circle(nameInput.value, start.x + circleWidthInput.value / 2, start.y + circleWidthInput.value / 2, circleWidthInput.value / 2) :
        new Ellipse(nameInput.value, start.x + circleWidthInput.value / 2, start.y + circleHeightInput.value / 2, circleWidthInput.value / 2, circleHeightInput.value / 2));
      break;
    }

    case FurnitureType.L: {
      if (!validNumericInput(LWidthInput1.value, LHeightInput1.value, LWidthInput2.value, LHeightInput2.value)) {
        alert(getText(loc.furniture.add.inputError));
        return;
      }
      const start = projection.to({ x: 10, y: 100 });
      let newRect = new Rectangle(nameInput.value, MovableType.L, start.x, start.y, LWidthInput1.value, LHeightInput1.value);
      newRect.dims.push({ w:  LWidthInput2.value, h: LHeightInput2.value });
      furniture.push(newRect);
      break;
    }

    case FurnitureType.U: {
      if (!validNumericInput(UWidthInput1.value, UHeightInput1.value, UWidthInput2.value, UHeightInput2.value, UWidthInput3.value, UHeightInput3.value)) {
        alert(getText(loc.furniture.add.inputError));
        return;
      }
      const start = projection.to({ x: 10, y: 100 });
      let newRect = new Rectangle(nameInput.value, MovableType.U, start.x, start.y, UWidthInput1.value, UHeightInput1.value);
      newRect.dims.push({ w: UWidthInput2.value, h: UHeightInput2.value });
      newRect.dims.push({ w: UWidthInput3.value, h: UHeightInput3.value });
      furniture.push(newRect);
      break;
    }
  }

  console.log("add %s: %s", settings.value.type, nameInput.value);
  drawMain();
}


// corner node size slider init
const nodeTransSlider = ref(50)
const nodeExtendSlider = ref(150)

// function initNodeSize() {
//   const transSlider = nodeTransSlider.value
//   const extendSlider = nodeExtendSlider.value
//
//   settings.value.nodeTransSize = Number(transSlider.value);
//   settings.value.nodeExtendSize = Number(extendSlider.value);
//
//   setNodeTransSize();
//   setNodeExtendSize();
// }

function setNodeTransSize() {
  settings.value.nodeTransSize = Number(nodeTransSlider.value);
  settings.value.nodeExtendSize = Math.max(settings.value.nodeExtendSize, settings.value.nodeTransSize);

  nodeExtendSlider.value = String(settings.value.nodeExtendSize);

  drawMain();
}

function setNodeExtendSize() {

  settings.value.nodeExtendSize = Number(nodeExtendSlider.value);
  settings.value.nodeTransSize = Math.min(settings.value.nodeExtendSize, settings.value.nodeTransSize);

  nodeTransSlider.value = String(settings.value.nodeTransSize);

  drawMain();
}


const edgeLabelCheckbox = ref(false)
const roomSizeCheckbox = ref(false)

//Checkbox показывать/не показывать длины стен
function edgeLabelCheckboxInput() {
  settings.value.showEdgeLabels = !edgeLabelCheckbox.value
  drawMain();
}

function roomSizeCheckboxInput() {
  settings.value.showRoomSize = !roomSizeCheckbox.value
  drawMain();
}

// function resetOptions() {
//   settings.value.showEdgeLabels = false;
//   edgeLabelCheckbox.value = false
//
//   settings.value.showRoomSize = false;
//   roomSizeCheckbox.value = false
// }

// function addElem(parent: HTMLElement, type: string, text: Localization | null = null): HTMLElement {
//   const elem = document.createElement(type);
//   if (text !== null) {
//     elem.textContent = getText(text);
//   }
//   parent.appendChild(elem);
//   return elem;
// }

// function addListEntry(parent: HTMLElement, type: string, head: Localization, short: Localization): HTMLElement {
//   const elem = document.createElement(type);
//   const headElem = document.createElement("b");
//   headElem.textContent = getText(head) + ": ";
//   const shortElem = document.createTextNode(getText(short));
//   elem.appendChild(headElem);
//   elem.appendChild(shortElem);
//
//   parent.appendChild(elem);
//
//   return headElem;
// }


window.addEventListener("resize", setSize);

function setSize() {
  canvas.value.width = window.innerWidth * 0.8;
  canvas.value.height = window.innerHeight * 0.8;

  drawMain();
}

function touchToCoordinates(t: Touch): Point {
  return { x: t.clientX, y: t.clientY };
}


function mouseDoubleClick(e: Point) {
  if (settings.value.mode === Mode.Furniture) {
    // add furniture double click
  } else if (settings.value.mode === Mode.Room) {
    graph.addNode(toNextNumber(projection.to(e)));
  }
  drawMain();
}

function mouseDown(e: Point) {
  let selected = false;

  if (settings.value.mode === Mode.Floorplan) {
    if (floorplanImage.value.handleClick(e)) {
      selected = true;
    }

    if (!selected) {
      floorplanProjection.drag = true;
      floorplanProjection.delta.x = e.x;
      floorplanProjection.delta.y = e.y;
    }

    drawMain();
    return;
  } else if (settings.value.mode === Mode.Furniture) {
    for (const fur of furniture) {
      if (fur.handleClick(e)) {
        selected = true;
        break;
      }
    }
  } else if (settings.value.mode === Mode.Room) {
    if (graph.handleClick(e)) {
      selected = true;
    }

    if (!selected) {
      for (const openable of openables) {
        if (openable.handleClick(e)) {
          selected = true;
          break;
        }
      }
    }
    if (!selected) {
      for (const label of labels) {
        if (label.handleClick(e)) {
          selected = true;
          break;
        }
      }
    }
  }

  if (!selected) {
    projection.drag = true;
    projection.delta.x = e.x;
    projection.delta.y = e.y;
  }
  drawMain();
}

function mouseMove(e: Point) {
  let changed = false;

  if (settings.value.mode === Mode.Floorplan) {
    if (floorplanImage.value.handleMove(e)) {
      changed = true;
    }

    if (floorplanProjection.drag) {
      changed = true;

      floorplanProjection.p.x += (e.x - floorplanProjection.delta.x);
      floorplanProjection.p.y += (e.y - floorplanProjection.delta.y);

      floorplanProjection.delta.x = e.x;
      floorplanProjection.delta.y = e.y;
    }

    if (changed) {
      drawMain();
    }
    return;
  } else if (settings.value.mode === Mode.Furniture) {
    for (const fur of furniture) {
      if (fur.handleMove(e)) {
        changed = true;
      }
    }
  } else if (settings.value.mode === Mode.Room) {
    if (graph.handleMove(e)) {
      changed = true;
    }
    for (const openable of openables) {
      if (openable.handleMove(e, graph)) {
        changed = true;
      }
    }
    for (const label of labels) {
      if (label.handleMove(e)) {
        changed = true;
      }
    }
  }

  if (projection.drag) {
    changed = true;

    projection.p.x += (e.x - projection.delta.x);
    projection.p.y += (e.y - projection.delta.y);

    projection.delta.x = e.x;
    projection.delta.y = e.y;
  }

  if (changed) {
    drawMain();
  }
}

function mouseUp(e: Point) {
  if (settings.value.mode === Mode.Floorplan) {
    floorplanImage.value.handleUnclick();
  } else if (settings.value.mode === Mode.Furniture) {
    mouseUpForMovables(furniture);
  } else if (settings.value.mode === Mode.Room) {
    graph.handleUnclick(e);
    mouseUpForMovables(openables);
    mouseUpForMovables(labels);
  }

  floorplanProjection.drag = false;
  floorplanProjection.delta.x = 0;
  floorplanProjection.delta.y = 0;

  projection.drag = false;
  projection.delta.x = 0;
  projection.delta.y = 0;

  settings.value.isRemove = false;

  drawMain();
}



function loadOpenable(openable: OpenableJSON, graph: Graph): Openable {
  const newOpenable = new Openable(openable.openableType, openable.p.x, openable.p.y, openable.dim.w, openable.dim.h);
  newOpenable.angle = openable.angle;

  newOpenable.snap.pos = openable.snap.pos;
  newOpenable.snap.orientation = openable.snap.orientation;
  if (openable.snap.edge) {
    console.log(graph)
    newOpenable.snap.edge = graph.edges[openable.snap.edge.id1]![openable.snap.edge.id2]!;
    newOpenable.snap.edge.snapOpenables.push(newOpenable);
  }

  newOpenable.stroke = openable.mov.stroke;
  newOpenable.fill = openable.mov.fill;
  return newOpenable;
}

function loadCircle(circle: CircleJSON): Circle {
  const newCircle = new Circle(circle.name, circle.c.x, circle.c.y, circle.r);
  newCircle.stroke = circle.mov.stroke;
  newCircle.fill = circle.mov.fill;
  return newCircle;
}

function loadEllipse(ellipse: EllipseJSON): Ellipse {
  const newEllipse = new Ellipse(ellipse.name, ellipse.c.x, ellipse.c.y, ellipse.rX, ellipse.rY);
  newEllipse.stroke = ellipse.mov.stroke;
  newEllipse.fill = ellipse.mov.fill;
  newEllipse.angle = ellipse.angle;
  return newEllipse;
}

function loadRectangle(rect: RectangleJSON): Rectangle {
  const newFur = new Rectangle(rect.name, rect.mov.type, rect.p.x, rect.p.y, 100, 100);
  newFur.dims = rect.dims;
  newFur.angle = rect.angle;
  newFur.stroke = rect.mov.stroke;
  newFur.fill = rect.mov.fill;
  return newFur;
}

function createState(): string {
  return JSON.stringify({ graph, labels, openables, furniture, floorplanImage }, null, "");
}

function setState() {
  state = createState();
}

function loadFloorplan(content: string, fileName: string) {
  let floorPlanner;
  try {
    floorPlanner = JSON.parse(content);
  } catch (err) {
    alert(getText(loc.fileIO.errorAtFile) + " " + fileName + ".\n\n" + getText(loc.fileIO.errorMessage) + "\n" + err);
    console.error(err);
    return;
  }
  console.log(graph)
  graph.reset();
  labels.length = 0;
  openables.length = 0;
  furniture.length = 0;
  floorplanImage.value.reset();

  if (floorPlanner.graph) {
    let maxId = -1;
    for (const id in floorPlanner.graph.nodes) {
      const node = floorPlanner.graph.nodes[id] as CornerJSON;
      if (maxId < node.id) {
        maxId = node.id;
      }
      graph.nodes[node.id] = new CornerNode(node.id, node.p.x, node.p.y);
    }
    graph.count = maxId + 1;

    for (const i in floorPlanner.graph.edges) {
      for (const j in floorPlanner.graph.edges[i]) {
        const edge = floorPlanner.graph.edges[i][j] as EdgeJSON;
        graph.addEdge(edge.id1, edge.id2);
      }
    }
  }

  if (floorPlanner.labels) {
    for (const label of floorPlanner.labels) {
      labels.push(loadRectangle(label as RectangleJSON));
    }
  }

  if (floorPlanner.openables) {
    for (const openable of floorPlanner.openables) {
      openables.push(loadOpenable(openable as OpenableJSON, graph));
      console.log(openables)
    }
  }

  if (floorPlanner.furniture) {
    for (const fur of floorPlanner.furniture) {
      switch (fur.mov.type) {
        case MovableType.Circle: {
          furniture.push(loadCircle(fur as CircleJSON));
          break;
        }
        case MovableType.Ellipse: {
          furniture.push(loadEllipse(fur as EllipseJSON));
          break;
        }
        case MovableType.Rectangle:
        case MovableType.L:
        case MovableType.U: {
          furniture.push(loadRectangle(fur as RectangleJSON));
          break;
        }
      }
    }
  }

  if (floorPlanner.floorplanImage && floorPlanner.floorplanImage.image) {
    const floorplanImageJson = floorPlanner.floorplanImage as FloorplanImageJSON;
    const img = new Image();
    img.onload = (onLoadResult) => {
      const image = onLoadResult.target as HTMLImageElement;
      floorplanImage.image = image;

      setState();
      drawMain();
    };
    img.onerror = () => {
      alert(getText(loc.fileIO.errorAtFile) + ".");
    };
    img.src = floorplanImageJson.image;

    floorplanImage.value.distance = floorplanImageJson.distance;

    const node1 = floorplanImageJson.node1;
    floorplanImage.value.node1 = new CornerNode(node1.id, node1.p.x, node1.p.y);

    const node2 = floorplanImageJson.node2;
    floorplanImage.value.node2 = new CornerNode(node2.id, node2.p.x, node2.p.y);
  }

  setState();

  drawMain();
}

// A movable is an abstract object that can be translated and rotated on the canvas


function mouseUpForMovables(movables: (Rectangle | Circle | Ellipse | Openable)[]) {
  for (let i = movables.length - 1; i >= 0; --i) {
    const mov = movables[i]!;
    if (mov.remove) {
      if (mov.type === MovableType.Openable) {
        const openable = mov as Openable;
        if (openable.snap.edge !== null) {
          for (let i = openable.snap.edge.snapOpenables.length - 1; i >= 0; --i) {
            if (openable.snap.edge.snapOpenables[i] === mov) {
              openable.snap.edge.snapOpenables.splice(i, 1);
              break;
            }
          }
        }
      }
      movables.splice(i, 1);
    } else {
      mov.translate = false;
      mov.rotate = false;
      mov.delta.x = 0;
      mov.delta.y = 0;
    }
  }
}

function navZoomIn() {
  zoomToMiddle(Math.pow(settings.value.zoomFactor, 4))
}

function navZoomOut() {
  zoomToMiddle(1 / Math.pow(settings.value.zoomFactor, 4))
}

function navCenter() {
  centerProjection()
}


function loadInput(e) {
  const files = (e.target as HTMLInputElement).files;
  const file = files?.item(0);

  if (!file) {
    return;
  }

  const reader = new FileReader();
  reader.readAsText(file, "UTF-8");

  reader.onload = readerEvent => {
    const target = readerEvent.target;
    if (target) {
      const content = target.result as string;
      loadFloorplan(content, file.name)
    }
  };
}

function saveButton() {
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

function exportButton() {
  const pom = document.createElement("a")
  pom.setAttribute("href", canvas.value.toDataURL())

  pom.setAttribute("download", "house.png")

  pom.style.display = "none"
  document.body.appendChild(pom)

  pom.click()

  document.body.removeChild(pom)
}

function printButton() {
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



onMounted(() => {
  canvas.value = document.getElementById("canvas")
  ctx.value = canvas.value.getContext("2d")

  const defaultObjectGraph = {
    count: 0,
    nodes: {},
    edges: {},
    addNode: function (p: Point): number {
      const id: number = this.count++;
      this.nodes[id] = new CornerNode(id, p.x, p.y);

      console.log("new Node:", id);
      return id;
    },
    removeNode: function (id: number) {
      console.log("remove Node:", id);
      delete this.nodes[id];
      for (const outEdges of Object.values(this.edges)) {
        for (const edge of Object.values(outEdges)) {
          if (edge.id1 === id || edge.id2 === id) {
            this.removeEdge(edge.id1, edge.id2);
          }
        }
      }
      delete this.edges[id];
    },
    addEdge: function (id1: number, id2: number): Edge | null {
      if (id1 === id2) {
        return null;
      }
      console.log("new Edge:", id1, id2);
      const lhsId = id1 < id2 ? id1 : id2;
      const rhsId = id1 < id2 ? id2 : id1;

      this.edges[lhsId] = this.edges[lhsId] || {};
      this.edges[lhsId]![rhsId] = this.edges[lhsId]![rhsId] || new Edge(lhsId, rhsId);

      return this.edges[lhsId]![rhsId]!;
    },
    removeEdge: function (id1: number, id2: number) {
      const lhsId = id1 < id2 ? id1 : id2;
      const rhsId = id1 < id2 ? id2 : id1;

      const outEdges = this.edges[lhsId];
      if (outEdges !== undefined) {
        const edge = outEdges[rhsId];
        if (edge !== undefined) {
          for (const openable of edge.snapOpenables) {
            openable.snap.edge = null;
            openable.snap.pos = null;
            openable.snap.orientation = null;
          }
        }
        delete outEdges[rhsId];
        if (Object.keys(outEdges).length === 0) {
          delete this.edges[lhsId];
        }
      }
    },
    mergeNodes: function (fromId: number, toId: number) {
      console.log("merge:", fromId, toId);
      for (const outEdges of Object.values(this.edges)) {
        for (const edge of Object.values(outEdges)) {
          if (edge.id1 === fromId && edge.id2 !== toId) {
            const newEdge = this.addEdge(toId, edge.id2);
            if (newEdge !== null) {
              newEdge.snapOpenables.push(...edge.snapOpenables);
              for (const openable of edge.snapOpenables) {
                openable.snap.edge = newEdge;
                if (newEdge.id1 !== toId) {
                  openable.snap.pos = 1 - openable.snap.pos!;
                  openable.snap.orientation = (openable.snap.orientation! + 1) % 2;
                }
              }
            }
            edge.snapOpenables.length = 0;
          } else if (edge.id2 === fromId && edge.id1 !== toId) {
            const newEdge = this.addEdge(toId, edge.id1);
            if (newEdge !== null) {
              newEdge.snapOpenables.push(...edge.snapOpenables);
              for (const openable of edge.snapOpenables) {
                if (newEdge.id1 === toId) {
                  openable.snap.pos = 1 - openable.snap.pos!;
                  openable.snap.orientation = (openable.snap.orientation! + 1) % 2;
                }
                openable.snap.edge = newEdge;
              }
            }
            edge.snapOpenables.length = 0;
          }
        }
      }

      this.removeNode(fromId);
    },
    bisect: function (id: number, edge: Edge, pos: number) {
      console.log("bisect (%i, %i) by %i", edge.id1, edge.id2, id);

      const newEdge1 = this.addEdge(id, edge.id1);
      const newEdge2 = this.addEdge(id, edge.id2);

      for (const openable of edge.snapOpenables) {
        const firstPart = openable.snap.pos! <= pos;
        const tempEdge = firstPart ? newEdge1 : newEdge2;
        if (tempEdge !== null) {
          tempEdge.snapOpenables.push(openable);
          openable.snap.edge = tempEdge;
          openable.snap.pos = firstPart ? openable.snap.pos! / pos : (openable.snap.pos! - pos) / (1 - pos);
          if (firstPart && tempEdge.id2 !== id || !firstPart && tempEdge.id1 != id) {
            openable.snap.pos = 1 - openable.snap.pos;
            openable.snap.orientation = (openable.snap.orientation! + 1) % 2;
          }
        }
      }
      edge.snapOpenables.length = 0;
      this.removeEdge(edge.id1, edge.id2);
    },
    reset: function () {
      this.count = 0;
      this.nodes = {};
      this.edges = {};
    },
    nextEdgeToSegment: function (center: Point, p: Point): Point | null {
      let result: Point | null = null;
      let minDist: optionalNumber = null;
      for (const outEdges of Object.values(this.edges)) {
        for (const edge of Object.values(outEdges)) {
          const node1 = this.nodes[edge.id1]!;
          const node2 = this.nodes[edge.id2]!;

          const intersectionPoint: Point | null = getIntersectionPoint(center, p, node1.p, node2.p);
          if (intersectionPoint !== null) {
            const dist = distance(intersectionPoint, p);
            if (minDist === null || dist < minDist) {
              minDist = dist;
              result = intersectionPoint;
            }
          }
        }
      }
      return result;
    },
    // p, the position to check; p is in node position space
    closestNodeToClick: function (p: Point): optionalNumber {
      let minDist: optionalNumber = null;
      let minId: optionalNumber = null;
      for (const node of Object.values(this.nodes)) {
        const dist = distance(p, node.p);
        if (minDist === null || dist < minDist) {
          minDist = dist;
          minId = node.id;
        }
      }
      return minId;
    },
    // snap functionality
    handleNodeToNodeSnap: function (node: CornerNode, p: Point, extendNode: boolean): boolean {
      let minDist: optionalNumber = null;
      for (const other of Object.values(this.nodes)) {
        if (!extendNode && other.id === node.id) {
          continue;
        }
        const dist = distance(other.p, projection.to(p));
        if (dist < settings.value.nodeExtendSize && (minDist === null || dist < minDist)) {
          minDist = dist;
          node.delta = projection.from(other.p);
          node.snap.x = other.id;
          node.snap.y = other.id;

          if (!extendNode) {
            node.p = { x: other.p.x, y: other.p.y };
          }
        }
      }
      return minDist !== null;
    },
    handleNodeToEdgeSnap: function (node: CornerNode, p: Point, extendNode: boolean): boolean {
      const clickPos = projection.to(p);

      let minDist: optionalNumber = null;

      for (const outEdges of Object.values(this.edges)) {
        for (const edge of Object.values(outEdges)) {
          if (!extendNode && (edge.id1 === node.id || edge.id2 === node.id)) {
            continue;
          }

          const node1 = this.nodes[edge.id1];
          const node2 = this.nodes[edge.id2];

          if (node1 === undefined || node2 === undefined) { continue; }

          const t =
            ((node2.p.x - node1.p.x) * (clickPos.x - node1.p.x) + (node2.p.y - node1.p.y) * (clickPos.y - node1.p.y)) /
            ((node2.p.x - node1.p.x) ** 2 + (node2.p.y - node1.p.y) ** 2);

          if (t < 0 || t > 1) {
            continue;
          }
          const dist = Math.abs(
            ((node2.p.x - node1.p.x) * (node1.p.y - clickPos.y) - (node1.p.x - clickPos.x) * (node2.p.y - node1.p.y)) /
            distance(node2.p, node1.p));
          if (dist < settings.value.nodeExtendSize && (minDist === null || dist < minDist)) {
            minDist = dist;

            const proj = toNextNumber({
              x: node1.p.x + t * (node2.p.x - node1.p.x),
              y: node1.p.y + t * (node2.p.y - node1.p.y)
            });

            node.snap.edge = edge;
            node.snap.pos = t;
            node.delta = projection.from(proj);
            if (!extendNode) {
              node.p = proj;
            }
          }
        }
      }

      if (minDist !== null) {
        const axisDist = this.handleNodeToNeighborSnap(node, p, extendNode, false);

        const node1 = this.nodes[node.snap.edge!.id1]!;
        const node2 = this.nodes[node.snap.edge!.id2]!;

        if (node.snap.x !== null &&
          node.snap.x !== node1.id &&
          node.snap.x !== node2.id &&
          (node.snap.y === null ||
            axisDist.x! <= axisDist.y! ||
            node.snap.y === node1.id ||
            node.snap.y === node2.id)) {
          const otherNode = this.nodes[node.snap.x]!;
          const otherPos = (otherNode.p.x - node1.p.x) / (node2.p.x - node1.p.x);
          if (otherPos > 0 && otherPos < 1) {
            const proj = toNextNumber({
              x: otherNode.p.x,
              y: node1.p.y + otherPos * (node2.p.y - node1.p.y),
            });
            node.snap.pos = otherPos;
            node.delta = projection.from(proj);
            if (!extendNode) {
              node.p = proj;
            }
          }
        } else if (node.snap.y !== null &&
          node.snap.y !== node1.id &&
          node.snap.y !== node2.id &&
          (node.snap.x === null ||
            axisDist.y! < axisDist.x! ||
            node.snap.x === node1.id ||
            node.snap.x === node2.id)) {
          const otherNode = this.nodes[node.snap.y]!;
          const otherPos = (otherNode.p.y - node1.p.y) / (node2.p.y - node1.p.y);
          if (otherPos > 0 && otherPos < 1) {
            const proj = toNextNumber({
              x: node1.p.x + otherPos * (node2.p.x - node1.p.x),
              y: otherNode.p.y,
            });
            node.snap.pos = otherPos;
            node.delta = projection.from(proj);
            if (!extendNode) {
              node.p = proj;
            }
          }
        } else {
          node.snap.x = null;
          node.snap.y = null;
        }
      }

      return minDist !== null;
    },
    handleNodeToNeighborSnap: function (node: CornerNode, p: Point, extendNode: boolean, change: boolean): optionalPoint {
      const clickPos = projection.to(p);
      const minDist: optionalPoint = { x: null, y: null };
      for (const other of Object.values(this.nodes)) {
        if (!extendNode && other.id === node.id) {
          continue;
        }
        const dist = { x: Math.abs(other.p.x - clickPos.x), y: Math.abs(other.p.y - clickPos.y) };
        if (dist.x < settings.value.nodeExtendSize && (minDist.x === null || dist.x < minDist.x) && dist.x <= dist.y) {
          minDist.x = dist.x;
          if (change) {
            node.delta.x = projection.from(other.p).x;
            if (!extendNode) {
              node.p.x = other.p.x;
            }
          }
          node.snap.x = other.id;
        } else if (dist.y < settings.value.nodeExtendSize && (minDist.y === null || dist.y < minDist.y) && dist.y < dist.x) {
          minDist.y = dist.y;
          if (change) {
            node.delta.y = projection.from(other.p).y;
            if (!extendNode) {
              node.p.y = other.p.y;
            }
          }
          node.snap.y = other.id;
        }
      }

      return minDist;
    },
    handleNodeSnap: function (node: CornerNode, p: Point, extendNode: boolean) {
      node.snap = { x: null, y: null, edge: null, pos: null };
      if (this.handleNodeToNodeSnap(node, p, extendNode)) {
        return;
      }
      if (this.handleNodeToEdgeSnap(node, p, extendNode)) {
        return;
      }
      const minDist = this.handleNodeToNeighborSnap(node, p, extendNode, true);

      // if no snapping happend
      const proj = toNextNumber({
        x: node.p.x + (p.x - node.delta.x) / projection.scale,
        y: node.p.y + (p.y - node.delta.y) / projection.scale
      });
      if (minDist.x === null) {
        node.snap.x = null;
        if (!extendNode) {
          node.p.x = proj.x;
          node.delta.x = projection.from(proj).x;
        } else {
          node.delta.x = p.x;
        }
      }
      if (minDist.y === null) {
        node.snap.y = null;
        if (!extendNode) {
          node.p.y = proj.y;
          node.delta.y = projection.from(proj).y;
        } else {
          node.delta.y = p.y;
        }
      }
    },
    getFaces: function (): CornerNode[][] {
      let directedEdges: [number, number][] = [];

      let allEdges: { [key: number]: number[] } = {};

      for (const outEdges of Object.values(this.edges)) {
        for (const edge of Object.values(outEdges)) {
          directedEdges.push([edge.id1, edge.id2]);
          directedEdges.push([edge.id2, edge.id1]);

          allEdges[edge.id1] = allEdges[edge.id1] || [];
          allEdges[edge.id2] = allEdges[edge.id2] || [];

          allEdges[edge.id1]!.push(edge.id2);
          allEdges[edge.id2]!.push(edge.id1);
        }
      }

      let nextEdge: { [key: number]: { [key: number]: number } } = {};
      Object.entries(allEdges).forEach(
        ([id1S, outEdges]) => {
          if (outEdges.length === 0) {
            return;
          }
          // wtf; why can I not access the key as number here...
          const id1 = Number(id1S);
          const currNode = this.nodes[id1] as CornerNode;
          outEdges.sort(
            (other1: number, other2: number) => {
              const otherNode1 = this.nodes[other1] as CornerNode;
              const otherNode2 = this.nodes[other2] as CornerNode;
              const angle1 = Math.atan2(otherNode1.p.y - currNode.p.y, otherNode1.p.x - currNode.p.x);
              const angle2 = Math.atan2(otherNode2.p.y - currNode.p.y, otherNode2.p.x - currNode.p.x);
              return angle1 - angle2;
            }
          );
          nextEdge[id1] = nextEdge[id1] || {};
          nextEdge[id1]![outEdges.at(0)!] = outEdges.at(outEdges.length - 1) as number;
          for (let idx: number = 1; idx < outEdges.length; ++idx) {
            const id2 = outEdges[idx] as number;
            nextEdge[id1]![id2] = outEdges.at(idx - 1) as number;
          }
        }
      );

      let result: CornerNode[][] = [];
      while (directedEdges.length > 0) {
        let currFace = result.at(result.push([]) - 1) as CornerNode[];
        const [id1, id2] = directedEdges.at(0) as [number, number];
        let currNode = this.nodes[id1] as CornerNode;
        let nextNode = this.nodes[id2] as CornerNode;

        currFace.push(currNode);
        let removeIdx: number = -1;
        while ((removeIdx = directedEdges.findIndex((val) => val.at(0) === currNode.id && val.at(1) === nextNode.id)) !== -1) {
          currFace.push(nextNode);

          directedEdges.splice(removeIdx, 1);

          const nextId = nextEdge[nextNode.id]![currNode.id] as number;
          currNode = nextNode;
          nextNode = this.nodes[nextId] as CornerNode;
        }
      }

      return result;
    },
    // e, the click position; e is in screen space
    handleClick: function (e: Point): boolean {
      let selected = false;
      const clickPos = projection.to(e);
      const nodeId = this.closestNodeToClick(clickPos);
      if (nodeId !== null) {
        const node = this.nodes[nodeId];
        if (node !== undefined) {
          const dist = distance(node.p, clickPos);
          if (dist <= settings.value.nodeTransSize) {
            selected = true;
            node.translate = true;
            node.delta.x = e.x;
            node.delta.y = e.y;
          } else if (dist <= settings.value.nodeExtendSize) {
            selected = true;
            node.extend = true;
            node.delta.x = e.x;
            node.delta.y = e.y;
          }
        }
      }
      return selected;
    },
    handleMove: function (e: Point): boolean {
      let changed = false;
      for (const node of Object.values(this.nodes)) {
        if (node.translate) {
          changed = true;

          this.handleNodeSnap(node, e, false);

          for (const outEdges of Object.values(this.edges)) {
            for (const edge of Object.values(outEdges)) {
              if (edge.id1 === node.id || edge.id2 === node.id) {
                const node1 = this.nodes[edge.id1];
                const node2 = this.nodes[edge.id2];

                if (node1 === undefined || node2 === undefined) { continue; }

                for (const openable of edge.snapOpenables) {
                  const proj = {
                    x: node1.p.x + openable.snap.pos! * (node2.p.x - node1.p.x),
                    y: node1.p.y + openable.snap.pos! * (node2.p.y - node1.p.y)
                  };
                  const shift = { x: proj.x - openable.dim.w / 2, y: proj.y };
                  openable.p = shift;
                  openable.angle = toDeg(Math.atan2(node2.p.y - node1.p.y, node2.p.x - node1.p.x)) + openable.snap.orientation! * 180;
                }
              }
            }
          }

          handleRemove(e, node);
        } else if (node.extend) {
          changed = true;

          this.handleNodeSnap(node, e, true);

          handleRemove(e, node);
        }
      }
      return changed;
    },
    handleUnclick: function (e: Point) {
      for (const node of Object.values(this.nodes)) {
        if (node.remove && node.translate) {
          this.removeNode(node.id);
          continue;
        } else if (node.translate) {
          if (node.snap.x !== null && node.snap.y !== null && node.snap.x === node.snap.y && node.snap.x !== node.id) {
            this.mergeNodes(node.id, node.snap.x);
          } else if (node.snap.edge !== null && node.snap.pos !== null) {
            this.bisect(node.id, node.snap.edge, node.snap.pos);
          }
        } else if (node.extend && !node.remove) {
          if (node.snap.x !== null && node.snap.y !== null && node.snap.x === node.snap.y) {
            if (node.snap.x !== node.id) {
              this.addEdge(node.id, node.snap.x);
            }
          } else {
            const newId = this.addNode(
              toNextNumber(projection.to({
                x: node.snap.x === null && node.snap.edge === null ? e.x : node.delta.x,
                y: node.snap.y === null && node.snap.edge === null ? e.y : node.delta.y
              })));
            this.addEdge(node.id, newId);
            if (node.snap.edge !== null && node.snap.pos !== null) {
              this.bisect(newId, node.snap.edge, node.snap.pos);
            }
          }
        }
        node.remove = false;
        node.translate = false;
        node.extend = false;
        node.snap = { x: null, y: null, edge: null, pos: null };
        node.delta = { x: 0, y: 0 };
      }
    },
    draw: function () {
      if (settings.value.showRoomSize) {
        this.drawFaces();
      }

      this.drawEdges();

      if (settings.value.mode === Mode.Room) {
        this.drawNodes();

        this.drawExtend();
      }
    },
    drawFaces: function () {
      const faces = this.getFaces();

      ctx.value.fillStyle = "lightgray";
      ctx.value.textAlign = "center";
      ctx.value.textBaseline = "middle";

      for (const face of faces) {
        if (face.length < 2) { continue; }

        let area: number = 0;
        let mid: Point = { x: 0, y: 0 };
        let prevP: Point = face.at(0)!.p;
        for (let i = 1; i < face.length; ++i) {
          const currP: Point = face.at(i)!.p;
          area += getTrapezoidArea(prevP, currP);
          mid = {
            x: mid.x + (prevP.x + currP.x) * (prevP.x * currP.y - currP.x * prevP.y),
            y: mid.y + (prevP.y + currP.y) * (prevP.x * currP.y - currP.x * prevP.y),
          };
          prevP = currP;
        }
        mid = {
          x: mid.x / (6 * area),
          y: mid.y / (6 * area),
        }
        area /= 1000 * 1000;

        if (area < 1) {
          setFontSize(18, false, true);
        } else {
          setFontSize(22, false, true);
        }
        if (area <= 0) { continue; }

        ctx.value.fillText(area.toFixed(1) + "m²", mid.x, mid.y);
      }
      restoreDefaultContext()
    },
    drawEdges: function () {
      for (const outEdges of Object.values(this.edges)) {
        for (const edge of Object.values(outEdges)) {
          const node1 = this.nodes[edge.id1];
          const node2 = this.nodes[edge.id2];

          if (node1 === undefined || node2 === undefined) { continue; }

          if ((node1.remove && node1.translate) || (node2.remove && node2.translate)) {
            ctx.value.fillStyle = "red";
            ctx.value.strokeStyle = "red";
          }

          ctx.value.beginPath();
          ctx.value.moveTo(node1.p.x, node1.p.y);

          // uncomment for gaps in windows (sort openables by pos before)
          // const dist = distance(node1.p, node2.p);
          // for (const openable of edge.snapOpenables) {
          //     const relWidth = openable.dim.w / dist;
          //     const t1 = Math.max(0, openable.snap.pos - relWidth / 2);
          //     const t2 = Math.min(1, openable.snap.pos + relWidth / 2);

          //     ctx.lineTo(node1.p.x + t1 * (node2.p.x - node1.p.x), node1.p.y + t1 * (node2.p.y - node1.p.y));
          //     ctx.moveTo(node1.p.x + t2 * (node2.p.x - node1.p.x), node1.p.y + t2 * (node2.p.y - node1.p.y));
          // }

          ctx.value.lineTo(node2.p.x, node2.p.y);
          ctx.value.stroke();

          if ((!node1.remove && node1.translate) || (!node2.remove && node2.translate)) {
            const node = node1.translate ? node2 : node1;
            const other = node1.translate ? node1 : node2;
            const dist = distance(node1.p, node2.p);
            const ul = { x: -projection.p.x / projection.scale, y: -projection.p.y / projection.scale };
            const br = projection.to({ x: canvas.value.width, y: canvas.value.height });

            const nodeScaling = settings.value.nodeTransSize / dist;
            const nodeBorder = {
              x: node.p.x * (1 - nodeScaling) + other.p.x * nodeScaling,
              y: node.p.y * (1 - nodeScaling) + other.p.y * nodeScaling,
            };
            const otherBorder = {
              x: other.p.x * (1 - nodeScaling) + node.p.x * nodeScaling,
              y: other.p.y * (1 - nodeScaling) + node.p.y * nodeScaling,
            };

            const borderPos = {
              x: Math.min(Math.max(nodeBorder.x, ul.x), br.x),
              y: Math.min(Math.max(nodeBorder.y, ul.y), br.y)
            };

            const sx = nodeBorder.x === otherBorder.x ? 1 : (borderPos.x - otherBorder.x) / (nodeBorder.x - otherBorder.x);
            const sy = nodeBorder.y === otherBorder.y ? 1 : (borderPos.y - otherBorder.y) / (nodeBorder.y - otherBorder.y);

            const borderScaling = Math.min(sx, sy);
            const scaling = Math.min(sx, sy) / 2;

            setFontSize(20, false);

            ctx.value.save();
            const b = {
              x: otherBorder.x * (1 - borderScaling) + nodeBorder.x * borderScaling,
              y: otherBorder.y * (1 - borderScaling) + nodeBorder.y * borderScaling,
            };
            const c = {
              x: otherBorder.x * (1 - scaling) + nodeBorder.x * scaling,
              y: otherBorder.y * (1 - scaling) + nodeBorder.y * scaling,
            };
            ctx.value.translate(c.x, c.y);
            const angle = Math.atan2(node.p.y - other.p.y, node.p.x - other.p.x);

            ctx.value.rotate(angle < -Math.PI / 2 || angle > Math.PI / 2 ? angle + Math.PI : angle);
            ctx.value.fillText(dist.toFixed(0) + "mm", 0, 0, distance(otherBorder, b));

            ctx.value.restore();
          } else if (settings.value.showEdgeLabels) {
            const dist = distance(node1.p, node2.p);

            setFontSize(18, false);

            ctx.value.save();
            const c = {
              x: (node1.p.x + node2.p.x) / 2,
              y: (node1.p.y + node2.p.y) / 2,
            };
            ctx.value.translate(c.x, c.y);
            const angle = Math.atan2(node2.p.y - node1.p.y, node2.p.x - node1.p.x);

            ctx.value.rotate(angle < -Math.PI / 2 || angle > Math.PI / 2 ? angle + Math.PI : angle);
            drawDistance(0, 0, dist, 1, "m", 1000);
            ctx.value.restore();
          }

          restoreDefaultContext();
        }
      }
    },
    drawNodes: function () {
      for (const node of Object.values(this.nodes)) {
        if (node.remove && node.translate) {
          ctx.value.fillStyle = "red";
          ctx.value.strokeStyle = "red";
        }

        // stroke
        ctx.value.beginPath();
        ctx.value.arc(node.p.x, node.p.y, settings.value.nodeExtendSize, 0, 2 * Math.PI);
        ctx.value.stroke();

        // fill
        ctx.value.beginPath();
        ctx.value.arc(node.p.x, node.p.y, settings.value.nodeTransSize, 0, 2 * Math.PI);
        ctx.value.fill();

        restoreDefaultContext();
      }
    },
    drawExtend: function () {
      for (const node of Object.values(this.nodes)) {
        if (node.extend) {
          const newPos = projection.to(node.delta);
          if (node.remove) {
            ctx.value.fillStyle = "red";
            ctx.value.strokeStyle = "red";
          } else {
            ctx.value.fillStyle = "gray";
            ctx.value.strokeStyle = "gray";
          }
          // stroke
          ctx.value.beginPath();
          ctx.value.arc(newPos.x, newPos.y, settings.value.nodeExtendSize, 0, 2 * Math.PI);
          ctx.value.stroke();

          // fill
          ctx.value.beginPath();
          ctx.value.arc(newPos.x, newPos.y, settings.value.nodeTransSize, 0, 2 * Math.PI);
          ctx.value.fill();

          // line
          ctx.value.moveTo(node.p.x, node.p.y);
          ctx.value.lineTo(newPos.x, newPos.y);
          ctx.value.stroke();

          if (!node.remove) {
            setFontSize(20, false);

            const dist = distance(node.p, newPos);
            ctx.value.save();
            const c = {
              x: (node.p.x + newPos.x) / 2,
              y: (node.p.y + newPos.y) / 2,
            };
            ctx.value.translate(c.x, c.y);
            const angle = Math.atan2(node.p.y - newPos.y, node.p.x - newPos.x);

            ctx.value.rotate(angle < -Math.PI / 2 || angle > Math.PI / 2 ? angle + Math.PI : angle);
            ctx.value.fillText(dist.toFixed(0) + "mm", 0, 0, dist - 2 * settings.value.nodeTransSize);

            ctx.value.restore();
          }
        }

        restoreDefaultContext();
      }
    },
    toJSON: function (): GraphJSON {
      return { nodes: this.nodes, edges: this.edges };
    },
  };
    for (const prop in defaultObjectGraph) {
      graph[prop] = defaultObjectGraph[prop];
    }
    console.log(graph)

  floorplanImage.value = {
      image: null,
      distance: 1000,
      node1: new CornerNode(0, 0, -20),
      node2: new CornerNode(1, 1000, -20),
      nodeSize: 15,

      reset: function () {
        this.image = null;
        this.node1 = new CornerNode(0, 0, -20);
        this.node2 = new CornerNode(1, this.distance, -20);
      },

      // e, the click position; e is in screen space
      handleClick: function (e: Point): boolean {
        if (this.image === null || settings.value.mode !== Mode.Floorplan) {
          return false;
        }
        let selected = false;
        const clickPos = floorplanProjection.to(e);

        const dist1 = distance(clickPos, this.node1.p);
        const dist2 = distance(clickPos, this.node2.p);

        const node = dist1 <= dist2 ? this.node1 : this.node2;
        const dist = dist1 <= dist2 ? dist1 : dist2;

        if (dist <= this.nodeSize) {
          selected = true;
          node.translate = true;
          node.delta.x = e.x;
          node.delta.y = e.y;
        }
        return selected;
      },
      handleMove: function (e: Point): boolean {
        if (this.image === null || settings.value.mode !== Mode.Floorplan) {
          return false;
        }
        let changed = false;
        for (const node of [this.node1, this.node2]) {
          if (node.translate) {
            changed = true;

            node.p.x = node.p.x + (e.x - node.delta.x) / floorplanProjection.scale;
            node.p.y = node.p.y + (e.y - node.delta.y) / floorplanProjection.scale;

            node.delta.x = e.x;
            node.delta.y = e.y;
          }
        }
        return changed;
      },
      handleUnclick: function () {
        for (const node of [this.node1, this.node2]) {
          node.remove = false;
          node.translate = false;
          node.extend = false;
          node.snap = { x: null, y: null, edge: null, pos: null };
          node.delta = { x: 0, y: 0 };
        }
      },
      getCurrentScale: function (): number {
        return settings.value.mode === Mode.Floorplan ? 1 : this.distance / distance(this.node1.p, this.node2.p);
      },
      draw: function () {
        if (this.image !== null) {
          const currentScale = this.getCurrentScale();
          ctx.value.drawImage(this.image, 0, 0, this.image.width * currentScale, this.image.height * currentScale);
          if (settings.value.mode === Mode.Floorplan) {
            this.drawEdge();
            this.drawNodes();
          }
        }
      },
      drawEdge: function () {
        ctx.value.beginPath();
        ctx.value.moveTo(this.node1.p.x, this.node1.p.y);
        ctx.value.lineTo(this.node2.p.x, this.node2.p.y);
        ctx.value.stroke();

        setFontSize(20, false);

        ctx.value.save();
        const c = {
          x: (this.node1.p.x + this.node2.p.x) / 2,
          y: (this.node1.p.y + this.node2.p.y) / 2,
        };
        ctx.value.translate(c.x, c.y);
        const angle = Math.atan2(this.node2.p.y - this.node1.p.y, this.node2.p.x - this.node1.p.x);

        ctx.value.rotate(angle < -Math.PI / 2 || angle > Math.PI / 2 ? angle + Math.PI : angle);
        ctx.value.fillText(String(this.distance) + "mm", 0, 0, distance(this.node1.p, this.node2.p));

        ctx.value.restore();
      },
      drawNodes: function () {
        const angle = Math.atan2(this.node1.p.y - this.node2.p.y, this.node1.p.x - this.node2.p.x);

        ctx.value.beginPath();
        ctx.value.arc(this.node1.p.x, this.node1.p.y, this.nodeSize, angle - Math.PI / 2, angle + Math.PI / 2);
        ctx.value.fill();

        ctx.value.beginPath();
        ctx.value.arc(this.node2.p.x, this.node2.p.y, this.nodeSize, angle + Math.PI / 2, angle - Math.PI / 2);
        ctx.value.fill();

        restoreDefaultContext();
      },
      toJSON: function (): FloorplanImageJSON | {} {
        if (this.image !== null) {
          const tmpCanvas = document.createElement('canvas') as HTMLCanvasElement;
          const tmpCtx = tmpCanvas.getContext('2d') as CanvasRenderingContext2D;
          tmpCanvas.style.display = "none";
          tmpCanvas.height = this.image.naturalHeight;
          tmpCanvas.width = this.image.naturalWidth;
          tmpCtx.drawImage(this.image, 0, 0);
          const dataURL = tmpCanvas.toDataURL();

          return {
            image: dataURL,
            distance: this.distance,
            node1: this.node1,
            node2: this.node2,
          }
        }
        return {};
      }
    };
  settings.value = {
    language: "en",
    mode: Mode.Room,
    openableType: OpenableType.Left,
    type: FurnitureType.Rectangle,
    zoomFactor: 1.05,
    minZoom: 1 / 500,
    maxZoom: 100,
    deleteDim: {
      w: 50,
      h: 30
    },
    isRemove: false,

    nodeTransSize: 50,
    nodeExtendSize: 150,
    nodeSnapDist: 100,

    furnitureRotateSize: 100,
    furnitureSnapAngle: 5,

    showEdgeLabels: false,
    showRoomSize: false,
  }

  canvas.value.addEventListener("mousedown", mouseDown)
  canvas.value.addEventListener("mousemove", mouseMove)
  document.addEventListener("mouseup", mouseUp)
  canvas.value.addEventListener("dblclick", mouseDoubleClick)
  canvas.value.addEventListener("wheel", zoomEvent)

  setSize()

  let lastClick: number = 0;
  let lastClickId: optionalNumber = null;

  let oldDist: optionalNumber = null;

  canvas.value.addEventListener("touchstart", (e) => {
    e.preventDefault();

    if (e.touches.length === 1) {
      const touch = touchToCoordinates(e.touches[0]!);
      const date = new Date();
      const time = date.getTime();
      const time_between_taps = 200; // 200ms
      if (lastClickId === e.touches[0]!.identifier && time - lastClick < time_between_taps) {
        mouseDoubleClick(touch);
      } else {
        mouseDown(touch);
      }
      lastClick = time;
      lastClickId = e.touches[0]!.identifier;
    } else if (e.touches.length === 2) {
      const touch1 = touchToCoordinates(e.touches[0]!);
      const touch2 = touchToCoordinates(e.touches[1]!);

      mouseUp(touch1);

      oldDist = distance(touch1, touch2);
    }
  });

  canvas.value.addEventListener("touchmove", (e) => {
    e.preventDefault();

    if (e.touches.length === 1) {
      const touch: Point = touchToCoordinates(e.touches[0]!);
      mouseMove(touch);
    } else if (e.touches.length === 2) {
      const touch1 = touchToCoordinates(e.touches[0]!);
      const touch2 = touchToCoordinates(e.touches[1]!);

      const pin: Point = { x: touch1.x / 2 + touch2.x / 2, y: touch1.y / 2 + touch2.y / 2 };

      const dist: number = distance(touch1, touch2);

      if (oldDist !== null && dist !== oldDist) {
        zoom(pin, dist / oldDist);
      }
      oldDist = dist;
    }
  });
  canvas.value.addEventListener("touchend", (e) => {
    e.preventDefault();

    if (e.changedTouches.length > 0) {
      mouseUp(touchToCoordinates(e.changedTouches[0]!));
    }
    oldDist = null;
  });
  canvas.value.addEventListener("touchcancel", (e) => {
    e.preventDefault();

    if (e.changedTouches.length > 0) {
      mouseUp(touchToCoordinates(e.changedTouches[0]!));
    }
    oldDist = null;
  });


//Управление расположением схемы по стрелкам клавиатуры
  document.addEventListener("keydown", (e) => {
    switch (e.code) {
      case "ArrowRight": {
        moveProjection(Direction.Right);
        break;
      }
      case "ArrowLeft": {
        moveProjection(Direction.Left);
        break;
      }
      case "ArrowUp": {
        moveProjection(Direction.Up);
        break;
      }
      case "ArrowDown": {
        moveProjection(Direction.Down);
        break;
      }
    }
  });

  }
)
</script>






















<style lang="scss">
body {
  font: normal 15px "Segoe UI", Arial, Helvetica, sans-serif;
}

table {
  table-layout: auto;

}

th {
  padding: 10px 0;
}

button {
  overflow: hidden;
  background-color: #f1f1f1;
  float: left;
  border: none;
  outline: none;
  cursor: default;
  padding: 0;
  transition: 0.3s;
}

button:hover {
  background-color: #ddd;
}

button.active {
  background-color: #ccc;
}
#container {
  position: static;
  width: 100%;

}
#content {
  /*position: absolute;*/
  inset: 0;
  display: flex;
  width: 100%;
}

#canvas {
  flex: 50%;
  height: 100%;
  width: 80%;
}

#sidebar {
  flex: 100%;
  background-color: #4caf50;


  /*overflow: auto;*/
}

.navBar {
  align-items: center;
  position: absolute;
  bottom: 0;
  right: 20%;
  display: flex;
  flex-direction: column;
}

.navBar.translate {
  margin-right: 40px;
}

.subBar {
  display: flex;
  flex-direction: row;
}

.navBarButton {
  font-size: 25px;
  width: 40px;
  height: 40px;
  border: 1px solid #ccc;
  border-radius: 20%;
}

#loadFloorplanButton {
  padding: 2px 0;
}

.tab.mode {
  overflow: hidden;
  border: 1px solid #ccc;
  background-color: #f1f1f1;
  width: auto;
}

.tabContent.mode {
  display: none;
  padding: 6px 12px;
  border: 1px solid #ccc;
  border-top: none;
}

#furnitureTab {
  overflow: auto;
}

.tab.furnitureType {
  overflow: hidden;
}

.buttonRow {
  display: flex;
  flex-direction: row;
  width: auto;
}

.buttonRow.bottomMenu {
  overflow: hidden;
  border: 1px solid #ccc;
  background-color: #f1f1f1;
  float: right;
  width: 100%;
}

.buttonRow button,
.buttonRow label {
  width: 100%;
  flex-direction: row;
  height: 45px;
}

.buttonRow label {
  align-items: center;
  display: flex;
  justify-content: center;
}

.tabContent.furnitureType {
  display: none;
}

.loadInputClass {
  overflow: hidden;
  background-color: #f1f1f1;
  float: left;
  border: none;
  outline: none;
  cursor: pointer;
  transition: 0.3s;
  text-align: center;
}

.loadInputClass:hover {
  background-color: #ddd;
}

.loadInputClass:active {
  background-color: #ccc;
}

.loadFileClass {
  display: none;
}

.addButton {
  padding: 2px 5px;
  width: 100%;
}

.inputTD {
  width: 100%;
  display: flex;
  flex-wrap: nowrap;
  justify-content: space-between;
}

.center {
  display: flex;
  justify-content: center;
  align-items: center;
}

.h100pc {
  height: 100%;
}

.w100pc {
  width: 100%;
}

.w50pc {
  width: 50%;
}

.w33pc {
  width: 33%;
}

#helpDialog {
  border: 3px solid #4caf50;
  width: 50%;
  height: 90%;
  border-radius: 10px;
}

#helpBox {
  display: flex;
  flex-direction: column;
}

#helpText {
  overflow: auto;
}

.helpLink:hover {
  background-color: #4caf50;
  border-radius: 5px;
  cursor: pointer;
}

</style>