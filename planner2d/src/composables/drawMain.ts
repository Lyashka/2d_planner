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
  const { projection, floorplanProjection } = useProjectionStore()
  const { settings } = useSettingsStore()

  let modeProjection
  if (settings.value.mode === Mode.Room || settings.value.mode === Mode.Furniture || settings.value.mode === Mode.Presentation) {
    modeProjection = projection
  }
  else if(settings.value.mode === Mode.Floorplan) {
    modeProjection = floorplanProjection
  }

  const lhs = modeProjection.to({ x: 0, y: 0 });
  const rhs = modeProjection.to({ x: canvas.value.width, y: 0 });
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
    ctx.value.moveTo((-modeProjection.p.x + 20) / modeProjection.scale + i, (-modeProjection.p.y + 17) / modeProjection.scale);
    ctx.value.lineTo((-modeProjection.p.x + 20) / modeProjection.scale + i, (-modeProjection.p.y + 27) / modeProjection.scale);
    if (i % (10 * range) === 0 || Math.floor(scaleWidth / range) < 10) {
      ctx.value.fillText((i / units) + unit,
        (-modeProjection.p.x + 20) / modeProjection.scale + i,
        (-modeProjection.p.y + 15) / modeProjection.scale,
        Math.floor(scaleWidth / range) < 10 ? range : scaleWidth / 2);
    }
  }

  ctx.value.moveTo((-modeProjection.p.x + 20) / modeProjection.scale, (-modeProjection.p.y + 22) / modeProjection.scale);
  ctx.value.lineTo((-modeProjection.p.x + 20) / modeProjection.scale + i - range, (-modeProjection.p.y + 22) / modeProjection.scale);

  ctx.value.stroke();
  restoreDefaultContext();
}
function drawDeletionField() {
  const { ctx, canvas } = useCanvasStore()
  const { settings } = useSettingsStore()
  const { projection, floorplanProjection } = useProjectionStore()

  // only display garbage bin if needed
  if (settings.value.mode === Mode.Presentation) {
    return;
  }

  let a
  let d
  if (settings.value.mode === Mode.Room || settings.value.mode === Mode.Furniture) {
     a = projection.to({ x: canvas.value.width - settings.value.deleteDim.w, y: 0 })
     d = projection.to({ x: canvas.value.width, y: settings.value.deleteDim.h })
  }
  else if(settings.value.mode === Mode.Floorplan){
    a = floorplanProjection.to({ x: canvas.value.width - settings.value.deleteDim.w, y: 0 })
    d = floorplanProjection.to({ x: canvas.value.width, y: settings.value.deleteDim.h })
  }



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
  const { graph, floorPlanGraph } = useGraphStore()
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

    drawScale();
    drawDeletionField();

    // floorPlanGraph.draw();
    if (Object.keys(floorPlanGraph.nodes).length === 0) {
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

      floorPlanGraph.draw();

      for (let i = furniture.length - 1; i >= 0; i--) {
        const fur = furniture[i];
        if (fur !== undefined) {
          fur.draw();
        }
      }
    }

    return;
  }else{
    ctx.value.translate(projection.p.x, projection.p.y);
    ctx.value.scale(projection.scale, projection.scale);

    // global properties
    restoreDefaultContext();

    // floorplanImage.value.draw();

    drawScale();
    drawDeletionField();

    if (Object.keys(graph.nodes).length === 0 && furniture.length === 0 && openables.length === 0 && labels.length === 0) {
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