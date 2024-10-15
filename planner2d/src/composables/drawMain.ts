import { Mode } from '../defs'
import { restoreDefaultContext, setFontSize } from './updateCtx'

import { useCanvasStore} from '../store/canvasStore'
import { useSettingsStore} from '../store/settingsStore'
import { useProjectionStore } from '../store/projectionStore'
import { useFloorplanImageStore } from '../store/floorplanImageStore'
import { useGraphStore} from '../store/graphStore'

import { getCurrProjection } from './getCurrProjection'

import { getText } from '../composables/getText'
import { loc } from '../composables/loc'
import { Rectangle } from '../classes/Rectangle'
import { toRad } from './calculations'

function drawScale() {
  const { ctx, canvas } = useCanvasStore()
  const { projection } = useProjectionStore()

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
  const { ctx, canvas } = useCanvasStore()
  const { settings } = useSettingsStore()
  const { projection } = useProjectionStore()

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


export function drawMain() {
  const { graph } = useGraphStore()
  const { floorplanImage, labels, openables, furniture } = useFloorplanImageStore()
  const { ctx, canvas } = useCanvasStore()
  const { settings } = useSettingsStore()
  const { projection, floorplanProjection } = useProjectionStore()

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

    floorplanImage.value.draw();

    if (floorplanImage.value.image === null) {
      drawHelp();
    }

    return;
  }

  ctx.value.translate(projection.p.x, projection.p.y);
  ctx.value.scale(projection.scale, projection.scale);

  // global properties
  restoreDefaultContext();

  floorplanImage.value.draw();

  drawScale();
  drawDeletionField();

  if (Object.keys(graph.nodes).length === 0 && furniture.length === 0 && openables.length === 0 && labels.length === 0 && floorplanImage.value.image === null) {
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
  const { ctx, canvas } = useCanvasStore()
  const { settings } = useSettingsStore()

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

  const { ctx } = useCanvasStore()
  const { settings } = useSettingsStore()

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