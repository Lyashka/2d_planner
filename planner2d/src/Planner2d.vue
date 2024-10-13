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

        <div class="navBar translate">
          <button type="button" id="navUp" class="navBarButton" @click="navUp">⮉</button>
          <div class="subBar">
            <button type="button" id="navLeft" class="navBarButton" @click="navLeft">⮈</button>
            <button type="button" id="navRight" class="navBarButton" @click="navRight">⮊</button>
          </div>
          <button type="button" id="navDown" class="navBarButton" @click="navDown">⮋</button>
        </div>





        <div id="sidebar">

          <div class="tab mode buttonRow">
            <!--          <button type="button" id="floorplanButton" class="tabLinks mode" @click="changeToFloorplanMode">floorplan</button>-->
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
import TabsWindow from './components/tabsWindow.vue'
import SideBar from './components/SideBar.vue'

import {
  mdiCropFree, mdiEye,
  mdiFloorPlan, mdiHomeCity,
  mdiMenuClose,
  mdiMenuOpen, mdiTableFurniture,
} from '@mdi/js';

const items = [
  { title: 'Floor', subtitle: 'Этаж' , icon: mdiFloorPlan },
  { title: 'Room', subtitle: 'Комната' ,icon: mdiCropFree },
  { title: 'Furniture', subtitle: 'Мебель' ,icon: mdiTableFurniture },
  { title: 'Display', subtitle: 'Отображение' ,icon: mdiEye },
]

const isOpen=ref(false)
const tab = ref(items[0].title)









import { onMounted, ref } from 'vue'

import { Mode, MovableType, OpenableType, FurnitureType, Point, Dim, Direction, optionalPoint, optionalString, optionalNumber} from './defs'

import { useCanvasStore } from './store/canvasStore'
import { useSettingsStore } from './store/settingsStore'
import { useProjectionStore} from './store/projectionStore'



const { canvas, ctx } = useCanvasStore()
const { settings } = useSettingsStore()
const { projection, floorplanProjection } = useProjectionStore()



function getCurrProjection() {
  return settings.value.mode === Mode.Floorplan ? floorplanProjection : projection;
}

// state will lazily track changes since init or last save/load as string
let state: optionalString = null;
const labels: Rectangle[] = [];
const openables: Openable[] = [];
const furniture: (Circle | Ellipse | Rectangle)[] = [];


// utils
function setFontSize(size: number, fixed: boolean = true, bold: boolean = false) {
  const proj = getCurrProjection();
  ctx.value.font = (bold ? "normal 900 " : "") + (size / (fixed ? 1 : proj.scale)) + "px \"Segoe UI\", Arial, Helvetica, sans-serif";
}

function restoreDefaultContext() {
  const proj = getCurrProjection();
  ctx.value.lineWidth = 1.5 / proj.scale;
  ctx.value.lineJoin = "miter";
  setFontSize(15);
  ctx.value.textAlign = "center";
  ctx.value.textBaseline = "alphabetic";

  ctx.value.fillStyle = "black";
  ctx.value.strokeStyle = "black";
}

function willRemove(p: Point): boolean {
  return p.x >= canvas.value.width - settings.value.deleteDim.w && p.x <= canvas.value.width && p.y >= 0 && p.y <= settings.value.deleteDim.h;
}

function handleRemove(p: Point, elem: Movable | CornerNode) {
  if (willRemove(p)) {
    elem.remove = true;
    settings.value.isRemove = true;
  } else {
    if (elem.remove) {
      settings.value.isRemove = false;
    }
    elem.remove = false;
  }
}

function drawDistance(x: number, y: number, distance: number, precision: number | null = null, unit: string = "", factor: number = 1) {
  const distanceInUnit = distance / factor;
  const output = (precision === null ? distanceInUnit : distanceInUnit.toFixed(precision)) + unit;
  ctx.value.fillText(output, x, y, distance);
}

function drawMain() {
  ctx.value.reset();
  ctx.value.clearRect(0, 0, canvas.value.width, canvas.value.height);

  // fill background for export functionality
  ctx.value.fillStyle = "white";
  ctx.value.fillRect(0, 0, canvas.value.width, canvas.value.height);

  if (settings.value.mode === Mode.Floorplan) {
    ctx.value.translate(floorplanProjection.p.x, floorplanProjection.p.y);
    ctx.value.scale(floorplanProjection.scale, floorplanProjection.scale);

    // global properties
    restoreDefaultContext();

    floorplanImage.draw();

    if (floorplanImage.image === null) {
      drawHelp();
    }

    return;
  }

  ctx.value.translate(projection.p.x, projection.p.y);
  ctx.value.scale(projection.scale, projection.scale);

  // global properties
  restoreDefaultContext();

  floorplanImage.draw();

  drawScale();
  drawDeletionField();

  if (Object.keys(graph.nodes).length === 0 && furniture.length === 0 && openables.length === 0 && labels.length === 0 && floorplanImage.image === null) {
    drawHelp();
  } else {
    for (let i = labels.length - 1; i >= 0; i--) {
      const label = labels[i];
      if (label !== undefined) {
        drawLabel(label);
      }
    }

    for (let i = openables.length - 1; i >= 0; i--) {
      const openable = openables[i];
      if (openable !== undefined) {
        openable.draw();
      }
    }

    graph.draw();

    for (let i = furniture.length - 1; i >= 0; i--) {
      const fur = furniture[i];
      if (fur !== undefined) {
        fur.draw();
      }
    }
  }
}


function drawHelp() {
  const proj = getCurrProjection();
  const ul = { x: -proj.p.x / proj.scale, y: -proj.p.y / proj.scale };
  const br = proj.to({ x: canvas.value.width, y: canvas.value.height });

  ctx.value.fillStyle = "gray";
  setFontSize(40, false);

  ctx.value.beginPath();
  switch (settings.value.mode) {
    case Mode.Floorplan: {
      ctx.value.fillText(getText(loc.floorplan.help), (ul.x + br.x) / 2, (ul.y + br.y) / 2);
      break;
    }
    case Mode.Room: {
      ctx.value.fillText(getText(loc.room.help), (ul.x + br.x) / 2, (ul.y + br.y) / 2);
      break;
    }
    case Mode.Furniture: {
      ctx.value.fillText(getText(loc.furniture.help), (ul.x + br.x) / 2, (ul.y + br.y) / 2);
      break;
    }
    case Mode.Presentation: {
      ctx.value.fillText(getText(loc.presentation.help), (ul.x + br.x) / 2, (ul.y + br.y) / 2);
      break;
    }
  }
  ctx.value.stroke();

  restoreDefaultContext();
}


function drawLabel(label: Rectangle) {
  ctx.value.save();

  const c = label.center();
  const maxDim = label.getMaxDim();

  ctx.value.translate(c.x, c.y);
  ctx.value.rotate(toRad(label.angle));

  ctx.value.fillStyle = label.remove ? "red" : "lightgray";
  ctx.value.strokeStyle = label.remove ? "red" : "lightgray";

  setFontSize(maxDim.h);
  ctx.value.textBaseline = "middle";

  ctx.value.fillText(label.name, 0, 0);

  const rotateSize = label.getRotateSize();
  if (settings.value.mode === Mode.Room) {
    ctx.value.beginPath();
    ctx.value.arc(
      -maxDim.w / 2 + rotateSize / 2,
      -maxDim.h / 2 + rotateSize / 2,
      rotateSize / 2,
      0,
      2 * Math.PI
    );
    ctx.value.stroke();
  }

  ctx.value.restore();
}

function drawScale() {
  const lhs = projection.to({ x: 0, y: 0 });
  const rhs = projection.to({ x: canvas.value.width, y: 0 });
  const scaleWidth = (rhs.x - lhs.x) / 3;
  let range = 0.1;
  while (scaleWidth / (range * 10) > 2) {
    range *= 10;
  }
  let units = 1000;
  let unit = "m";
  if (range === 100 || range === 10) {
    units = 10;
    unit = "cm";
  } else if (range < 10) {
    units = 1;
    unit = "mm";
  }
  ctx.value.beginPath();

  setFontSize(15, false);

  let i = 0;
  for (; i < scaleWidth; i += range) {
    ctx.value.moveTo((-projection.p.x + 20) / projection.scale + i, (-projection.p.y + 17) / projection.scale);
    ctx.value.lineTo((-projection.p.x + 20) / projection.scale + i, (-projection.p.y + 27) / projection.scale);
    if (i % (10 * range) === 0 || Math.floor(scaleWidth / range) < 10) {
      ctx.value.fillText((i / units) + unit,
        (-projection.p.x + 20) / projection.scale + i,
        (-projection.p.y + 15) / projection.scale,
        Math.floor(scaleWidth / range) < 10 ? range : scaleWidth / 2);
    }
  }

  ctx.value.moveTo((-projection.p.x + 20) / projection.scale, (-projection.p.y + 22) / projection.scale);
  ctx.value.lineTo((-projection.p.x + 20) / projection.scale + i - range, (-projection.p.y + 22) / projection.scale);

  ctx.value.stroke();
  restoreDefaultContext();
}

function drawDeletionField() {
  // only display garbage bin if needed
  if (settings.value.mode === Mode.Presentation) {
    return;
  }

  const a = projection.to({ x: canvas.value.width - settings.value.deleteDim.w, y: 0 })
  const d = projection.to({ x: canvas.value.width, y: settings.value.deleteDim.h })

  ctx.value.lineJoin = "round"
  ctx.value.strokeStyle = "red"

  ctx.value.beginPath()
  ctx.value.rect(a.x, a.y, d.x - a.x, d.y - a.y)
  ctx.value.stroke()

  const w = d.x - a.x
  const h = d.y - a.y

  // body
  ctx.value.beginPath()
  ctx.value.moveTo(a.x + .2 * w, a.y + .3 * h)
  ctx.value.lineTo(a.x + .25 * w, a.y + .93 * h)
  ctx.value.lineTo(a.x + .75 * w, a.y + .93 * h)
  ctx.value.lineTo(a.x + .8 * w, a.y + .3 * h)
  ctx.value.closePath()
  ctx.value.stroke()

  // stripes
  for (const i of [.375, .5, .625]) {
    ctx.value.beginPath()
    ctx.value.rect(a.x + (i - .03) * w, a.y + .38 * h, .06 * w, .47 * h)
    ctx.value.stroke()
  }

  if (!settings.value.isRemove) {
    // head
    ctx.value.beginPath()
    ctx.value.rect(a.x + .15 * w, a.y + .15 * h, .7 * w, .1 * h)
    ctx.value.stroke()

    // handle
    ctx.value.beginPath()
    ctx.value.rect(a.x + .4 * w, a.y + .07 * h, .2 * w, .06 * h)
    ctx.value.stroke()
  }
  restoreDefaultContext()
}

function drawDistanceToNextWall(center: Point, border: Point) {
  const intersectionPoint = graph.nextEdgeToSegment(center, border)
  if (intersectionPoint !== null) {
    ctx.value.beginPath()
    ctx.value.moveTo(border.x, border.y)
    ctx.value.lineTo(intersectionPoint.x, intersectionPoint.y)
    ctx.value.stroke()

    const dist = distance(border, intersectionPoint)

    ctx.value.save()

    ctx.value.translate((border.x + intersectionPoint.x) / 2, (border.y + intersectionPoint.y) / 2)
    const angle = Math.atan2(border.y - intersectionPoint.y, border.x - intersectionPoint.x)

    ctx.value.rotate(angle < -Math.PI / 2 || angle > Math.PI / 2 ? angle + Math.PI : angle)

    ctx.value.beginPath()
    drawDistance(0, 0, dist, 0, "mm")
    ctx.value.stroke()

    ctx.value.restore()
  }
}

function centerProjection() {
  const proj = getCurrProjection();
  let minX: optionalNumber = null;
  let minY: optionalNumber = null;
  let maxX: optionalNumber = null;
  let maxY: optionalNumber = null;

  const updateBoundary = (p: Point) => {
    if (minX === null || p.x < minX) { minX = p.x; }
    if (maxX === null || p.x > maxX) { maxX = p.x; }
    if (minY === null || p.y < minY) { minY = p.y; }
    if (maxY === null || p.y > maxY) { maxY = p.y; }
  };

  if (settings.value.mode !== Mode.Floorplan) {
    for (const openable of openables) {
      updateBoundary(openable.p);
    }
    for (const label of labels) {
      updateBoundary(label.p);
    }
    for (const fur of furniture) {
      updateBoundary(fur.center());
    }
    for (const node of Object.values(graph.nodes)) {
      updateBoundary(node.p);
    }
  }

  if (floorplanImage.image) {
    updateBoundary(floorplanImage.node1.p);
    updateBoundary(floorplanImage.node2.p);
    const image = floorplanImage.image;
    const imageScale = floorplanImage.getCurrentScale();
    updateBoundary({ x: image.x, y: image.y });
    updateBoundary({ x: image.x + image.width * imageScale, y: image.y + image.height * imageScale });
  }

  if (minX === null || minY === null || maxX === null || maxY === null) {
    return;
  }

  {// fix zoom with 20% border
    const a = proj.to({ x: 0, y: 0 });
    const b = proj.to({ x: canvas.value.width, y: canvas.value.height });
    const zoomValue = Math.min((b.x - a.x) / ((maxX - minX) * 1.2), (b.y - a.y) / ((maxY - minY) * 1.2));
    zoom(proj.p, zoomValue);
  }

  {// fix view of projection to middle
    const a = proj.to({ x: 0, y: 0 });
    const b = proj.to({ x: canvas.value.width, y: canvas.value.height });

    const newP = proj.from({ x: (minX + maxX) / 2 - (b.x - a.x) / 2, y: (minY + maxY) / 2 - (b.y - a.y) / 2 });
    proj.p = { x: proj.p.x - newP.x, y: proj.p.y - newP.y };
  }
  drawMain();
}

function moveProjection(direction: Direction) {
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



interface Localization {
  en: string,
  de: string,
}

function getText(element: Localization): string {
  const key = settings.value.language as keyof typeof element;
  return key in element ? element[key] : element.en;
}
const loc = {
  help: {
    helpOpen: {
      en: "Help",
      de: "Hilfe"
    },
    helpClose: {
      en: "Ok",
      de: "Ok"
    },
    findHelp: {
      en: "More Help 🡲",
      de: "Mehr Hilfe 🡲"
    },
    findNav: {
      en: "Navigation 🡲",
      de: "Navigation 🡲"
    },
    welcome: {
      en: "Welcome to the Pen And Paper Floorplanner.",
      de: "Willkommen zum Pen And Paper Floorplanner."
    },
    intro: {
      en: "The Pen And Paper Floorplanner is an easy to use 2D floorplanner webapp with no overhead or registration. This tool is designed to import/create floor plans and arrange furniture into created rooms.",
      de: "Der Pen And Paper Floorplanner ist ein einfacher 2D Raumplaner ohne Schnickschnack und ohne Registrierung, direkt im Browser. Mit Hilfe dieser Anwendung können Grundrisse importiert/erstellt und mit Möbeln eingerichtet werden."
    },
    explanationMode: {
      en: "There are four modes to choose from:",
      de: "Es gibt vier Modi zwischen denen man wählen kann:"
    },
    explanationUtil: {
      en: "At the bottom of the right menu the following actions can be performed:",
      de: "Am unteren Rand des rechten Menüs sind folgende Aktionen möglich:"
    },
    introFloorplan: {
      en: "Floorplan-Mode",
      de: "Grundriss-Modus"
    },
    shortFloorplan: {
      en: "Import an existing floorplan.",
      de: "Importiere existierende Grundrisse."
    },
    explanationFloorplan: {
      en: "In this mode an existing floorplan can be imported. Currently only image-files are supported (that means in particular that pdf files do not work). " +
        "After the floorplan is loaded using the corresponding button on the right, the scaling of the floorplan has to be adjusted. " +
        "This can be achieved by using the provided link (two half-circles connected by a line). " +
        "First, move the corners of the link to a known distance in the floorplan (e.g. the length of a wall of known length or a provided scale). " +
        "Second, adjust the length of the link in the right menu to the known distance. " +
        "Afterwards the mode can be switched and the floorplan in the correct scale is displayed. " +
        "The floorplan can also be removed in the right menu if needed.",
      de: "In diesem Modus können existierende Grundrisse importiert werden. Aktuell sind lediglich Bilddateien unterstützt (das bedeutet insbesondere, dass keine pdf Dateien funktionieren). " +
        "Nachdem der Grundriss importiert wurde, indem der entsprechende Knopf im rechten Menü geklickt wurde, muss die Skalierung angepasst werden. " +
        "Das kann mit der gegebenen Strecke (zwei verbundene Halbkreise) erreicht werden. " +
        "Zuerst müssen die Endpunkte der Strecke auf eine bekannten Abstand auf dem Grundriss verschoben werden (zum Beispiel einer bekannten Wandlänge oder einer Skala). " +
        "Danach muss die Länge der Strecke auf den bekannten Abstand im rechten Menü eingestellt werden. " +
        "Anschließend kann der Modus gewechselt werden und der Grundriss wird im korreten Maßstab angezeigt. " +
        "Der Grundriss kann bei Bedarf gelöscht werden."
    },
    introRoom: {
      en: "Room-Mode",
      de: "Raum-Modus"
    },
    shortRoom: {
      en: "Create a floor plan from scratch.",
      de: "Grundrisse erstellen."
    },
    explanationRoom: {
      en: "The two main elements in this mode are corners and walls. " +
        "A corner can be created with a double click and moved by clicking its center and draging the mouse. " +
        "Two corners can be merged together by placing a corner onto an existing corner. " +
        "Walls can be created between corners by clicking the outer circle of a corner. " +
        "The wall can then be connected to an existing corner or create a new corner at the current cursor location. " +
        "Corners snap to edges and corners that are located vertically or horizontally. " +
        "The snap distance is determined by the size of the outer circle. " +
        "The size of the center and the outer circle can be adjusted in the right menu. " +
        "Corners droped at the garbage bin at the top right corner will be removed. " +
        "In this mode it is furthermore possible to create labels to name rooms for example. Labels can be deleted if droped in the garbage bin. " +
        "It is also possible to place doors and windows, openables for short. " +
        "Openables have a width and can be of three different types, anchored left, anchored right or doubled. " +
        "They can be moved and rotated with the handle above the door/window. Openables snap to walls by placing them close to one. " +
        "The angle is then adjusted automatically. A snaped openable will move together with walls. Openables can be removed by dropping them in the garbage bin. ",
      de: "Die beiden Hauptelemente in diesem Modus sind Ecken und Wände. Eine Ecke kann durch einen Doppelklick erstellt werden. " +
        "Eine Ecke besteht aus einem inneren und einem äußeren Kreis. " +
        "Durch einen Klick auf den inneren Kreis kann eine Ecke verschoben werden. " +
        "Wände können zwischen Ecken erstellt werden indem man auf den äußeren Kreis einer Start-Ecke klickt. " +
        "Die erstellte Wand kann anschließend mit einer existierenden End-Ecke verbunden werden oder es kann eine neune End-Ecke bei der aktuellen Maus position erstellt werden. " +
        "Ecken können automatisch anhand von Wänden und anderen Ecken horizontal oder vertikal ausgerichtet werden. " +
        "Die Entfernung dieser automatischen Fixierung ist von der größe des äußeren Kreises abhängig. " +
        "Die größe der Kreise einer Ecke kann im rechten Menü eingestellt werden. " +
        "Ecken die in der Mülltonne abgelegt werden, der rote Bereich am oberen rechten Bildschirmrand, werden gelöscht. " +
        "In diesem Modus können außerdem Aufschriften erstellt werden um zum Beispiel Räume zu benennen. Eine Aufschrift kann gelöscht werden indem diese in die Mülltonne verschoben wird. " +
        "Weiterhin erlaubt dieser Modus das Erstellen von Türen und Fenstern. " +
        "Diese haben eine Breite und sind einem von drei Typen zugeordnet: Linksbündig, Rechtsbündig oder Doppelt. " +
        "Türen und Fenster können durch den Bereich darüber verschoben und rotiert werden. " +
        "Sie können an Wänden ausgerichtet werden und positionieren sich anschießend automatisch. Türen/Fenster können gelöscht werden indem diese in die Mülltonne verschoben werden. ",
    },
    introFurniture: {
      en: "Furniture-Mode",
      de: "Möbel-Modus"
    },
    shortFurniture: {
      en: "Decorate created rooms.",
      de: "Richte erstellte Grundrisse ein.",
    },
    explanationFurniture: {
      en: "In this mode furniture can be created, dragged and rotated. " +
        "Furniture can be created in the right menu by clicking the 'Add' button. There are 4 different types of furniture. " +
        "The ellipse is determined by a width and a height. The rectangle also requires width and height. The L-Shape has two block segments, both defined by width and height. The overall width is the sum of the two segment widths. The U-Shape behaves similarly but has three segments instead of two. " +
        "All types of furniture can have a name. " +
        "Furniture can be rotated by clicking the small circle within a piece of furniture. " +
        "Furniture dropped at the garbage bin at the top right corner will be removed. ",
      de: "In diesem Modus können Möbel erstellt, verschoben und rotiert werden. " +
        "Möbel können im rechten Menü erstellt werden. Es gibt 4 verschiedene Typen von Möbeln. " +
        "Die Ellipse ist durch eine Breite und eine Höhe definiert. Das Rechteck benötigt ebenfalls eine Breite und eine Höhe. Die L-Form besteht aus zwei Blöcken, die jeweils durch eine Breite und eine Höhe definiert sind. Die Gesamtbreite ergibt sich aus der Summe der einzelnen Blöcke. Die U-Form verhält sich ähnlich, hat allerdings drei Blöcke anstatt zwei. " +
        "Möbel können einen Namen erhalten. " +
        "Möbel können rotiert werden indem man in den kleinen Kreis innerhalb jedes Möbelstücks klickt. " +
        "Möbelstücke die man in der Mülltonne ablegt, der rote Bereich am oberen rechten Bildschirmrand, werden gelöscht. "
    },
    introDisplay: {
      en: "Display-Mode",
      de: "Vorschau-Modus"
    },
    shortDisplay: {
      en: "Visual overview of the current progress.",
      de: "Betrachte den bisher gemachten Fortschritt."
    },
    explanationDisplay: {
      en: "In this mode unused visual clutter is removed to provide a clean presentation of the created floorplan.",
      de: "In diesem Modus werden unnötige Elemente der Anzeige entfernt um eine saubere Präsentation des erstellten Grundrisses anzuzeigen."
    },
    creator: {
      en: "Created by: Karl Däubel and Denny Korsukéwitz",
      de: "Authoren: Karl Däubel and Denny Korsukéwitz"
    }
  },
  fileIO: {
    saveButton: {
      en: "Save",
      de: "Speichern"
    },
    saveShort: {
      en: "Save the entire project.",
      de: "Ein komplettes Projekt speichern."
    },
    loadButton: {
      en: "Load",
      de: "Laden"
    },
    loadShort: {
      en: "Load a saved project.",
      de: "Ein gespeichertes Projekt laden."
    },
    exportButton: {
      en: "Export",
      de: "Export",
    },
    exportShort: {
      en: "Export the current view to an image.",
      de: "Exportiere die aktuelle Ansicht als Bild."
    },
    printButton: {
      en: "Print",
      de: "Drucken"
    },
    printShort: {
      en: "Print the current view.",
      de: "Drucke die aktuelle Ansicht."
    },
    errorAtFile: {
      en: "There was an error while loading file:",
      de: "Beim Lesen folgender Datei ist ein Fehler aufgetreten:"
    },
    errorMessage: {
      en: "Error Message:",
      de: "Fehlermeldung:"
    }
  },
  floorplan: {
    category: {
      en: "Floorplan",
      de: "Grundriss"
    },
    help: {
      en: "Load A Floorplan On The Right.",
      de: "Füge einen Grundriss rechts hinzu."
    },
    option: {
      distance: {
        en: "Length\xa0(mm):",
        de: "Länge\xa0(mm):"
      },
      inputError: {
        en: "Please input only positive numbers for length.",
        de: "Bitte geben Sie nur positive Zahlen für die Länge ein."
      },
    },
    loadButton: {
      en: "Load Floorplan",
      de: "Grundriss Laden"
    },
    clearButton: {
      en: "Clear Floorplan",
      de: "Grudriss Löschen"
    }
  },
  room: {
    category: {
      en: "Room",
      de: "Raum"
    },
    help: {
      en: "Double Click Here!",
      de: "Hier Doppelklicken!"
    },
    removeHelp: {
      en: "Remove Objects Here 🡵",
      de: "Objekte hier löschen 🡵"
    },
    corner: {
      head: {
        en: "Corner\xa0Size",
        de: "Ecken\xa0Größe"
      },
      center: {
        en: "Center:",
        de: "Zentrum:"
      },
      ring: {
        en: "Ring:",
        de: "Ring:"
      }
    },
    label: {
      head: {
        en: "Label",
        de: "Beschriftung"
      },
      name: {
        en: "Name:",
        de: "Name:"
      },
      defaultName: {
        en: "Livingroom",
        de: "Wohnzimmer"
      },
      height: {
        en: "Height\xa0(mm):",
        de: "Höhe\xa0(mm):"
      },
      add: {
        en: "Add",
        de: "Hinzufügen"
      },
      inputError: {
        en: "Please input only positive numbers for height and a non empty string for the name.",
        de: "Bitte geben Sie nur positive Zahlen für die Höhe und eine nicht leere Zeichenkette für den Namen ein."
      },
    },
    openable: {
      head: {
        en: "Door/Window",
        de: "Tür/Fenster"
      },
      width: {
        en: "Width\xa0(mm):",
        de: "Breite\xa0(mm):"
      },
      type: {
        en: "Type:",
        de: "Typ:"
      },
      add: {
        en: "Add",
        de: "Hinzufügen"
      },
      inputError: {
        en: "Please input only positive numbers for width.",
        de: "Bitte geben Sie nur positive Zahlen für die Breite ein."
      },
    },
  },
  furniture: {
    category: {
      en: "Furniture",
      de: "Möbel"
    },
    help: {
      en: "Add Furniture On The Right.",
      de: "Füge Möbel rechts hinzu."
    },
    removeHelp: {
      en: "Remove Furniture Here 🡵",
      de: "Möbel hier löschen 🡵"
    },
    add: {
      name: {
        en: "Name:",
        de: "Name:"
      },
      type: {
        en: "Type:",
        de: "Typ:"
      },
      defaultName: {
        en: "Table",
        de: "Tisch"
      },
      width: {
        en: "Width\xa0(mm):",
        de: "Breite\xa0(mm):"
      },
      height: {
        en: "Height\xa0(mm):",
        de: "Höhe\xa0(mm):"
      },
      add: {
        en: "Add",
        de: "Hinzufügen"
      },
      inputError: {
        en: "Please input only positive numbers for width and height.",
        de: "Bitte geben Sie nur positive Zahlen für die Breite und Höhe ein."
      },
    },
  },
  presentation: {
    category: {
      en: "Display",
      de: "Vorschau"
    },
    help: {
      en: "File Utilities On The Right.",
      de: "Datei Funktionalität auf der rechten Seite."
    },
    option: {
      head: {
        en: "Global Options",
        de: "Globale Einstellungen"
      },
      showEdgeLabel: {
        en: "Show Wall Length",
        de: "Zeige Wandlänge"
      },
      roomSizeLabel: {
        en: "Show Room Size",
        de: "Zeige Raumgröße"
      },
    },
  },
};

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

// utils
// function resetElements(type: string) {
//   const tabContents = document.getElementsByClassName("tabContent " + type);
//   for (const tabContent of tabContents) {
//     (tabContent as HTMLDivElement).style.display = "none";
//   }
//
//   const tabLinks = document.getElementsByClassName("tabLinks " + type);
//   for (const tabLink of tabLinks) {
//     tabLink.className = tabLink.className.replace(" active", "");
//   }
// }

function changeToFloorplanMode(e: MouseEvent) { changeMode(e, Mode.Floorplan); }
function changeToRoomMode(e: MouseEvent) { changeMode(e, Mode.Room); }
function changeToFurnitureMode(e: MouseEvent) { changeMode(e, Mode.Furniture); }
function changeToPresentationMode(e: MouseEvent) { changeMode(e, Mode.Presentation); }


function changeOpenableType(e: MouseEvent, type: OpenableType) {
  // resetElements("openableType");
  settings.value.openableType = type;
  console.log(settings.value.openableType)
  // (e.currentTarget as HTMLButtonElement).className += " active";
  drawMain();
}

function changeToLeftOpenableType(e: MouseEvent) { changeOpenableType(e, OpenableType.Left); }
function changeToRightOpenableType(e: MouseEvent) { changeOpenableType(e, OpenableType.Right); }
function changeToDoubleOpenableType(e: MouseEvent) { changeOpenableType(e, OpenableType.Double); }


// furniture type tabs
function changeFurnitureType(e: MouseEvent, type: FurnitureType) {
  // resetElements("furnitureType");

  settings.value.type = type;

  // switch (type) {
  //   case FurnitureType.Rectangle:
  //     document.getElementById("rectangleTab")!.style.display = "contents";
  //     break;
  //   case FurnitureType.Circle:
  //     document.getElementById("circleTab")!.style.display = "contents";
  //     break;
  //   case FurnitureType.L:
  //     document.getElementById("LTab")!.style.display = "contents";
  //     break;
  //   case FurnitureType.U:
  //     document.getElementById("UTab")!.style.display = "contents";
  //     break;
  // }
  // (e.currentTarget as HTMLBRElement).className += " active";

  drawMain();
}

function changeToRectangleType(e: MouseEvent) { changeFurnitureType(e, FurnitureType.Rectangle); }
function changeToCircleType(e: MouseEvent) { changeFurnitureType(e, FurnitureType.Circle); }
function changeToLType(e: MouseEvent) { changeFurnitureType(e, FurnitureType.L); }
function changeToUType(e: MouseEvent) { changeFurnitureType(e, FurnitureType.U); }


// function validNumericInput(...values: number[]) {
//   for (const value of values) {
//     if (isNaN(value) || value < 1) {
//       return false;
//     }
//   }
//   return true;
// }


// Floorplan Mode
// document.getElementById("distanceInput")!.addEventListener("input", (e) => {
//   const dist = (e.target as HTMLInputElement).valueAsNumber;
//
//   if (!validNumericInput(dist)) {
//     alert(getText(loc.floorplan.option.inputError));
//     return;
//   }
//   floorplanImage.distance = dist;
//
//   drawMain();
// });
//
// document.getElementById("loadFloorplan")!.addEventListener("change", (e: Event) => {
//   const files = (e.target as HTMLInputElement).files;
//   const file = files?.item(0);
//
//   if (!file) {
//     return;
//   }
//
//   let img = new Image();
//   img.onload = (onLoadResult) => {
//     const image = onLoadResult.target as HTMLImageElement;
//     floorplanImage.image = image;
//     drawMain();
//   };
//   img.onerror = () => {
//     alert(getText(loc.fileIO.errorAtFile) + " " + file.name + ".");
//   };
//   img.src = URL.createObjectURL(file);
// });
//
// document.getElementById("clearFloorplanButton")!.addEventListener("click", () => {
//   floorplanImage.reset();
//
//   drawMain();
// });



// // Room Mode
const labelNameInput = ref('roooooom')
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
// document.getElementById("addLabelButton")!.addEventListener("click", (e) => {
//   e.preventDefault();
//   const labelName = (document.getElementById("labelNameInput") as HTMLInputElement).value;
//   const labelHeight = (document.getElementById("labelHeightInput") as HTMLInputElement).valueAsNumber;
//
//   if (!validNumericInput(labelHeight) || !labelName) {
//     alert(getText(loc.room.label.inputError));
//     return;
//   }
//   const start = projection.to({ x: 10, y: 100 });
//   setFontSize(labelHeight);
//   labels.push(new Rectangle(labelName, MovableType.Rectangle, start.x, start.y, ctx.measureText(labelName).width, labelHeight));
//   console.log("add Label:", labelName);
//   drawMain();
// });

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


// document.getElementById("addOpenableButton")!.addEventListener("click", (e) => {
//   e.preventDefault();
//   const openableWidth = (document.getElementById("openableWidthInput") as HTMLInputElement).valueAsNumber;
//
//   if (!validNumericInput(openableWidth)) {
//     alert(getText(loc.room.openable.inputError));
//     return;
//   }
//
//   const start = projection.to({ x: 10, y: 100 });
//   openables.push(new Openable(settings.openableType, start.x, start.y, openableWidth, 180));
//   console.log("add Openable:", settings.openableType);
//   drawMain();
// });

// // Furniture Mode

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






// window.addEventListener("beforeunload", (e) => {
//   if (state !== createState()) {
//     e.preventDefault();
//     return (e.returnValue = "");
//   }
//   return true;
// });
//


//




type CornerSnap = { x: optionalNumber, y: optionalNumber, edge: Edge | null, pos: optionalNumber };
type CornerJSON = { id: number, p: Point };
class CornerNode {
  id: number;
  p: Point;
  delta: Point;
  translate: boolean;
  extend: boolean;
  snap: CornerSnap;
  remove: boolean;

  constructor(id: number, x: number, y: number) {
    this.id = id;
    this.p = {
      x,
      y
    };
    this.delta = {
      x: 0,
      y: 0
    };
    this.translate = false;
    this.extend = false;
    this.snap = {
      x: null,
      y: null,
      edge: null,
      pos: null,
    };
    this.remove = false;
  }

  toJSON(): CornerJSON {
    return { id: this.id, p: this.p };
  }
}

type EdgeJSON = { id1: number, id2: number, stroke: string };
class Edge {
  id1: number;
  id2: number;
  stroke: string;
  snapOpenables: Openable[];
  constructor(id1: number, id2: number) {
    this.id1 = id1;
    this.id2 = id2;
    this.stroke = "black";
    this.snapOpenables = [];
  }
  toJSON(): EdgeJSON {
    return { id1: this.id1, id2: this.id2, stroke: this.stroke };
  }
}
type CornerNodes = {
  [key: number]: CornerNode,
};
type Edges = {
  [key1: number]: {
    [key2: number]: Edge,
  },
};
type GraphJSON = { nodes: CornerNodes, edges: Edges };
interface Graph {
  count: number,
  nodes: CornerNodes,
  edges: Edges,
  addNode: (p: Point) => number,
  removeNode: (id: number) => void,
  addEdge: (id1: number, id2: number) => Edge | null,
  removeEdge: (id1: number, id2: number) => void,
  mergeNodes: (fromId: number, toId: number) => void,
  bisect: (id: number, edge: Edge, pos: number) => void,

  getFaces: () => CornerNode[][],

  reset: () => void,

  nextEdgeToSegment: (center: Point, p: Point) => Point | null,
  closestNodeToClick: (p: Point) => optionalNumber,
  handleNodeToNodeSnap: (node: CornerNode, p: Point, extendNode: boolean) => boolean,
  handleNodeToEdgeSnap: (node: CornerNode, p: Point, extendNode: boolean) => boolean,
  handleNodeToNeighborSnap: (node: CornerNode, p: Point, extendNode: boolean, change: boolean) => optionalPoint,
  handleNodeSnap: (node: CornerNode, p: Point, extendNode: boolean) => void,

  handleClick: (e: Point) => boolean,
  handleMove: (e: Point) => boolean,
  handleUnclick: (e: Point) => void,

  draw: () => void,
  drawFaces: () => void,
  drawEdges: () => void,
  drawNodes: () => void,
  drawExtend: () => void,

  toJSON: () => GraphJSON,
};

const graph: Graph =  {
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

type FloorplanImageJSON = { image: string, distance: number, node1: CornerJSON, node2: CornerJSON };
interface FloorplanImage {
  image: HTMLImageElement | null,
  distance: number,
  node1: CornerNode,
  node2: CornerNode,
  readonly nodeSize: number,

  reset: () => void,

  handleClick: (e: Point) => boolean,
  handleMove: (e: Point) => boolean,
  handleUnclick: () => void,

  getCurrentScale: () => number,

  draw: () => void,
  drawEdge: () => void,
  drawNodes: () => void,

  toJSON: () => FloorplanImageJSON | {},
}

const floorplanImage: FloorplanImage = {
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

// corner node size slider init
const nodeTransSlider = ref(50)
const nodeExtendSlider = ref(150)

function initNodeSize() {
  const transSlider = nodeTransSlider.value
  const extendSlider = nodeExtendSlider.value

  settings.value.nodeTransSize = Number(transSlider.value);
  settings.value.nodeExtendSize = Number(extendSlider.value);

  setNodeTransSize();
  setNodeExtendSize();
}

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

function resetOptions() {
  settings.value.showEdgeLabels = false;
  edgeLabelCheckbox.value = false

  settings.value.showRoomSize = false;
  roomSizeCheckbox.value = false
}

function addElem(parent: HTMLElement, type: string, text: Localization | null = null): HTMLElement {
  const elem = document.createElement(type);
  if (text !== null) {
    elem.textContent = getText(text);
  }
  parent.appendChild(elem);
  return elem;
}

function addListEntry(parent: HTMLElement, type: string, head: Localization, short: Localization): HTMLElement {
  const elem = document.createElement(type);
  const headElem = document.createElement("b");
  headElem.textContent = getText(head) + ": ";
  const shortElem = document.createTextNode(getText(short));
  elem.appendChild(headElem);
  elem.appendChild(shortElem);

  parent.appendChild(elem);

  return headElem;
}


window.addEventListener("resize", setSize);

function setSize() {
  canvas.value.width = window.innerWidth * 0.8;
  canvas.value.height = window.innerHeight * 0.8;

  drawMain();
}

function touchToCoordinates(t: Touch): Point {
  return { x: t.clientX, y: t.clientY };
}

function zoomEvent(e: WheelEvent) {
  zoom(e, e.deltaY > 0 ? 1 / settings.value.zoomFactor : e.deltaY < 0 ? settings.value.zoomFactor : null);
}

function zoom(p: Point, factor: optionalNumber) {
  if (factor !== null) {
    const proj = getCurrProjection();
    const newScale = proj.scale * factor;
    if (newScale > settings.value.minZoom && newScale < settings.value.maxZoom) {
      proj.scale = newScale;
      proj.p.x = p.x - (p.x - proj.p.x) * factor;
      proj.p.y = p.y - (p.y - proj.p.y) * factor;

      drawMain();
    }
  }
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
    if (floorplanImage.handleClick(e)) {
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
    if (floorplanImage.handleMove(e)) {
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
    floorplanImage.handleUnclick();
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

function zoomToMiddle(factor: number) {
  zoom({ x: canvas.value.width / 2, y: canvas.value.height / 2 }, factor);
}

function loadOpenable(openable: OpenableJSON, graph: Graph): Openable {
  const newOpenable = new Openable(openable.openableType, openable.p.x, openable.p.y, openable.dim.w, openable.dim.h);
  newOpenable.angle = openable.angle;

  newOpenable.snap.pos = openable.snap.pos;
  newOpenable.snap.orientation = openable.snap.orientation;
  if (openable.snap.edge) {
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

  graph.reset();
  labels.length = 0;
  openables.length = 0;
  furniture.length = 0;
  floorplanImage.reset();

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

    floorplanImage.distance = floorplanImageJson.distance;

    const node1 = floorplanImageJson.node1;
    floorplanImage.node1 = new CornerNode(node1.id, node1.p.x, node1.p.y);

    const node2 = floorplanImageJson.node2;
    floorplanImage.node2 = new CornerNode(node2.id, node2.p.x, node2.p.y);
  }

  setState();

  drawMain();
}

// A movable is an abstract object that can be translated and rotated on the canvas
type MovableJSON = { type: MovableType, stroke: string, fill: string };
class Movable {
  type: MovableType;
  delta: Point;
  translate: boolean;
  rotate: boolean;
  remove: boolean;

  stroke: string;
  fill: string;

  constructor(type: MovableType) {
    this.type = type;
    this.delta = {
      x: 0,
      y: 0
    };
    this.translate = false;
    this.rotate = false;
    this.remove = false;

    this.stroke = "black";
    this.fill = "";
  }

  getFill(isDisabled: boolean, highlight: boolean = false): string {
    return this.remove ? "red" : isDisabled ? "gray" : highlight && (this.translate || this.rotate) ? "green" : this.fill;
  }
  getStroke(isDisabled: boolean, highlight: boolean = false): string {
    return this.remove ? "red" : isDisabled ? "gray" : highlight && (this.translate || this.rotate) ? "green" : this.stroke;
  }

  setStyle(isDisabled: boolean, highlight: boolean = false) {
    ctx.value.fillStyle = this.getFill(isDisabled, highlight);
    ctx.value.strokeStyle = this.getStroke(isDisabled, highlight);
  }

  movableToJSON(): MovableJSON {
    return { type: this.type, stroke: this.stroke, fill: this.fill };
  }
}

// snap utility
function snap(angle: number, value: number, diff: number): boolean {
  return angle % value < diff || angle % value > value - diff;
}

function handleSnap(mov: Rectangle | Ellipse, values: number[], angle: number, diff: number): boolean {
  for (const value of values) {
    if (snap(angle, value, diff)) {
      mov.angle = value % 360;
      mov.delta = projection.from(rotate(mov.center(),
        mov.angleSnapPoint(),
        value % 360
      ));
      return true;
    }
  }
  return false;
}

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

// An openable is a door or window, it can be moved and rotated
type OpenableSnapType = { edge: Edge | null, pos: optionalNumber, orientation: optionalNumber };
type OpenableJSON = { mov: MovableJSON, openableType: OpenableType, p: Point, dim: Dim, angle: number, snap: OpenableSnapType };
class Openable extends Movable {
  openableType: OpenableType;
  p: Point;
  dim: Dim;
  angle: number;
  snap: OpenableSnapType;

  constructor(type: OpenableType, x: number, y: number, w: number, h: number) {
    super(MovableType.Openable);
    this.openableType = type;
    this.p = {
      x,
      y
    };
    this.dim = {
      w,
      h
    };
    this.angle = 0;
    this.snap = {
      edge: null,
      pos: null,
      orientation: null,
    }
  }

  center(): Point {
    return {
      x: this.p.x + this.dim.w / 2,
      y: this.p.y
    };
  }

  handle(): Point {
    return {
      x: this.p.x,
      y: this.p.y - this.dim.h
    }
  }

  pointInRotCircle(other: Point, radius: number): boolean {
    const pRot = rotate(this.center(), other, -this.angle);
    return pointInCircle(translate(this.handle(), { w: radius, h: radius }), radius, pRot);
  }

  getRotateSize(): number {
    if (this.dim.w / 2 <= settings.value.furnitureRotateSize || this.dim.h / 2 <= settings.value.furnitureRotateSize) {
      return Math.min(this.dim.w, this.dim.h) / 2;
    }
    return settings.value.furnitureRotateSize;
  }

  pointInRotRectangle(other: Point): boolean {
    const pRot = rotate(this.center(), other, -this.angle);
    const h = this.handle();
    if (h.x <= pRot.x && h.x + this.dim.w >= pRot.x && h.y <= pRot.y && h.y + this.dim.h >= pRot.y) {
      return true;
    }
    return false;
  }

  handleClick(e: Point): boolean {
    if (this.snap.edge === null && this.pointInRotCircle(projection.to(e), this.getRotateSize() / 2)) {
      this.rotate = true;
      this.delta.x = e.x;
      this.delta.y = e.y;
      return true;
    } else if (this.pointInRotRectangle(projection.to(e))) {
      this.translate = true;
      this.delta.x = e.x;
      this.delta.y = e.y;
      return true;
    }
    return false;
  }

  handleSnap(values: number[], angle: number, diff: number): boolean {
    for (const value of values) {
      if (snap(angle, value, diff)) {
        this.angle = value % 360;
        this.delta = projection.from(rotate(this.center(),
          { x: this.p.x, y: this.p.y - this.dim.h },
          value % 360
        ));
        return true;
      }
    }
    return false;
  }

  handleEdgeSnap(p: Point, graph: Graph) {
    const clickPos = projection.to(p);

    let minDist: optionalNumber = null;
    let minEdge: Edge | null = null;
    let minT: optionalNumber = null;
    let minOrientation: optionalNumber = null;

    for (const outEdges of Object.values(graph.edges)) {
      for (const edge of Object.values(outEdges)) {
        const node1 = graph.nodes[edge.id1] as CornerNode;
        const node2 = graph.nodes[edge.id2] as CornerNode;

        const t =
          ((node2.p.x - node1.p.x) * (clickPos.x - node1.p.x) + (node2.p.y - node1.p.y) * (clickPos.y - node1.p.y)) /
          ((node2.p.x - node1.p.x) ** 2 + (node2.p.y - node1.p.y) ** 2);

        if (t < 0 || t > 1) {
          continue;
        }
        const orientationDist =
          ((node2.p.x - node1.p.x) * (node1.p.y - clickPos.y) - (node1.p.x - clickPos.x) * (node2.p.y - node1.p.y)) /
          distance(node2.p, node1.p);
        const dist = Math.abs(orientationDist);
        if (dist < settings.value.nodeExtendSize && (minDist === null || dist < minDist)) {
          minDist = dist;
          minEdge = edge;
          minT = t;
          minOrientation = Math.sign(orientationDist) < 0 ? 1 : 0;

          const proj = {
            x: node1.p.x + t * (node2.p.x - node1.p.x),
            y: node1.p.y + t * (node2.p.y - node1.p.y)
          };

          const shift = { x: proj.x - this.dim.w / 2, y: proj.y };
          this.p = shift;
          this.delta = projection.from(proj);
          this.angle = toDeg(Math.atan2(node2.p.y - node1.p.y, node2.p.x - node1.p.x)) + minOrientation * 180;
        }
      }
    }

    this.snap.pos = minT;
    this.snap.orientation = minOrientation;

    if (this.snap.edge !== null && this.snap.edge !== minEdge) {
      for (let i = this.snap.edge.snapOpenables.length - 1; i >= 0; --i) {
        if (this.snap.edge.snapOpenables[i] === this) {
          this.snap.edge.snapOpenables.splice(i, 1);
          break;
        }
      }
    }
    if (this.snap.edge !== minEdge) {
      this.snap.edge = minEdge;
      if (this.snap.edge !== null) {
        this.snap.edge.snapOpenables.push(this);
      }
    }

    if (minDist === null) {
      this.snap.edge = null;
      this.snap.pos = null;
      this.snap.orientation = null;

      this.p.x += (p.x - this.delta.x) / projection.scale;
      this.p.y += (p.y - this.delta.y) / projection.scale;

      this.delta.x = p.x;
      this.delta.y = p.y;
    }
  }

  handleMove(e: Point, graph: Graph): boolean {
    let changed = false;
    if (this.translate) {
      changed = true;

      this.handleEdgeSnap(e, graph);

      handleRemove(e, this);
    } else if (this.rotate) {
      changed = true;
      const a = angleBetweenPoints(projection.from(this.center()),
        this.delta,
        e);
      if (!this.handleSnap([360, 270, 180, 90], Math.abs((this.angle + a + 360) % 360), settings.value.furnitureSnapAngle)) {
        this.angle += a;

        this.delta.x = e.x;
        this.delta.y = e.y;
      }
    }

    return changed;
  }

  draw() {
    ctx.value.save();

    const c = this.center();

    ctx.value.translate(c.x, c.y);
    ctx.value.rotate(toRad(this.angle));

    this.setStyle(settings.value.mode !== Mode.Room);

    switch (this.openableType) {
      case OpenableType.Left: {
        ctx.value.beginPath();
        ctx.value.moveTo(-this.dim.w / 2, 0);
        ctx.value.lineTo(-this.dim.w / 2, this.dim.w);
        ctx.value.stroke();

        ctx.value.beginPath();
        ctx.value.arc(-this.dim.w / 2, 0, this.dim.w, 0, Math.PI / 2);
        ctx.value.stroke();
        break;
      }
      case OpenableType.Right: {
        ctx.value.beginPath();
        ctx.value.moveTo(this.dim.w / 2, 0);
        ctx.value.lineTo(this.dim.w / 2, this.dim.w);
        ctx.value.stroke();

        ctx.value.beginPath();
        ctx.value.arc(this.dim.w / 2, 0, this.dim.w, Math.PI / 2, Math.PI);
        ctx.value.stroke();
        break;
      }
      case OpenableType.Double: {
        ctx.value.beginPath();
        ctx.value.moveTo(-this.dim.w / 2, 0);
        ctx.value.lineTo(-this.dim.w / 2, this.dim.w / 2);
        ctx.value.stroke();

        ctx.value.beginPath();
        ctx.value.arc(-this.dim.w / 2, 0, this.dim.w / 2, 0, Math.PI / 2);
        ctx.value.stroke();

        ctx.value.beginPath();
        ctx.value.moveTo(this.dim.w / 2, 0);
        ctx.value.lineTo(this.dim.w / 2, this.dim.w / 2);
        ctx.value.stroke();

        ctx.value.beginPath();
        ctx.value.arc(this.dim.w / 2, 0, this.dim.w / 2, Math.PI / 2, Math.PI);
        ctx.value.stroke();
        break;
      }
    }

    const rotateSize = this.getRotateSize();

    if (settings.value.mode === Mode.Room) {
      ctx.value.beginPath();
      ctx.value.rect(-this.dim.w / 2, -this.dim.h, this.dim.w, this.dim.h);
      ctx.value.stroke();

      if (this.snap.edge === null) {
        ctx.value.beginPath();
        ctx.value.arc(
          -this.dim.w / 2 + rotateSize / 2,
          -this.dim.h + rotateSize / 2,
          rotateSize / 2,
          0,
          2 * Math.PI
        );
        ctx.value.stroke();
      }
    }

    if (this.translate || this.rotate) {
      setFontSize(rotateSize * 2);

      ctx.value.beginPath();
      drawDistance(0, -this.dim.h + rotateSize * 2, this.dim.w, null, "mm");
      ctx.value.stroke();

      if (this.snap.edge !== null && this.snap.pos !== null && this.snap.orientation !== null) {
        const node1 = graph.nodes[this.snap.edge.id1] as CornerNode;
        const node2 = graph.nodes[this.snap.edge.id2] as CornerNode;

        const dist: number = distance(node1.p, node2.p);
        const dist1: number = dist * this.snap.pos - this.dim.w / 2;
        const dist2: number = dist * (1 - this.snap.pos) - this.dim.w / 2;

        if (dist1 > 0) {
          ctx.value.textAlign = this.snap.orientation === 0 ? "right" : "left";
          ctx.value.beginPath();
          drawDistance((this.snap.orientation - 1 / 2) * this.dim.w, -this.dim.h + rotateSize * 2, dist1, 0, "mm");
          ctx.value.stroke();
        }

        if (dist2 > 0) {
          ctx.value.textAlign = this.snap.orientation === 1 ? "right" : "left";
          ctx.value.beginPath();
          drawDistance((-this.snap.orientation + 1 / 2) * this.dim.w, -this.dim.h + rotateSize * 2, dist2, 0, "mm");
          ctx.value.stroke();
        }
      }
    }

    ctx.value.restore();
  }

  toJSON(): OpenableJSON {
    return { mov: super.movableToJSON(), openableType: this.openableType, p: this.p, dim: this.dim, angle: this.angle, snap: this.snap };
  }
}

// A generalized rectangle with multiple segments of different dimensions, it can be moved and rotated
type RectangleJSON = { mov: MovableJSON, name: string, p: Point, dims: Dim[], angle: number };;
class Rectangle extends Movable {
  name: string;
  p: Point;
  dims: Dim[];
  angle: number;

  constructor(name: string, type: MovableType, x: number, y: number, w: number, h: number) {
    super(type);
    this.name = name;
    this.p = {
      x,
      y
    };
    this.dims = [{
      w,
      h
    }];
    this.angle = 0;
  }

  getMaxDim(): Dim {
    let result = { w: 0, h: 0 };
    for (const dim of this.dims) {
      result.w += dim.w;
      result.h = Math.max(result.h, dim.h);
    }
    return result;
  }

  getMinDim(): Dim {
    let result = { w: 0, h: Number.MAX_VALUE };
    for (const dim of this.dims) {
      result.w += dim.w;
      result.h = Math.min(result.h, dim.h);
    }
    return result;
  }

  center(): Point {
    const maxDim = this.getMaxDim();
    return {
      x: this.p.x + maxDim.w / 2,
      y: this.p.y + maxDim.h / 2
    };
  }

  pointInRotCircle(other: Point, radius: number): boolean {
    const pRot = rotate(this.center(), other, -this.angle);
    return pointInCircle(translate(this.p, { w: radius, h: radius }), radius, pRot);
  }

  getRotateSize(): number {
    const minDim = this.getMinDim();
    if (minDim.w / 2 <= settings.value.furnitureRotateSize || minDim.h / 2 <= settings.value.furnitureRotateSize) {
      return Math.min(minDim.w, minDim.h) / 2;
    }
    return settings.value.furnitureRotateSize;
  }

  pointInRotRectangle(other: Point): boolean {
    const pRot = rotate(this.center(), other, -this.angle);
    let currX = this.p.x;
    for (const dim of this.dims) {
      if (currX <= pRot.x && currX + dim.w >= pRot.x && this.p.y <= pRot.y && this.p.y + dim.h >= pRot.y) {
        return true;
      }
      currX += dim.w;
    }
    return false;
  }

  setFontSize() {
    setFontSize(1);
    const textDim = ctx.value.measureText(this.name);
    const minDim = this.getMinDim();
    setFontSize(Math.min(Math.min(160, minDim.h), minDim.w / textDim.width));
  }

  angleSnapPoint(): Point {
    return this.p;
  }

  handleClick(e: Point): boolean {
    if (this.pointInRotCircle(projection.to(e), this.getRotateSize() / 2)) {
      this.rotate = true;
      this.delta.x = e.x;
      this.delta.y = e.y;
      return true;
    } else if (this.pointInRotRectangle(projection.to(e))) {
      this.translate = true;
      this.delta.x = e.x;
      this.delta.y = e.y;
      return true;
    }
    return false;
  }

  handleMove(e: Point): boolean {
    let changed = false;
    if (this.translate) {
      changed = true;

      this.p.x += (e.x - this.delta.x) / projection.scale;
      this.p.y += (e.y - this.delta.y) / projection.scale;

      this.delta.x = e.x;
      this.delta.y = e.y;

      handleRemove(e, this);
    } else if (this.rotate) {
      changed = true;
      const a = angleBetweenPoints(projection.from(this.center()),
        this.delta,
        e);
      if (!handleSnap(this, [360, 270, 180, 90], Math.abs((this.angle + a + 360) % 360), settings.value.furnitureSnapAngle)) {
        this.angle += a;

        this.delta.x = e.x;
        this.delta.y = e.y;
      }
    }

    return changed;
  }

  draw() {
    ctx.value.save();

    const c = this.center();
    const maxDim = this.getMaxDim();
    const minDim = this.getMinDim();

    ctx.value.translate(c.x, c.y);
    ctx.value.rotate(toRad(this.angle));

    this.setStyle(settings.value.mode === Mode.Room, true);

    if (this.dims.length > 0) {
      ctx.value.beginPath();

      let currX = -maxDim.w / 2;
      let currY = -maxDim.h / 2;

      let prevDim: Dim | null = null;
      for (const dim of this.dims) {
        if (prevDim !== null) {
          currY += dim.h - prevDim.h;
          ctx.value.lineTo(currX, currY);
          currX += dim.w;
          ctx.value.lineTo(currX, currY);
        } else {
          ctx.value.moveTo(currX, currY);
          currY += dim.h;
          ctx.value.lineTo(currX, currY);
          currX += dim.w;
          ctx.value.lineTo(currX, currY);
        }
        prevDim = dim;
      }

      currY = -maxDim.h / 2;
      ctx.value.lineTo(currX, currY);
      ctx.value.closePath();

      ctx.value.stroke();
    }

    ctx.value.beginPath();

    this.setFontSize();
    ctx.value.textBaseline = "middle";
    ctx.value.fillText(this.name, 0, - maxDim.h / 2 + minDim.h / 2, minDim.w);
    ctx.value.textBaseline = "alphabetic";

    const rotateSize = this.getRotateSize();

    if (settings.value.mode === Mode.Furniture) {
      ctx.value.beginPath();
      ctx.value.arc(
        -maxDim.w / 2 + rotateSize / 2,
        -maxDim.h / 2 + rotateSize / 2,
        rotateSize / 2,
        0,
        2 * Math.PI
      );
      ctx.value.stroke();
    }

    if (this.translate || this.rotate) {
      setFontSize(rotateSize);

      ctx.value.beginPath();

      ctx.value.moveTo(-maxDim.w / 2, -maxDim.h / 2 + rotateSize);
      ctx.value.lineTo(-maxDim.w / 2 + maxDim.w, -maxDim.h / 2 + rotateSize);
      drawDistance(0, -maxDim.h / 2 + rotateSize, maxDim.w, null, "mm");

      ctx.value.moveTo(-maxDim.w / 2 + rotateSize, -maxDim.h / 2);
      ctx.value.lineTo(-maxDim.w / 2 + rotateSize, -maxDim.h / 2 + maxDim.h);

      ctx.value.translate(-maxDim.w / 2 + rotateSize, 0);
      ctx.value.rotate(toRad(-90));
      drawDistance(0, 0, maxDim.h, null, "mm");

      ctx.value.stroke();
    }

    ctx.value.restore();

    this.drawWallDistances();
    restoreDefaultContext();
  }

  drawWallDistances() {
    if (this.translate || this.rotate) {
      ctx.value.save();

      this.setStyle(settings.value.mode === Mode.Room, true);
      const rotateSize = this.getRotateSize();
      setFontSize(rotateSize * 1.5);

      const center = this.center();
      const maxDim = this.getMaxDim();

      // right
      drawDistanceToNextWall(center, rotate(center, { x: center.x + maxDim.w / 2, y: center.y }, this.angle));
      // left
      drawDistanceToNextWall(center, rotate(center, { x: center.x - maxDim.w / 2, y: center.y }, this.angle));
      // top
      drawDistanceToNextWall(center, rotate(center, { x: center.x, y: center.y - maxDim.h / 2 }, this.angle));
      // bottom
      drawDistanceToNextWall(center, rotate(center, { x: center.x, y: center.y + maxDim.h / 2 }, this.angle));

      ctx.value.restore();
    }
  }

  toJSON(): RectangleJSON {
    return { mov: super.movableToJSON(), name: this.name, p: this.p, dims: this.dims, angle: this.angle };
  }
}

// A circle, it can be moved and rotated
type CircleJSON = { mov: MovableJSON, name: string, c: Point, r: number };
class Circle extends Movable {
  name: string;
  c: Point;
  r: number;

  constructor(name: string, x: number, y: number, r: number) {
    super(MovableType.Circle);
    this.name = name;
    this.c = {
      x,
      y
    };
    this.r = r;
  }

  center(): Point {
    return this.c;
  }

  getDimSize(): number {
    if (this.r <= settings.value.furnitureRotateSize) {
      return this.r;
    }
    return settings.value.furnitureRotateSize;
  }

  setFontSize() {
    setFontSize(1);
    const textDim = ctx.value.measureText(this.name);
    setFontSize(Math.min(Math.min(160, 2 * this.r), 2 * this.r / textDim.width));
  }

  handleClick(e: Point): boolean {
    if (pointInCircle(this.c, this.r, projection.to(e))) {
      this.translate = true;
      this.delta.x = e.x;
      this.delta.y = e.y;
      return true;
    }
    return false;
  }

  handleMove(e: Point): boolean {
    let changed = false;
    if (this.translate) {
      changed = true;

      this.c.x += (e.x - this.delta.x) / projection.scale;
      this.c.y += (e.y - this.delta.y) / projection.scale;

      this.delta.x = e.x;
      this.delta.y = e.y;

      handleRemove(e, this);
    }

    return changed;
  }

  draw() {
    ctx.value.save();

    ctx.value.translate(this.c.x, this.c.y);

    this.setStyle(settings.value.mode === Mode.Room, true);

    ctx.value.beginPath();
    ctx.value.arc(0, 0, this.r, 0, 2 * Math.PI);
    ctx.value.stroke();

    ctx.value.beginPath();

    this.setFontSize();
    ctx.value.textBaseline = "middle";
    ctx.value.fillText(this.name, 0, 0, 2 * this.r);
    ctx.value.textBaseline = "alphabetic";

    const rotateSize = this.getDimSize();

    if (this.translate) {
      setFontSize(rotateSize);

      ctx.value.beginPath();

      ctx.value.moveTo(-this.r, -this.r);
      ctx.value.lineTo(this.r, -this.r);
      drawDistance(0, -this.r + rotateSize, 2 * this.r, null, "mm");
      ctx.value.stroke();
    }

    ctx.value.restore();

    this.drawWallDistances();
    restoreDefaultContext();
  }

  drawWallDistances() {
    if (this.translate || this.rotate) {
      ctx.value.save();

      this.setStyle(settings.value.mode === Mode.Room, true);
      const rotateSize = this.getDimSize();
      setFontSize(rotateSize * 1.5);

      const center = this.center();

      // right
      drawDistanceToNextWall(center, { x: center.x + this.r, y: center.y });
      // left
      drawDistanceToNextWall(center, { x: center.x - this.r, y: center.y });
      // top
      drawDistanceToNextWall(center, { x: center.x, y: center.y - this.r });
      // bottom
      drawDistanceToNextWall(center, { x: center.x, y: center.y + this.r });

      ctx.value.restore();
    }
  }

  toJSON(): CircleJSON {
    return { mov: super.movableToJSON(), name: this.name, c: this.c, r: this.r };
  }
}

// An ellipse, it can be moved and rotated
type EllipseJSON = { mov: MovableJSON, name: string, c: Point, rX: number, rY: number, angle: number };
class Ellipse extends Movable {
  name: string;
  c: Point;
  rX: number;
  rY: number;
  f: number;
  z: number;
  angle: number;

  constructor(name: string, x: number, y: number, rX: number, rY: number) {
    super(MovableType.Ellipse);
    this.name = name;
    this.c = {
      x,
      y
    };
    this.rX = rX;
    this.rY = rY;
    this.f = Math.sqrt(Math.max(this.rX, this.rY) ** 2 - Math.min(this.rX, this.rY) ** 2);
    this.z = Math.min(this.rX, this.rY) ** 2 / Math.max(this.rX, this.rY);
    this.angle = 0;
  }

  center(): Point {
    return this.c;
  }

  getF1(): Point {
    return this.rX < this.rY ? { x: this.c.x, y: this.c.y - this.f } : { x: this.c.x - this.f, y: this.c.y };
  }

  getF2(): Point {
    return this.rX < this.rY ? { x: this.c.x, y: this.c.y + this.f } : { x: this.c.x + this.f, y: this.c.y };
  }

  getRotateSize(): number {
    if (this.z <= settings.value.furnitureRotateSize) {
      return this.z;
    }
    return settings.value.furnitureRotateSize;
  }

  getDimSize(): number {
    if (this.rX <= settings.value.furnitureRotateSize || this.rY <= settings.value.furnitureRotateSize) {
      return Math.min(this.rX, this.rY);
    }
    return settings.value.furnitureRotateSize;
  }

  pointInEllipse(p: Point): boolean {
    return distance(p, this.getF1()) + distance(p, this.getF2()) <= 2 * Math.max(this.rX, this.rY);
  }

  pointInRotCircle(other: Point, radius: number): boolean {
    const pRot = rotate(this.center(), other, -this.angle);
    return pointInCircle(this.angleSnapPoint(), radius, pRot);
  }

  pointInRotEllipse(other: Point): boolean {
    const pRot = rotate(this.center(), other, -this.angle);
    return this.pointInEllipse(pRot);
  }

  setFontSize() {
    setFontSize(1);
    const textDim = ctx.value.measureText(this.name);
    setFontSize(Math.min(Math.min(160, 2 * this.rY), 2 * this.rX / textDim.width));
  }

  angleSnapPoint(): Point {
    return this.getF2();
  }

  handleClick(e: Point): boolean {
    if (this.rX !== this.rY && this.pointInRotCircle(projection.to(e), this.getRotateSize() / 2)) {
      this.rotate = true;
      this.delta.x = e.x;
      this.delta.y = e.y;
      return true;
    } else if (this.pointInRotEllipse(projection.to(e))) {
      this.translate = true;
      this.delta.x = e.x;
      this.delta.y = e.y;
      return true;
    }
    return false;
  }

  handleMove(e: Point): boolean {
    let changed = false;
    if (this.translate) {
      changed = true;

      this.c.x += (e.x - this.delta.x) / projection.scale;
      this.c.y += (e.y - this.delta.y) / projection.scale;

      this.delta.x = e.x;
      this.delta.y = e.y;

      handleRemove(e, this);
    } else if (this.rotate) {
      changed = true;
      const a = angleBetweenPoints(projection.from(this.center()),
        this.delta,
        e);
      if (!handleSnap(this, [360, 270, 180, 90], Math.abs((this.angle + a + 360) % 360), settings.value.furnitureSnapAngle)) {
        this.angle += a;

        this.delta.x = e.x;
        this.delta.y = e.y;
      }
    }

    return changed;
  }

  draw() {
    ctx.value.save();

    ctx.value.translate(this.c.x, this.c.y);
    ctx.value.rotate(toRad(this.angle));

    this.setStyle(settings.value.mode === Mode.Room, true);

    ctx.value.beginPath();
    ctx.value.ellipse(0, 0, this.rX, this.rY, 0, 0, 2 * Math.PI);
    ctx.value.stroke();

    ctx.value.beginPath();

    this.setFontSize();
    ctx.value.textBaseline = "middle";
    ctx.value.fillText(this.name, 0, 0, 2 * this.rX);
    ctx.value.textBaseline = "alphabetic";

    const rotateSize = this.getRotateSize();

    if (settings.value.mode === Mode.Furniture && this.rX !== this.rY) {
      ctx.value.beginPath();
      const f = this.angleSnapPoint();
      ctx.value.arc(
        f.x - this.c.x,
        f.y - this.c.y,
        rotateSize / 2,
        0,
        2 * Math.PI
      );
      ctx.value.stroke();
    }

    const dimSize = this.getDimSize();

    if (this.translate || this.rotate) {
      setFontSize(dimSize);

      ctx.value.beginPath();

      ctx.value.moveTo(-this.rX, -this.rY);
      ctx.value.lineTo(this.rX, -this.rY);
      drawDistance(0, -this.rY + dimSize, 2 * this.rX, null, "mm");

      ctx.value.moveTo(-this.rX, -this.rY);
      ctx.value.lineTo(-this.rX, this.rY);

      ctx.value.translate(-this.rX + dimSize, 0);
      ctx.value.rotate(toRad(-90));
      drawDistance(0, 0, 2 * this.rY, null, "mm");

      ctx.value.stroke();
    }

    ctx.value.restore();

    this.drawWallDistances();
    restoreDefaultContext();
  }

  drawWallDistances() {
    if (this.translate || this.rotate) {
      ctx.value.save();

      this.setStyle(settings.value.mode === Mode.Room, true);
      const rotateSize = this.getDimSize();
      setFontSize(rotateSize * 1.5);

      const center = this.center();

      // right
      drawDistanceToNextWall(center, rotate(center, { x: center.x + this.rX, y: center.y }, this.angle));
      // left
      drawDistanceToNextWall(center, rotate(center, { x: center.x - this.rX, y: center.y }, this.angle));
      // top
      drawDistanceToNextWall(center, rotate(center, { x: center.x, y: center.y - this.rY }, this.angle));
      // bottom
      drawDistanceToNextWall(center, rotate(center, { x: center.x, y: center.y + this.rY }, this.angle));

      ctx.value.restore();
    }
  }

  toJSON(): EllipseJSON {
    return { mov: super.movableToJSON(), name: this.name, c: this.c, rX: this.rX, rY: this.rY, angle: this.angle };
  }
}


function toNextNumber(p: Point): Point {
  return { x: Math.round(p.x), y: Math.round(p.y) };
}

function distance(p1: Point, p2: Point): number {
  return Math.sqrt((p2.x - p1.x) ** 2 + (p2.y - p1.y) ** 2);
}

function translate(p: Point, dim: Dim, sc: number = 1): Point {
  return {
    x: p.x + dim.w / sc,
    y: p.y + dim.h / sc
  };
}

function toRad(angle: number): number {
  return Math.PI * angle / 180;
}
function toDeg(angle: number): number {
  return 180 * angle / Math.PI;
}

function rotate(c: Point, p: Point, angle: number): Point {
  const rad = toRad(angle);
  return {
    x: Math.cos(rad) * (p.x - c.x) - Math.sin(rad) * (p.y - c.y) + c.x,
    y: Math.sin(rad) * (p.x - c.x) + Math.cos(rad) * (p.y - c.y) + c.y
  };
}

function angleBetweenPoints(p1: Point, p2: Point, p3: Point): number {
  return toDeg(Math.atan2(p3.y - p1.y, p3.x - p1.x) -
    Math.atan2(p2.y - p1.y, p2.x - p1.x));
}

function pointInCircle(c: Point, r: number, p: Point): boolean {
  return distance(c, p) <= r;
}

function getIntersectionPoint(center: Point, border: Point, wall1: Point, wall2: Point): Point | null {
  const denom = (center.x - border.x) * (wall1.y - wall2.y) - (center.y - border.y) * (wall1.x - wall2.x);
  if (denom === 0) {
    return null;
  }
  const t = ((center.x - wall1.x) * (wall1.y - wall2.y) - (center.y - wall1.y) * (wall1.x - wall2.x)) / denom;
  const u = ((center.x - wall1.x) * (center.y - border.y) - (center.y - wall1.y) * (center.x - border.x)) / denom;

  if (t > 1 && u >= 0 && u <= 1) {
    return { x: center.x + t * (border.x - center.x), y: center.y + t * (border.y - center.y) };
  }
  return null;
}

function getTrapezoidArea(p1: Point, p2: Point): number {
  return (p1.x - p2.x) * (p1.y + p2.y) / 2;
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

function navUp() {
  moveProjection(Direction.Up)
}

function navRight() {
  moveProjection(Direction.Right)
}

function navDown() {
  moveProjection(Direction.Down)
}

function navLeft() {
  moveProjection(Direction.Left)
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

  console.log(ctx.value)

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
  width: 70%;

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