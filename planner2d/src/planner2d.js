import './planner2d.css'

export default {
  name: 'CategoryList',
  props: [''],

  mounted() {
    const container = document.getElementById('container');
    const addLineButton = document.getElementById('addLineButton');

// Создание сцены и слоя
    const stage = new Konva.Stage({
      container: 'container',
      width: 1000,
      height: 800
    });
    const layer = new Konva.Layer();
    stage.add(layer);

    let lines = [];
    let draggingLine = null;
    let resizingEnd = null; // Храним, какой конец линии сейчас изменяется

// Разметка сетки
    const gridSize = 50; // Размер ячейки сетки
    const gridLines = [];

// Функция для создания линии сетки
    function createGridLine(x, y, isHorizontal) {
      const line = new Konva.Line({
        points: isHorizontal ? [0, y, stage.width(), y] : [x, 0, x, stage.height()],
        stroke: 'lightgray',
        strokeWidth: 1
      });
      gridLines.push(line);
      layer.add(line);
    }

// Создание сетки
//     for (let i = 0; i <= stage.width() / gridSize; i++) {
//       createGridLine(i * gridSize, 0, false); // Вертикальные линии
//     }
//     for (let i = 0; i <= stage.height() / gridSize; i++) {
//       createGridLine(0, i * gridSize, true); // Горизонтальные линии
//     }
//     layer.draw();

    addLineButton.addEventListener('click', () => {
      // Создание новой линии
      const line = new Konva.Line({
        points: [50, 50, 150, 150],
        stroke: 'black',
        strokeWidth: 7,
        draggable: false, // Теперь линия не перетаскивается
        name: 'line'
      });

      // Создание кругов для концов линии
      const startCircle = new Konva.Circle({
        x: 50,
        y: 50,
        radius: 5,
        fill: 'red',
        draggable: true,
        name: 'line-start'
      });
      const endCircle = new Konva.Circle({
        x: 150,
        y: 150,
        radius: 5,
        fill: 'red',
        draggable: true,
        name: 'line-end'
      });

      // Создание группы для линии и кругов
      const lineGroup = new Konva.Group({
        draggable: true, // Делаем группу перетаскиваемой
        lineJoin: 'bevel',
      });

      lineGroup.add(line);
      lineGroup.add(startCircle);
      lineGroup.add(endCircle);

      // Установка offset для группы
      lineGroup.setAttrs({
        offset: {
          x: startCircle.getX(),
          y: startCircle.getY()
        }
      });

      // Добавление обработчиков событий для перетаскивания и изменения размера
      lineGroup.on('dragmove', () => {

        const offset = lineGroup.getAttrs().offset;
        if (offset) {
          const { x: dx, y: dy } = offset;

          // Ограничение перемещения группы сеткой
          const gridX1 = Math.round((startCircle.getX() + dx) / gridSize) * gridSize;
          const gridY1 = Math.round((startCircle.getY() + dy) / gridSize) * gridSize;
          const gridX2 = Math.round((endCircle.getX() + dx) / gridSize) * gridSize;
          const gridY2 = Math.round((endCircle.getY() + dy) / gridSize) * gridSize;

          // Обновление позиции линии и кругов
          line.setPoints([gridX1, gridY1, gridX2, gridY2]);
          startCircle.setX(gridX1);
          startCircle.setY(gridY1);
          endCircle.setX(gridX2);
          endCircle.setY(gridY2);

          // Обновление offset группы
          lineGroup.setAttrs({
            offset: {
              x: gridX1,
              y: gridY1
            }
          });


          layer.draw();
        }
      });

      startCircle.on('dragmove', () => {
        // Ограничение перемещения круга сеткой
        const gridX = Math.round(startCircle.getX() / gridSize) * gridSize;
        const gridY = Math.round(startCircle.getY() / gridSize) * gridSize;
        startCircle.setX(gridX);
        startCircle.setY(gridY);
        line.setPoints([gridX, gridY, line.getPoints()[2], line.getPoints()[3]]);

        // checkConnectionPoints(startCircle); // Проверка соединения при перемещении

        layer.draw();
      });

      endCircle.on('dragmove', () => {
        // Ограничение перемещения круга сеткой
        const gridX = Math.round(endCircle.getX() / gridSize) * gridSize;
        const gridY = Math.round(endCircle.getY() / gridSize) * gridSize;
        endCircle.setX(gridX);
        endCircle.setY(gridY);
        line.setPoints([line.getPoints()[0], line.getPoints()[1], gridX, gridY]);

        // checkConnectionPoints(endCircle)

        layer.draw();

      });

      // Добавление линии и кругов в массив линий и на слой
      lines.push(lineGroup);
      layer.add(lineGroup);
      layer.draw();
    });

// Функция для удаления сетки
    function removeGrid() {
      gridLines.forEach(line => {
        line.destroy();
      });
      gridLines.length = 0;
      layer.draw();
    }

// Добавьте кнопку для удаления сетки (если нужно)
    const removeGridButton = document.createElement('button');
    removeGridButton.textContent = 'Удалить сетку';
    removeGridButton.addEventListener('click', removeGrid);
    document.body.appendChild(removeGridButton);

    // function checkConnectionPoints(circleInfo) {
    //   layer.children.forEach(e => {
    //     if (e.children) {
    //       e.children.forEach(item => {
    //         if (areArraysEqual([circleInfo.getX(), circleInfo.getY()], [item.attrs.x, item.attrs.y]) && item._id !== circleInfo._id) {
    //           // console.log([item.attrs, circleInfo.attrs])
    //
    //           // Используйте setX и setY для обновления координат
    //           item.setX(circleInfo.getX());
    //           item.setY(circleInfo.getY());
    //
    //           // Обновите точки линии, к которой принадлежит `item`
    //           const connectedLine = item.parent.find('.line');
    //           if (item.name === 'line-start') {
    //             connectedLine.setPoints([item.getX(), item.getY(), connectedLine.getPoints()[2], connectedLine.getPoints()[3]]);
    //           } else {
    //             connectedLine.setPoints([connectedLine.getPoints()[0], connectedLine.getPoints()[1], item.getX(), item.getY()]);
    //           }
    //         }
    //       });
    //     }
    //   });
    // }
    //
    // function areArraysEqual(arr1, arr2) {
    //   return arr1.toString() === arr2.toString();
    // }








// Функция обновления точек линии при перетаскивании (уже не нужна)
// function updateLinePoints(line) {
//   const linePoints = line.getPoints();
//   const x1 = linePoints[0];
//   const y1 = linePoints[1];
//   const x2 = linePoints[2];
//   const y2 = linePoints[3];
//   line.setPoints([x1, y1, x2, y2]);
//   layer.draw();
// }

    // const stage = new Konva.Stage({
    //   container: 'container',
    //   width: 1000,
    //   height: 800,
    // });
    //
    // const layer = new Konva.Layer();
    // stage.add(layer);
    //
    // let isDrawing = false;
    // let line;
    // let startX, startY;
    //
    //
    // const createCircle = (x, y, color) => {
    //   const circle = new Konva.Circle({
    //     x: x,
    //     y: y,
    //     radius: 5,
    //     fill: color,
    //     stroke: 'black',
    //     strokeWidth: 1,
    //   });
    //   return circle;
    // };
    //
    // const handleMouseDown = (e) => {
    //   console.log('handleMouseDown');
    //   console.log(layer.children)
    //   console.log(e)
    //
    //     isDrawing = true;
    //     startX = e.evt.offsetX;
    //     startY = e.evt.offsetY;
    //     line = new Konva.Line({
    //       points: [startX, startY, startX, startY],
    //       stroke: 'black',
    //       strokeWidth: 5,
    //       draggable: true,
    //     });
    //
    //   const startCircle = createCircle(startX, startY, 'red');
    //   const endCircle = createCircle(startX, startY, 'red');
    //   layer.add(line, startCircle, endCircle);
    //
    //   line.startCircle = startCircle;
    //   line.endCircle = endCircle;
    //
    //   layer.draw();
    // };
    //
    // const handleMouseMove = (e) => {
    //   if (isDrawing) {
    //     line.setPoints([startX, startY, e.evt.offsetX, e.evt.offsetY]);
    //     // Update circle positions
    //     line.startCircle.x(startX);
    //     line.startCircle.y(startY);
    //     line.endCircle.x(e.evt.offsetX);
    //     line.endCircle.y(e.evt.offsetY);
    //     layer.draw();
    //   }
    // };
    //
    // const handleMouseUp = () => {
    //   console.log('handleMouseUp');
    //   isDrawing = false;
    // };
    //
    // const handleMouseover = (e) => {
    //   console.log( e.target.attrs.stroke)
    //   if (e.target instanceof Konva.Line) {
    //     // Highlight circles on mouseover
    //     e.target.attrs.stroke = 'red'
    //     e.target.startCircle.fill('blue');
    //     e.target.endCircle.fill('blue');
    //     layer.draw();
    //   }
    // };
    //
    // const handleMouseout = (e) => {
    //   if (e.target instanceof Konva.Line) {
    //     // Reset circle colors on mouseout
    //     e.target.attrs.stroke = 'black'
    //     e.target.startCircle.fill('red');
    //     e.target.endCircle.fill('red');
    //     layer.draw();
    //   }
    // };
    //
    // stage.on('mousedown', handleMouseDown);
    // stage.on('mousemove', handleMouseMove);
    // stage.on('mouseup', handleMouseUp);
    // stage.on('mouseover', handleMouseover);
    // stage.on('mouseout', handleMouseout);
  },
  template: `

    <div id="container">
      
    </div>
    <button id="addLineButton">Добавить линию</button>
    <!--    <div id="container"></div>-->
  `}