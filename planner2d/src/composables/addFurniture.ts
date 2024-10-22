import { FurnitureType, MovableType } from '../defs'
import { validNumericInput } from './calculations'
import { getText } from './getText'
import { loc } from './loc'
import { Rectangle } from '../classes/Rectangle'
import { Circle } from '../classes/Circle'
import { Ellipse } from '../classes/Ellipse'
import { drawMain } from './drawMain'

import { useSettingsStore } from '../store/settingsStore'
import { useProjectionStore} from '../store/projectionStore'
import { useFloorplanImageStore } from '../store/floorplanImageStore'

export function addFurnitureButton(nameInput, objSizes) {
  const { settings } = useSettingsStore()
  const { projection } = useProjectionStore()
  const {  furniture } = useFloorplanImageStore()

  switch (settings.value.type) {

    case FurnitureType.Rectangle: {
      if (!validNumericInput(objSizes.widthInput, objSizes.heightInput)) {
        alert(getText(loc.furniture.add.inputError));
        return;
      }
      const start = projection.to({ x: 10, y: 100 });
      furniture.push(new Rectangle(nameInput.value, MovableType.Rectangle, start.x, start.y, objSizes.widthInput, objSizes.heightInput));
      break;
    }

    case FurnitureType.Circle: {
      if (!validNumericInput(objSizes.circleWidthInput, objSizes.circleHeightInput)) {
        alert(getText(loc.furniture.add.inputError));
        return;
      }
      const start = projection.to({ x: 10, y: 100 });
      furniture.push(objSizes.circleWidthInput === objSizes.circleHeightInput ?
        new Circle(nameInput.value, start.x + objSizes.circleWidthInput / 2, start.y + objSizes.circleWidthInput / 2, objSizes.circleWidthInput / 2) :
        new Ellipse(nameInput.value, start.x + objSizes.circleWidthInput / 2, start.y + objSizes.circleHeightInput / 2, objSizes.circleWidthInput / 2, objSizes.circleHeightInput / 2));
      break;
    }

    case FurnitureType.L: {
      if (!validNumericInput(objSizes.LWidthInput1, objSizes.LHeightInput1, objSizes.LWidthInput2, objSizes.LHeightInput2)) {
        alert(getText(loc.furniture.add.inputError));
        return;
      }
      const start = projection.to({ x: 10, y: 100 });
      const newRect = new Rectangle(nameInput.value, MovableType.L, start.x, start.y, objSizes.LWidthInput1, objSizes.LHeightInput1);
      newRect.dims.push({ w:  objSizes.LWidthInput2, h: objSizes.LHeightInput2 });
      furniture.push(newRect);
      break;
    }

    case FurnitureType.U: {
      if (!validNumericInput(objSizes.UWidthInput1, objSizes.UHeightInput1, objSizes.UWidthInput2, objSizes.UHeightInput2, objSizes.UWidthInput3, objSizes.UHeightInput3)) {
        alert(getText(loc.furniture.add.inputError));
        return;
      }
      const start = projection.to({ x: 10, y: 100 });
      const newRect = new Rectangle(nameInput.value, MovableType.U, start.x, start.y, objSizes.UWidthInput1, objSizes.UHeightInput1);
      newRect.dims.push({ w: objSizes.UWidthInput2, h: objSizes.UHeightInput2 });
      newRect.dims.push({ w: objSizes.UWidthInput3, h: objSizes.UHeightInput3 });
      furniture.push(newRect);
      break;
    }
  }

  console.log("add %s: %s", settings.value.type, nameInput.value);
  drawMain();
}