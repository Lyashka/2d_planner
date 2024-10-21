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