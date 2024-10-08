import './planner2d.css'

export default {
  name: 'CategoryList',
  props: [''],


  mounted() {

    const canvas: HTMLCanvasElement = document.getElementById("canvas") as HTMLCanvasElement;
    const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

    enum Mode {
      Floorplan,
      Room,
      Furniture,
      Presentation,
    }

    enum MovableType {
      Openable = "Openable",
      Rectangle = "Rectangle",
      Ellipse = "Ellipse",
      Circle = "Circle",
      L = "L",
      U = "U",
    }

    enum OpenableType {
      Left = "Left",
      Right = "Right",
      Double = "Double",
    }

    enum FurnitureType {
      Rectangle,
      Circle,
      L,
      U,
    }

    interface Point {
      x: number,
      y: number,
    }
    interface Dim {
      w: number,
      h: number,
    }

    enum Direction {
      Up,
      Down,
      Right,
      Left,
    }

    class Projection {
      scale: number;
      p: Point;
      drag: boolean;
      delta: Point;

      constructor(scale: number, x: number = 0, y: number = 0) {
        this.scale = scale;
        this.p = { x: x, y: y };
        this.drag = false;
        this.delta = { x: 0, y: 0 };
      }
      to(q: Point): Point {
        return {
          x: (q.x - this.p.x) / this.scale,
          y: (q.y - this.p.y) / this.scale
        };
      };
      from(q: Point): Point {
        return {
          x: this.p.x + q.x * this.scale,
          y: this.p.y + q.y * this.scale
        };
      };
    }

    const projection = new Projection(0.1);
    const floorplanProjection = new Projection(1, 50, 50);

    interface Settings {
      language: string,
      mode: Mode,
      openableType: OpenableType,
      type: FurnitureType,
      readonly zoomFactor: number,
      readonly minZoom: number,
      readonly maxZoom: number,
      readonly deleteDim: Dim,
      isRemove: boolean,

      nodeTransSize: number,
      nodeExtendSize: number,
      nodeSnapDist: number,

      readonly furnitureRotateSize: number,
      readonly furnitureSnapAngle: number,

      showEdgeLabels: boolean,
      showRoomSize: boolean,
    }

    const settings: Settings = {
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
    };

    function getCurrProjection() {
      return settings.mode === Mode.Floorplan ? floorplanProjection : projection;
    }

    type optionalPoint = { x: optionalNumber, y: optionalNumber };
    type optionalString = string | null;
    type optionalNumber = number | null;

// state will lazily track changes since init or last save/load as string
    let state: optionalString = null;

    const labels: Rectangle[] = [];

    const openables: Openable[] = [];

    const furniture: (Circle | Ellipse | Rectangle)[] = [];


    // utils
    function setFontSize(size: number, fixed: boolean = true, bold: boolean = false) {
      const proj = getCurrProjection();
      ctx.font = (bold ? "normal 900 " : "") + (size / (fixed ? 1 : proj.scale)) + "px \"Segoe UI\", Arial, Helvetica, sans-serif";
    }

    function restoreDefaultContext() {
      const proj = getCurrProjection();
      ctx.lineWidth = 1.5 / proj.scale;
      ctx.lineJoin = "miter";
      setFontSize(15);
      ctx.textAlign = "center";
      ctx.textBaseline = "alphabetic";

      ctx.fillStyle = "black";
      ctx.strokeStyle = "black";
    }

    function willRemove(p: Point): boolean {
      return p.x >= canvas.width - settings.deleteDim.w && p.x <= canvas.width && p.y >= 0 && p.y <= settings.deleteDim.h;
    }

    function handleRemove(p: Point, elem: Movable | CornerNode) {
      if (willRemove(p)) {
        elem.remove = true;
        settings.isRemove = true;
      } else {
        if (elem.remove) {
          settings.isRemove = false;
        }
        elem.remove = false;
      }
    }

    function drawDistance(x: number, y: number, distance: number, precision: number | null = null, unit: string = "", factor: number = 1) {
      const distanceInUnit = distance / factor;
      const output = (precision === null ? distanceInUnit : distanceInUnit.toFixed(precision)) + unit;
      ctx.fillText(output, x, y, distance);
    }

// main
    function drawMain() {
      ctx.reset();
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // fill background for export functionality
      ctx.fillStyle = "white";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      if (settings.mode === Mode.Floorplan) {
        ctx.translate(floorplanProjection.p.x, floorplanProjection.p.y);
        ctx.scale(floorplanProjection.scale, floorplanProjection.scale);

        // global properties
        restoreDefaultContext();

        floorplanImage.draw();

        if (floorplanImage.image === null) {
          drawHelp();
        }

        return;
      }

      ctx.translate(projection.p.x, projection.p.y);
      ctx.scale(projection.scale, projection.scale);

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
      const br = proj.to({ x: canvas.width, y: canvas.height });

      ctx.fillStyle = "gray";
      setFontSize(40, false);

      ctx.beginPath();
      switch (settings.mode) {
        case Mode.Floorplan: {
          ctx.fillText(getText(loc.floorplan.help), (ul.x + br.x) / 2, (ul.y + br.y) / 2);
          break;
        }
        case Mode.Room: {
          ctx.fillText(getText(loc.room.help), (ul.x + br.x) / 2, (ul.y + br.y) / 2);
          break;
        }
        case Mode.Furniture: {
          ctx.fillText(getText(loc.furniture.help), (ul.x + br.x) / 2, (ul.y + br.y) / 2);
          break;
        }
        case Mode.Presentation: {
          ctx.fillText(getText(loc.presentation.help), (ul.x + br.x) / 2, (ul.y + br.y) / 2);
          break;
        }
      }
      ctx.stroke();

      {// find help
        const helpRect = (document.getElementById("helpOpen") as HTMLButtonElement).getBoundingClientRect();
        const helpAnchor = proj.to({ x: helpRect.x, y: helpRect.y + helpRect.height / 2 });

        ctx.beginPath();
        setFontSize(30, false);
        ctx.fillStyle = "green";
        ctx.textAlign = "right";
        ctx.textBaseline = "middle";
        ctx.fillText(getText(loc.help.findHelp), helpAnchor.x, helpAnchor.y);
        ctx.stroke();
      }

      {// navigation help
        const navRect = (document.getElementById("navLeft") as HTMLButtonElement).getBoundingClientRect();
        const navAnchor = proj.to({ x: navRect.x, y: navRect.y + navRect.height / 2 });

        ctx.beginPath();
        setFontSize(20, false);
        ctx.fillStyle = "blue";
        ctx.textAlign = "right";
        ctx.textBaseline = "middle";
        ctx.fillText(getText(loc.help.findNav), navAnchor.x, navAnchor.y);
        ctx.stroke();
      }

      {// remove help
        const a = proj.to({ x: canvas.width - settings.deleteDim.w, y: 0 });
        const d = proj.to({ x: canvas.width, y: settings.deleteDim.h });

        const w = d.x - a.x;
        const h = d.y - a.y;

        ctx.beginPath();
        ctx.fillStyle = "red";
        setFontSize(20, false);
        ctx.textAlign = "right";
        ctx.textBaseline = "top";

        switch (settings.mode) {
          case Mode.Floorplan:
            break;
          case Mode.Room:
            ctx.fillText(getText(loc.room.removeHelp), br.x - w, ul.y + h);
            break;
          case Mode.Furniture:
            ctx.fillText(getText(loc.furniture.removeHelp), br.x - w, ul.y + h);
            break;
          case Mode.Presentation:
            break;
        }
        ctx.stroke();
      }
      restoreDefaultContext();
    }

    function drawLabel(label: Rectangle) {
      ctx.save();

      const c = label.center();
      const maxDim = label.getMaxDim();

      ctx.translate(c.x, c.y);
      ctx.rotate(toRad(label.angle));

      ctx.fillStyle = label.remove ? "red" : "lightgray";
      ctx.strokeStyle = label.remove ? "red" : "lightgray";

      setFontSize(maxDim.h);
      ctx.textBaseline = "middle";

      ctx.fillText(label.name, 0, 0);

      const rotateSize = label.getRotateSize();
      if (settings.mode === Mode.Room) {
        ctx.beginPath();
        ctx.arc(
          -maxDim.w / 2 + rotateSize / 2,
          -maxDim.h / 2 + rotateSize / 2,
          rotateSize / 2,
          0,
          2 * Math.PI
        );
        ctx.stroke();
      }

      ctx.restore();
    }

    function drawScale() {
      const lhs = projection.to({ x: 0, y: 0 });
      const rhs = projection.to({ x: canvas.width, y: 0 });
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
      ctx.beginPath();

      setFontSize(15, false);

      let i = 0;
      for (; i < scaleWidth; i += range) {
        ctx.moveTo((-projection.p.x + 20) / projection.scale + i, (-projection.p.y + 17) / projection.scale);
        ctx.lineTo((-projection.p.x + 20) / projection.scale + i, (-projection.p.y + 27) / projection.scale);
        if (i % (10 * range) === 0 || Math.floor(scaleWidth / range) < 10) {
          ctx.fillText((i / units) + unit,
            (-projection.p.x + 20) / projection.scale + i,
            (-projection.p.y + 15) / projection.scale,
            Math.floor(scaleWidth / range) < 10 ? range : scaleWidth / 2);
        }
      }

      ctx.moveTo((-projection.p.x + 20) / projection.scale, (-projection.p.y + 22) / projection.scale);
      ctx.lineTo((-projection.p.x + 20) / projection.scale + i - range, (-projection.p.y + 22) / projection.scale);

      ctx.stroke();
      restoreDefaultContext();
    }

    function drawDeletionField() {
      // only display garbage bin if needed
      if (settings.mode === Mode.Presentation) {
        return;
      }

      const a = projection.to({ x: canvas.width - settings.deleteDim.w, y: 0 });
      const d = projection.to({ x: canvas.width, y: settings.deleteDim.h });

      ctx.lineJoin = "round";
      ctx.strokeStyle = "red";

      ctx.beginPath();
      ctx.rect(a.x, a.y, d.x - a.x, d.y - a.y);
      ctx.stroke();

      const w = d.x - a.x;
      const h = d.y - a.y;

      // body
      ctx.beginPath();
      ctx.moveTo(a.x + .2 * w, a.y + .3 * h);
      ctx.lineTo(a.x + .25 * w, a.y + .93 * h);
      ctx.lineTo(a.x + .75 * w, a.y + .93 * h);
      ctx.lineTo(a.x + .8 * w, a.y + .3 * h);
      ctx.closePath();
      ctx.stroke();

      // stripes
      for (const i of [.375, .5, .625]) {
        ctx.beginPath();
        ctx.rect(a.x + (i - .03) * w, a.y + .38 * h, .06 * w, .47 * h);
        ctx.stroke();
      }

      if (!settings.isRemove) {
        // head
        ctx.beginPath();
        ctx.rect(a.x + .15 * w, a.y + .15 * h, .7 * w, .1 * h);
        ctx.stroke();

        // handle
        ctx.beginPath();
        ctx.rect(a.x + .4 * w, a.y + .07 * h, .2 * w, .06 * h);
        ctx.stroke();
      }
      restoreDefaultContext();
    }

    function drawDistanceToNextWall(center: Point, border: Point) {
      const intersectionPoint = graph.nextEdgeToSegment(center, border);
      if (intersectionPoint !== null) {
        ctx.beginPath();
        ctx.moveTo(border.x, border.y);
        ctx.lineTo(intersectionPoint.x, intersectionPoint.y);
        ctx.stroke();

        const dist = distance(border, intersectionPoint);

        ctx.save();

        ctx.translate((border.x + intersectionPoint.x) / 2, (border.y + intersectionPoint.y) / 2);
        const angle = Math.atan2(border.y - intersectionPoint.y, border.x - intersectionPoint.x);

        ctx.rotate(angle < -Math.PI / 2 || angle > Math.PI / 2 ? angle + Math.PI : angle);

        ctx.beginPath();
        drawDistance(0, 0, dist, 0, "mm");
        ctx.stroke();

        ctx.restore();
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

      if (settings.mode !== Mode.Floorplan) {
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
        const b = proj.to({ x: canvas.width, y: canvas.height });
        const zoomValue = Math.min((b.x - a.x) / ((maxX - minX) * 1.2), (b.y - a.y) / ((maxY - minY) * 1.2));
        zoom(proj.p, zoomValue);
      }

      {// fix view of projection to middle
        const a = proj.to({ x: 0, y: 0 });
        const b = proj.to({ x: canvas.width, y: canvas.height });

        const newP = proj.from({ x: (minX + maxX) / 2 - (b.x - a.x) / 2, y: (minY + maxY) / 2 - (b.y - a.y) / 2 });
        proj.p = { x: proj.p.x - newP.x, y: proj.p.y - newP.y };
      }
      drawMain();
    }

    function moveProjection(direction: Direction) {
      const proj = getCurrProjection();

      switch (direction) {
        case Direction.Up: {
          proj.p.y -= canvas.height / 20;
          break;
        }
        case Direction.Down: {
          proj.p.y += canvas.height / 20;
          break;
        }
        case Direction.Left: {
          proj.p.x -= canvas.width / 20;
          break;
        }
        case Direction.Right: {
          proj.p.x += canvas.width / 20;
          break;
        }
      }
      drawMain();
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





    // utils
    function resetElements(type: string) {
      const tabContents = document.getElementsByClassName("tabContent " + type);
      for (const tabContent of tabContents) {
        (tabContent as HTMLDivElement).style.display = "none";
      }

      const tabLinks = document.getElementsByClassName("tabLinks " + type);
      for (const tabLink of tabLinks) {
        tabLink.className = tabLink.className.replace(" active", "");
      }
    }

// room or furniture mode
    document.getElementById("floorplanButton")!.addEventListener("click", changeToFloorplanMode);
    document.getElementById("roomButton")!.addEventListener("click", changeToRoomMode);
    document.getElementById("furnitureButton")!.addEventListener("click", changeToFurnitureMode);
    document.getElementById("presentationButton")!.addEventListener("click", changeToPresentationMode);

    function clickFloorplan() { document.getElementById("floorplanButton")!.click(); }
    function clickRoom() { document.getElementById("roomButton")!.click(); }
    function clickFurniture() { document.getElementById("furnitureButton")!.click(); }
    function clickDisplay() { document.getElementById("presentationButton")!.click(); }

    function changeMode(e: MouseEvent, mode: Mode) {
      resetElements("mode");

      settings.mode = mode;

      switch (mode) {
        case Mode.Floorplan: {
          document.getElementById("floorplanTab")!.style.display = "block";
          break;
        }
        case Mode.Room: {
          document.getElementById("roomTab")!.style.display = "block";
          break;
        }
        case Mode.Furniture: {
          document.getElementById("furnitureTab")!.style.display = "block";
          break;
        }
        case Mode.Presentation: {
          document.getElementById("presentationTab")!.style.display = "block";
          break;
        }
      }
      (e.currentTarget as HTMLButtonElement).className += " active";

      drawMain();
    }

    function changeToFloorplanMode(e: MouseEvent) { changeMode(e, Mode.Floorplan); }
    function changeToRoomMode(e: MouseEvent) { changeMode(e, Mode.Room); }
    function changeToFurnitureMode(e: MouseEvent) { changeMode(e, Mode.Furniture); }
    function changeToPresentationMode(e: MouseEvent) { changeMode(e, Mode.Presentation); }

// openable type tabs

    document.getElementById("leftOpenableButton")!.addEventListener("click", changeToLeftOpenableType);
    document.getElementById("rightOpenableButton")!.addEventListener("click", changeToRightOpenableType);
    document.getElementById("doubleOpenableButton")!.addEventListener("click", changeToDoubleOpenableType);

    function changeOpenableType(e: MouseEvent, type: OpenableType) {
      resetElements("openableType");

      settings.openableType = type;

      (e.currentTarget as HTMLButtonElement).className += " active";

      drawMain();
    }

    function changeToLeftOpenableType(e: MouseEvent) { changeOpenableType(e, OpenableType.Left); }
    function changeToRightOpenableType(e: MouseEvent) { changeOpenableType(e, OpenableType.Right); }
    function changeToDoubleOpenableType(e: MouseEvent) { changeOpenableType(e, OpenableType.Double); }

// furniture type tabs
    document.getElementById("rectangleButton")!.addEventListener("click", changeToRectangleType);
    document.getElementById("circleButton")!.addEventListener("click", changeToCircleType);
    document.getElementById("LButton")!.addEventListener("click", changeToLType);
    document.getElementById("UButton")!.addEventListener("click", changeToUType);

    function changeFurnitureType(e: MouseEvent, type: FurnitureType) {
      resetElements("furnitureType");

      settings.type = type;

      switch (type) {
        case FurnitureType.Rectangle:
          document.getElementById("rectangleTab")!.style.display = "contents";
          break;
        case FurnitureType.Circle:
          document.getElementById("circleTab")!.style.display = "contents";
          break;
        case FurnitureType.L:
          document.getElementById("LTab")!.style.display = "contents";
          break;
        case FurnitureType.U:
          document.getElementById("UTab")!.style.display = "contents";
          break;
      }

      (e.currentTarget as HTMLBRElement).className += " active";

      drawMain();
    }

    function changeToRectangleType(e: MouseEvent) { changeFurnitureType(e, FurnitureType.Rectangle); }
    function changeToCircleType(e: MouseEvent) { changeFurnitureType(e, FurnitureType.Circle); }
    function changeToLType(e: MouseEvent) { changeFurnitureType(e, FurnitureType.L); }
    function changeToUType(e: MouseEvent) { changeFurnitureType(e, FurnitureType.U); }

    function validNumericInput(...values: number[]) {
      for (const value of values) {
        if (isNaN(value) || value < 1) {
          return false;
        }
      }
      return true;
    }

// Floorplan Mode

    document.getElementById("distanceInput")!.addEventListener("input", (e) => {
      const dist = (e.target as HTMLInputElement).valueAsNumber;

      if (!validNumericInput(dist)) {
        alert(getText(loc.floorplan.option.inputError));
        return;
      }
      floorplanImage.distance = dist;

      drawMain();
    });

    document.getElementById("loadFloorplan")!.addEventListener("change", (e: Event) => {
      const files = (e.target as HTMLInputElement).files;
      const file = files?.item(0);

      if (!file) {
        return;
      }

      let img = new Image();
      img.onload = (onLoadResult) => {
        const image = onLoadResult.target as HTMLImageElement;
        floorplanImage.image = image;
        drawMain();
      };
      img.onerror = () => {
        alert(getText(loc.fileIO.errorAtFile) + " " + file.name + ".");
      };
      img.src = URL.createObjectURL(file);
    });

    document.getElementById("clearFloorplanButton")!.addEventListener("click", () => {
      floorplanImage.reset();

      drawMain();
    });

// Room Mode

    document.getElementById("addLabelButton")!.addEventListener("click", (e) => {
      e.preventDefault();
      const labelName = (document.getElementById("labelNameInput") as HTMLInputElement).value;
      const labelHeight = (document.getElementById("labelHeightInput") as HTMLInputElement).valueAsNumber;

      if (!validNumericInput(labelHeight) || !labelName) {
        alert(getText(loc.room.label.inputError));
        return;
      }
      const start = projection.to({ x: 10, y: 100 });
      setFontSize(labelHeight);
      labels.push(new Rectangle(labelName, MovableType.Rectangle, start.x, start.y, ctx.measureText(labelName).width, labelHeight));
      console.log("add Label:", labelName);
      drawMain();
    });

    document.getElementById("addOpenableButton")!.addEventListener("click", (e) => {
      e.preventDefault();
      const openableWidth = (document.getElementById("openableWidthInput") as HTMLInputElement).valueAsNumber;

      if (!validNumericInput(openableWidth)) {
        alert(getText(loc.room.openable.inputError));
        return;
      }

      const start = projection.to({ x: 10, y: 100 });
      openables.push(new Openable(settings.openableType, start.x, start.y, openableWidth, 180));
      console.log("add Openable:", settings.openableType);
      drawMain();
    });

// Furniture Mode

    document.getElementById("addFurnitureButton")!.addEventListener("click", (e) => {
      e.preventDefault();

      const furName = (document.getElementById("nameInput") as HTMLInputElement).value;

      switch (settings.type) {
        case FurnitureType.Rectangle: {
          const furWidth = (document.getElementById("widthInput") as HTMLInputElement).valueAsNumber;
          const furHeight = (document.getElementById("heightInput") as HTMLInputElement).valueAsNumber;
          if (!validNumericInput(furWidth, furHeight)) {
            alert(getText(loc.furniture.add.inputError));
            return;
          }
          const start = projection.to({ x: 10, y: 100 });
          furniture.push(new Rectangle(furName, MovableType.Rectangle, start.x, start.y, furWidth, furHeight));
          break;
        }
        case FurnitureType.Circle: {
          const circleWidth = (document.getElementById("circleWidthInput") as HTMLInputElement).valueAsNumber;
          const circleHeight = (document.getElementById("circleHeightInput") as HTMLInputElement).valueAsNumber;
          if (!validNumericInput(circleWidth, circleHeight)) {
            alert(getText(loc.furniture.add.inputError));
            return;
          }
          const start = projection.to({ x: 10, y: 100 });
          furniture.push(circleWidth === circleHeight ?
            new Circle(furName, start.x + circleWidth / 2, start.y + circleWidth / 2, circleWidth / 2) :
            new Ellipse(furName, start.x + circleWidth / 2, start.y + circleHeight / 2, circleWidth / 2, circleHeight / 2));
          break;
        }
        case FurnitureType.L: {
          const LWidth1 = (document.getElementById("LWidthInput1") as HTMLInputElement).valueAsNumber;
          const LHeight1 = (document.getElementById("LHeightInput1") as HTMLInputElement).valueAsNumber;

          const LWidth2 = (document.getElementById("LWidthInput2") as HTMLInputElement).valueAsNumber;
          const LHeight2 = (document.getElementById("LHeightInput2") as HTMLInputElement).valueAsNumber;
          if (!validNumericInput(LWidth1, LHeight1, LWidth2, LHeight2)) {
            alert(getText(loc.furniture.add.inputError));
            return;
          }
          const start = projection.to({ x: 10, y: 100 });
          let newRect = new Rectangle(furName, MovableType.L, start.x, start.y, LWidth1, LHeight1);
          newRect.dims.push({ w: LWidth2, h: LHeight2 });
          furniture.push(newRect);
          break;
        }
        case FurnitureType.U: {
          const UWidth1 = (document.getElementById("UWidthInput1") as HTMLInputElement).valueAsNumber;
          const UHeight1 = (document.getElementById("UHeightInput1") as HTMLInputElement).valueAsNumber;

          const UWidth2 = (document.getElementById("UWidthInput2") as HTMLInputElement).valueAsNumber;
          const UHeight2 = (document.getElementById("UHeightInput2") as HTMLInputElement).valueAsNumber;

          const UWidth3 = (document.getElementById("UWidthInput3") as HTMLInputElement).valueAsNumber;
          const UHeight3 = (document.getElementById("UHeightInput3") as HTMLInputElement).valueAsNumber;

          if (!validNumericInput(UWidth1, UHeight1, UWidth2, UHeight2, UWidth3, UHeight3)) {
            alert(getText(loc.furniture.add.inputError));
            return;
          }
          const start = projection.to({ x: 10, y: 100 });
          let newRect = new Rectangle(furName, MovableType.U, start.x, start.y, UWidth1, UHeight1);
          newRect.dims.push({ w: UWidth2, h: UHeight2 });
          newRect.dims.push({ w: UWidth3, h: UHeight3 });
          furniture.push(newRect);
          break;
        }
      }

      console.log("add %s: %s", settings.type, furName);
      drawMain();
    });

    window.addEventListener("beforeunload", (e) => {
      if (state !== createState()) {
        e.preventDefault();
        return (e.returnValue = "");
      }
      return true;
    });

    document.getElementById("edgeLabelCheckbox")!.addEventListener("change", (e) => {
      settings.showEdgeLabels = (e.target as HTMLInputElement).checked;

      drawMain();
    });

    document.getElementById("roomSizeCheckbox")!.addEventListener("change", (e) => {
      settings.showRoomSize = (e.target as HTMLInputElement).checked;

      drawMain();
    });





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

    const graph: Graph = {
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
          if (dist < settings.nodeExtendSize && (minDist === null || dist < minDist)) {
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
            if (dist < settings.nodeExtendSize && (minDist === null || dist < minDist)) {
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
          if (dist.x < settings.nodeExtendSize && (minDist.x === null || dist.x < minDist.x) && dist.x <= dist.y) {
            minDist.x = dist.x;
            if (change) {
              node.delta.x = projection.from(other.p).x;
              if (!extendNode) {
                node.p.x = other.p.x;
              }
            }
            node.snap.x = other.id;
          } else if (dist.y < settings.nodeExtendSize && (minDist.y === null || dist.y < minDist.y) && dist.y < dist.x) {
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
            if (dist <= settings.nodeTransSize) {
              selected = true;
              node.translate = true;
              node.delta.x = e.x;
              node.delta.y = e.y;
            } else if (dist <= settings.nodeExtendSize) {
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
        if (settings.showRoomSize) {
          this.drawFaces();
        }

        this.drawEdges();

        if (settings.mode === Mode.Room) {
          this.drawNodes();

          this.drawExtend();
        }
      },
      drawFaces: function () {
        const faces = this.getFaces();

        ctx.fillStyle = "lightgray";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

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

          ctx.fillText(area.toFixed(1) + "m²", mid.x, mid.y);
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
              ctx.fillStyle = "red";
              ctx.strokeStyle = "red";
            }

            ctx.beginPath();
            ctx.moveTo(node1.p.x, node1.p.y);

            // uncomment for gaps in windows (sort openables by pos before)
            // const dist = distance(node1.p, node2.p);
            // for (const openable of edge.snapOpenables) {
            //     const relWidth = openable.dim.w / dist;
            //     const t1 = Math.max(0, openable.snap.pos - relWidth / 2);
            //     const t2 = Math.min(1, openable.snap.pos + relWidth / 2);

            //     ctx.lineTo(node1.p.x + t1 * (node2.p.x - node1.p.x), node1.p.y + t1 * (node2.p.y - node1.p.y));
            //     ctx.moveTo(node1.p.x + t2 * (node2.p.x - node1.p.x), node1.p.y + t2 * (node2.p.y - node1.p.y));
            // }

            ctx.lineTo(node2.p.x, node2.p.y);
            ctx.stroke();

            if ((!node1.remove && node1.translate) || (!node2.remove && node2.translate)) {
              const node = node1.translate ? node2 : node1;
              const other = node1.translate ? node1 : node2;
              const dist = distance(node1.p, node2.p);
              const ul = { x: -projection.p.x / projection.scale, y: -projection.p.y / projection.scale };
              const br = projection.to({ x: canvas.width, y: canvas.height });

              const nodeScaling = settings.nodeTransSize / dist;
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

              ctx.save();
              const b = {
                x: otherBorder.x * (1 - borderScaling) + nodeBorder.x * borderScaling,
                y: otherBorder.y * (1 - borderScaling) + nodeBorder.y * borderScaling,
              };
              const c = {
                x: otherBorder.x * (1 - scaling) + nodeBorder.x * scaling,
                y: otherBorder.y * (1 - scaling) + nodeBorder.y * scaling,
              };
              ctx.translate(c.x, c.y);
              const angle = Math.atan2(node.p.y - other.p.y, node.p.x - other.p.x);

              ctx.rotate(angle < -Math.PI / 2 || angle > Math.PI / 2 ? angle + Math.PI : angle);
              ctx.fillText(dist.toFixed(0) + "mm", 0, 0, distance(otherBorder, b));

              ctx.restore();
            } else if (settings.showEdgeLabels) {
              const dist = distance(node1.p, node2.p);

              setFontSize(18, false);

              ctx.save();
              const c = {
                x: (node1.p.x + node2.p.x) / 2,
                y: (node1.p.y + node2.p.y) / 2,
              };
              ctx.translate(c.x, c.y);
              const angle = Math.atan2(node2.p.y - node1.p.y, node2.p.x - node1.p.x);

              ctx.rotate(angle < -Math.PI / 2 || angle > Math.PI / 2 ? angle + Math.PI : angle);
              drawDistance(0, 0, dist, 1, "m", 1000);
              ctx.restore();
            }

            restoreDefaultContext();
          }
        }
      },
      drawNodes: function () {
        for (const node of Object.values(this.nodes)) {
          if (node.remove && node.translate) {
            ctx.fillStyle = "red";
            ctx.strokeStyle = "red";
          }

          // stroke
          ctx.beginPath();
          ctx.arc(node.p.x, node.p.y, settings.nodeExtendSize, 0, 2 * Math.PI);
          ctx.stroke();

          // fill
          ctx.beginPath();
          ctx.arc(node.p.x, node.p.y, settings.nodeTransSize, 0, 2 * Math.PI);
          ctx.fill();

          restoreDefaultContext();
        }
      },
      drawExtend: function () {
        for (const node of Object.values(this.nodes)) {
          if (node.extend) {
            const newPos = projection.to(node.delta);
            if (node.remove) {
              ctx.fillStyle = "red";
              ctx.strokeStyle = "red";
            } else {
              ctx.fillStyle = "gray";
              ctx.strokeStyle = "gray";
            }
            // stroke
            ctx.beginPath();
            ctx.arc(newPos.x, newPos.y, settings.nodeExtendSize, 0, 2 * Math.PI);
            ctx.stroke();

            // fill
            ctx.beginPath();
            ctx.arc(newPos.x, newPos.y, settings.nodeTransSize, 0, 2 * Math.PI);
            ctx.fill();

            // line
            ctx.moveTo(node.p.x, node.p.y);
            ctx.lineTo(newPos.x, newPos.y);
            ctx.stroke();

            if (!node.remove) {
              setFontSize(20, false);

              const dist = distance(node.p, newPos);
              ctx.save();
              const c = {
                x: (node.p.x + newPos.x) / 2,
                y: (node.p.y + newPos.y) / 2,
              };
              ctx.translate(c.x, c.y);
              const angle = Math.atan2(node.p.y - newPos.y, node.p.x - newPos.x);

              ctx.rotate(angle < -Math.PI / 2 || angle > Math.PI / 2 ? angle + Math.PI : angle);
              ctx.fillText(dist.toFixed(0) + "mm", 0, 0, dist - 2 * settings.nodeTransSize);

              ctx.restore();
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
        if (this.image === null || settings.mode !== Mode.Floorplan) {
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
        if (this.image === null || settings.mode !== Mode.Floorplan) {
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
        return settings.mode === Mode.Floorplan ? 1 : this.distance / distance(this.node1.p, this.node2.p);
      },
      draw: function () {
        if (this.image !== null) {
          const currentScale = this.getCurrentScale();
          ctx.drawImage(this.image, 0, 0, this.image.width * currentScale, this.image.height * currentScale);
          if (settings.mode === Mode.Floorplan) {
            this.drawEdge();
            this.drawNodes();
          }
        }
      },
      drawEdge: function () {
        ctx.beginPath();
        ctx.moveTo(this.node1.p.x, this.node1.p.y);
        ctx.lineTo(this.node2.p.x, this.node2.p.y);
        ctx.stroke();

        setFontSize(20, false);

        ctx.save();
        const c = {
          x: (this.node1.p.x + this.node2.p.x) / 2,
          y: (this.node1.p.y + this.node2.p.y) / 2,
        };
        ctx.translate(c.x, c.y);
        const angle = Math.atan2(this.node2.p.y - this.node1.p.y, this.node2.p.x - this.node1.p.x);

        ctx.rotate(angle < -Math.PI / 2 || angle > Math.PI / 2 ? angle + Math.PI : angle);
        ctx.fillText(String(this.distance) + "mm", 0, 0, distance(this.node1.p, this.node2.p));

        ctx.restore();
      },
      drawNodes: function () {
        const angle = Math.atan2(this.node1.p.y - this.node2.p.y, this.node1.p.x - this.node2.p.x);

        ctx.beginPath();
        ctx.arc(this.node1.p.x, this.node1.p.y, this.nodeSize, angle - Math.PI / 2, angle + Math.PI / 2);
        ctx.fill();

        ctx.beginPath();
        ctx.arc(this.node2.p.x, this.node2.p.y, this.nodeSize, angle + Math.PI / 2, angle - Math.PI / 2);
        ctx.fill();

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
    document.getElementById("nodeTransSlider")!.addEventListener("input", setNodeTransSize);
    document.getElementById("nodeExtendSlider")!.addEventListener("input", setNodeExtendSize);

    function initNodeSize() {
      const transSlider: HTMLInputElement = document.getElementById("nodeTransSlider") as HTMLInputElement;
      const extendSlider: HTMLInputElement = document.getElementById("nodeExtendSlider") as HTMLInputElement;

      settings.nodeTransSize = Number(transSlider.value);
      settings.nodeExtendSize = Number(extendSlider.value);

      setNodeTransSize();
      setNodeExtendSize();
    }

    function setNodeTransSize() {
      const transSlider: HTMLInputElement = document.getElementById("nodeTransSlider") as HTMLInputElement;
      const extendSlider: HTMLInputElement = document.getElementById("nodeExtendSlider") as HTMLInputElement;

      settings.nodeTransSize = Number(transSlider.value);
      settings.nodeExtendSize = Math.max(settings.nodeExtendSize, settings.nodeTransSize);

      extendSlider.value = String(settings.nodeExtendSize);

      drawMain();
    }

    function setNodeExtendSize() {
      const transSlider: HTMLInputElement = document.getElementById("nodeTransSlider") as HTMLInputElement;
      const extendSlider: HTMLInputElement = document.getElementById("nodeExtendSlider") as HTMLInputElement;

      settings.nodeExtendSize = Number(extendSlider.value);
      settings.nodeTransSize = Math.min(settings.nodeExtendSize, settings.nodeTransSize);

      transSlider.value = String(settings.nodeTransSize);

      drawMain();
    }

    function resetOptions() {
      settings.showEdgeLabels = false;
      (document.getElementById("edgeLabelCheckbox") as HTMLInputElement).checked = false;

      settings.showRoomSize = false;
      (document.getElementById("roomSizeCheckbox") as HTMLInputElement).checked = false;
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

    function addAttr(elem: HTMLElement, attr: { [key: string]: string }): HTMLElement {
      for (const [key, value] of Object.entries(attr)) {
        elem.setAttribute(key, value);
      }
      return elem;
    }

    function setButtonContent() {
      // floorplan
      document.getElementById("floorplanButton")!.textContent = getText(loc.floorplan.category);

      document.getElementById("distanceInputLabel")!.textContent = getText(loc.floorplan.option.distance);
      document.getElementById("loadFloorplanButton")!.textContent = getText(loc.floorplan.loadButton);
      document.getElementById("clearFloorplanButton")!.textContent = getText(loc.floorplan.clearButton);

      // room
      document.getElementById("roomButton")!.textContent = getText(loc.room.category);

      // corner node
      document.getElementById("cornerHead")!.textContent = getText(loc.room.corner.head);
      document.getElementById("nodeTransSliderLabel")!.textContent = getText(loc.room.corner.center);
      document.getElementById("nodeExtendSliderLabel")!.textContent = getText(loc.room.corner.ring);

      // label
      document.getElementById("labelHead")!.textContent = getText(loc.room.label.head);
      document.getElementById("labelNameInputLabel")!.textContent = getText(loc.room.label.name);
      (document.getElementById("labelNameInput") as HTMLInputElement).value = getText(loc.room.label.defaultName);
      document.getElementById("labelHeightInputLabel")!.textContent = getText(loc.room.label.height);
      document.getElementById("addLabelButton")!.textContent = getText(loc.room.label.add);

      // openable
      document.getElementById("openableHead")!.textContent = getText(loc.room.openable.head);
      document.getElementById("openableWidthInputLabel")!.textContent = getText(loc.room.openable.width);

      document.getElementById("openableTypeInputLabel")!.textContent = getText(loc.room.openable.type);

      document.getElementById("addOpenableButton")!.textContent = getText(loc.room.openable.add);

      // furniture
      document.getElementById("furnitureButton")!.textContent = getText(loc.furniture.category);

      document.getElementById("nameInputLabel")!.textContent = getText(loc.furniture.add.name);
      (document.getElementById("nameInput") as HTMLInputElement).value = getText(loc.furniture.add.defaultName);

      document.getElementById("typeInputLabel")!.textContent = getText(loc.furniture.add.type);

      document.getElementById("widthInputLabel")!.textContent = getText(loc.furniture.add.width);
      document.getElementById("heightInputLabel")!.textContent = getText(loc.furniture.add.height);

      document.getElementById("circleWidthInputLabel")!.textContent = getText(loc.furniture.add.width);
      document.getElementById("circleHeightInputLabel")!.textContent = getText(loc.furniture.add.height);

      document.getElementById("LWidthInputLabel")!.textContent = getText(loc.furniture.add.width);
      document.getElementById("LHeightInputLabel")!.textContent = getText(loc.furniture.add.height);

      document.getElementById("UWidthInputLabel")!.textContent = getText(loc.furniture.add.width);
      document.getElementById("UHeightInputLabel")!.textContent = getText(loc.furniture.add.height);

      document.getElementById("addFurnitureButton")!.textContent = getText(loc.furniture.add.add);

      // presentation
      document.getElementById("presentationButton")!.textContent = getText(loc.presentation.category);

      document.getElementById("presentationOptionsHead")!.textContent = getText(loc.presentation.option.head);
      document.getElementById("edgeLabelCheckboxLabel")!.textContent = getText(loc.presentation.option.showEdgeLabel);
      document.getElementById("roomSizeCheckboxLabel")!.textContent = getText(loc.presentation.option.roomSizeLabel);

      // util
      document.getElementById("saveButton")!.textContent = getText(loc.fileIO.saveButton);
      document.getElementById("loadButton")!.textContent = getText(loc.fileIO.loadButton);
      document.getElementById("exportButton")!.textContent = getText(loc.fileIO.exportButton);
      document.getElementById("printButton")!.textContent = getText(loc.fileIO.printButton);
      document.getElementById("helpOpen")!.textContent = getText(loc.help.helpOpen);

      // help
      const helpText = document.getElementById("helpText") as HTMLDivElement;

      addElem(helpText, "h2", loc.help.welcome);
      addElem(helpText, "p", loc.help.intro);

      addElem(helpText, "p", loc.help.explanationMode);
      const modeList: HTMLUListElement = addElem(helpText, "ul") as HTMLUListElement;
      addAttr(addListEntry(modeList, "li", loc.help.introFloorplan, loc.help.shortFloorplan), { "class": "helpLink" }).addEventListener("click", clickFloorplan);
      addAttr(addListEntry(modeList, "li", loc.help.introRoom, loc.help.shortRoom), { "class": "helpLink" }).addEventListener("click", clickRoom);
      addAttr(addListEntry(modeList, "li", loc.help.introFurniture, loc.help.shortFurniture), { "class": "helpLink" }).addEventListener("click", clickFurniture);
      addAttr(addListEntry(modeList, "li", loc.help.introDisplay, loc.help.shortDisplay), { "class": "helpLink" }).addEventListener("click", clickDisplay);

      addElem(helpText, "p", loc.help.explanationUtil);
      const utilList: HTMLUListElement = addElem(helpText, "ul") as HTMLUListElement;
      addListEntry(utilList, "li", loc.fileIO.saveButton, loc.fileIO.saveShort);
      addListEntry(utilList, "li", loc.fileIO.loadButton, loc.fileIO.loadShort);
      addListEntry(utilList, "li", loc.fileIO.exportButton, loc.fileIO.exportShort);
      addListEntry(utilList, "li", loc.fileIO.printButton, loc.fileIO.printShort);

      addAttr(addElem(helpText, "h3", loc.help.introFloorplan), { "class": "helpLink" }).addEventListener("click", clickFloorplan);
      addElem(helpText, "p", loc.help.explanationFloorplan);

      addAttr(addElem(helpText, "h3", loc.help.introRoom), { "class": "helpLink" }).addEventListener("click", clickRoom);
      addElem(helpText, "p", loc.help.explanationRoom);

      addAttr(addElem(helpText, "h3", loc.help.introFurniture), { "class": "helpLink" }).addEventListener("click", clickFurniture);
      addElem(helpText, "p", loc.help.explanationFurniture);

      addAttr(addElem(helpText, "h3", loc.help.introDisplay), { "class": "helpLink" }).addEventListener("click", clickDisplay);
      addElem(helpText, "p", loc.help.explanationDisplay);

      addElem(addElem(helpText, "p"), "b", loc.help.creator);

      document.getElementById("helpClose")!.textContent = getText(loc.help.helpClose);
    }

    window.addEventListener("resize", setSize);

    function setSize() {
      canvas.width = window.innerWidth * 0.8;
      canvas.height = window.innerHeight;

      drawMain();
    }

    function welcome() {
      let message = "";
      message += "\n _____                              _ _____                      ______ _                        _                                            ";
      message += "\n|  __ \\             /\\             | |  __ \\                    |  ____| |                      | |                                        ";
      message += "\n| |__) |__ _ __    /  \\   _ __   __| | |__) |_ _ _ __   ___ _ __| |__  | | ___   ___  _ __ _ __ | | __ _ _ __  _ __   ___ _ __               ";
      message += "\n|  ___/ _ \\ '_ \\  / /\\ \\ | '_ \\ / _` |  ___/ _` | '_ \\ / _ \\ '__|  __| | |/ _ \\ / _ \\| '__| '_ \\| |/ _` | '_ \\| '_ \\ / _ \\ '__|  ";
      message += "\n| |  |  __/ | | |/ ____ \\| | | | (_| | |  | (_| | |_) |  __/ |  | |    | | (_) | (_) | |  | |_) | | (_| | | | | | | |  __/ |                 ";
      message += "\n|_|   \\___|_| |_/_/    \\_\\_| |_|\\__,_|_|   \\__,_| .__/ \\___|_|  |_|    |_|\\___/ \\___/|_|  | .__/|_|\\__,_|_| |_|_| |_|\\___|_|        ";
      message += "\n                                                | |                                       | |                                                 ";
      message += "\n                                                |_|                                       |_|                                                 ";
      message += "\n";
      message += "\nReport issues: https://github.com/karldaeubel/PenAndPaperFloorplanner/issues/new";
      message += "\nFork:          https://github.com/karldaeubel/PenAndPaperFloorplanner/fork";
      message += "\n";

      console.log(message);
    }

    init();

    function init() {
      welcome();

      if (navigator.language) {
        settings.language = navigator.language.substring(0, 2);
      }
      console.log("language:", settings.language);

      document.getElementById("distanceInput")!.dispatchEvent(new Event("input"));

      clickRoom();

      document.getElementById("leftOpenableButton")!.click();

      document.getElementById("circleButton")!.click();

      initNodeSize();

      setButtonContent();

      setState();

      setSize();

      resetOptions();
    }




    canvas.addEventListener("mousedown", mouseDown);
    canvas.addEventListener("mousemove", mouseMove);
    document.addEventListener("mouseup", mouseUp);
    canvas.addEventListener("dblclick", mouseDoubleClick);
    canvas.addEventListener("wheel", zoomEvent);

    function touchToCoordinates(t: Touch): Point {
      return { x: t.clientX, y: t.clientY };
    }

    let lastClick: number = 0;
    let lastClickId: optionalNumber = null;

    let oldDist: optionalNumber = null;

    canvas.addEventListener("touchstart", (e) => {
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

    canvas.addEventListener("touchmove", (e) => {
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
    canvas.addEventListener("touchend", (e) => {
      e.preventDefault();

      if (e.changedTouches.length > 0) {
        mouseUp(touchToCoordinates(e.changedTouches[0]!));
      }
      oldDist = null;
    });
    canvas.addEventListener("touchcancel", (e) => {
      e.preventDefault();

      if (e.changedTouches.length > 0) {
        mouseUp(touchToCoordinates(e.changedTouches[0]!));
      }
      oldDist = null;
    });

    function zoomEvent(e: WheelEvent) {
      zoom(e, e.deltaY > 0 ? 1 / settings.zoomFactor : e.deltaY < 0 ? settings.zoomFactor : null);
    }

    function zoom(p: Point, factor: optionalNumber) {
      if (factor !== null) {
        const proj = getCurrProjection();
        const newScale = proj.scale * factor;
        if (newScale > settings.minZoom && newScale < settings.maxZoom) {
          proj.scale = newScale;
          proj.p.x = p.x - (p.x - proj.p.x) * factor;
          proj.p.y = p.y - (p.y - proj.p.y) * factor;

          drawMain();
        }
      }
    }

    function mouseDoubleClick(e: Point) {
      if (settings.mode === Mode.Furniture) {
        // add furniture double click
      } else if (settings.mode === Mode.Room) {
        graph.addNode(toNextNumber(projection.to(e)));
      }

      drawMain();
    }

    function mouseDown(e: Point) {
      let selected = false;

      if (settings.mode === Mode.Floorplan) {
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
      } else if (settings.mode === Mode.Furniture) {
        for (const fur of furniture) {
          if (fur.handleClick(e)) {
            selected = true;
            break;
          }
        }
      } else if (settings.mode === Mode.Room) {
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

      if (settings.mode === Mode.Floorplan) {
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
      } else if (settings.mode === Mode.Furniture) {
        for (const fur of furniture) {
          if (fur.handleMove(e)) {
            changed = true;
          }
        }
      } else if (settings.mode === Mode.Room) {
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
      if (settings.mode === Mode.Floorplan) {
        floorplanImage.handleUnclick();
      } else if (settings.mode === Mode.Furniture) {
        mouseUpForMovables(furniture);
      } else if (settings.mode === Mode.Room) {
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

      settings.isRemove = false;

      drawMain();
    }

    function zoomToMiddle(factor: number) {
      zoom({ x: canvas.width / 2, y: canvas.height / 2 }, factor);
    }

    document.getElementById("navZoomIn")!.addEventListener("click", () => {
      zoomToMiddle(Math.pow(settings.zoomFactor, 4));
    });

    document.getElementById("navZoomOut")!.addEventListener("click", () => {
      zoomToMiddle(1 / Math.pow(settings.zoomFactor, 4));
    });

    document.getElementById("navCenter")!.addEventListener("click", () => {
      centerProjection();
    });

    document.getElementById("navUp")!.addEventListener("click", () => {
      moveProjection(Direction.Up);
    });

    document.getElementById("navRight")!.addEventListener("click", () => {
      moveProjection(Direction.Right);
    });

    document.getElementById("navDown")!.addEventListener("click", () => {
      moveProjection(Direction.Down);
    });

    document.getElementById("navLeft")!.addEventListener("click", () => {
      moveProjection(Direction.Left);
    });

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

    // function loadRemoteExample(url: string) {
    //   let gitHubExampleRequest = new XMLHttpRequest();
    //   gitHubExampleRequest.onload = readerEvent => {
    //     const target = readerEvent.currentTarget;
    //     if (target) {
    //       const content = (target as XMLHttpRequest).response;
    //       loadFloorplan(content, url);
    //
    //       centerProjection();
    //     }
    //   }
    //   gitHubExampleRequest.open("GET", url);
    //   gitHubExampleRequest.send();
    // }

    document.getElementById("loadInput")!.addEventListener("change", (e: Event) => {
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
    });

    document.getElementById("saveButton")!.addEventListener("click", () => {
      const pom = document.createElement("a");
      pom.setAttribute("href", "data:text/plain;charset=utf-8," +
        encodeURIComponent(JSON.stringify({ graph, labels, openables, furniture, floorplanImage }, null, " ")));

      pom.setAttribute("download", "house.json");

      pom.style.display = "none";
      document.body.appendChild(pom);

      pom.click();

      document.body.removeChild(pom);

      // TODO: this is too optimistic, cancel might have been selected
      setState();
    });

    document.getElementById("exportButton")!.addEventListener("click", () => {
      const pom = document.createElement("a");
      pom.setAttribute("href", canvas.toDataURL());

      pom.setAttribute("download", "house.png");

      pom.style.display = "none";
      document.body.appendChild(pom);

      pom.click();

      document.body.removeChild(pom);
    });

    document.getElementById("printButton")!.addEventListener("click", () => {
      const dataUrl = canvas.toDataURL();

      let content = "<!DOCTYPE html>";
      content += "<html>";
      content += "<head><title>PenAndPaperFloorplanner</title></head>";
      content += "<body>";
      content += "<img src=\"" + dataUrl + "\"";
      content += "</body>";
      content += "</html>";

      const printWin = window.open("", "", "width=" + screen.availWidth + ",height=" + screen.availHeight);
      if (printWin !== null) {
        printWin.document.open();
        printWin.document.write(content);

        printWin.document.addEventListener('load', function () {
          printWin.focus();
          printWin.print();
          printWin.document.close();
          printWin.close();
        }, true);
      }
    });

    document.getElementById("helpOpen")!.addEventListener("click", () => {
      const helpDialog = document.getElementById("helpDialog") as HTMLDialogElement;
      helpDialog.showModal();
    });

    document.getElementById("helpClose")!.addEventListener("click", () => {
      const helpDialog = document.getElementById("helpDialog") as HTMLDialogElement;
      helpDialog.close();
    });




    interface Localization {
      en: string,
      de: string,
    }

    function getText(element: Localization): string {
      const key = settings.language as keyof typeof element;
      return key in element ? element[key] : element.en;
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
        ctx.fillStyle = this.getFill(isDisabled, highlight);
        ctx.strokeStyle = this.getStroke(isDisabled, highlight);
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
        if (this.dim.w / 2 <= settings.furnitureRotateSize || this.dim.h / 2 <= settings.furnitureRotateSize) {
          return Math.min(this.dim.w, this.dim.h) / 2;
        }
        return settings.furnitureRotateSize;
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
            if (dist < settings.nodeExtendSize && (minDist === null || dist < minDist)) {
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
          if (!this.handleSnap([360, 270, 180, 90], Math.abs((this.angle + a + 360) % 360), settings.furnitureSnapAngle)) {
            this.angle += a;

            this.delta.x = e.x;
            this.delta.y = e.y;
          }
        }

        return changed;
      }

      draw() {
        ctx.save();

        const c = this.center();

        ctx.translate(c.x, c.y);
        ctx.rotate(toRad(this.angle));

        this.setStyle(settings.mode !== Mode.Room);

        switch (this.openableType) {
          case OpenableType.Left: {
            ctx.beginPath();
            ctx.moveTo(-this.dim.w / 2, 0);
            ctx.lineTo(-this.dim.w / 2, this.dim.w);
            ctx.stroke();

            ctx.beginPath();
            ctx.arc(-this.dim.w / 2, 0, this.dim.w, 0, Math.PI / 2);
            ctx.stroke();
            break;
          }
          case OpenableType.Right: {
            ctx.beginPath();
            ctx.moveTo(this.dim.w / 2, 0);
            ctx.lineTo(this.dim.w / 2, this.dim.w);
            ctx.stroke();

            ctx.beginPath();
            ctx.arc(this.dim.w / 2, 0, this.dim.w, Math.PI / 2, Math.PI);
            ctx.stroke();
            break;
          }
          case OpenableType.Double: {
            ctx.beginPath();
            ctx.moveTo(-this.dim.w / 2, 0);
            ctx.lineTo(-this.dim.w / 2, this.dim.w / 2);
            ctx.stroke();

            ctx.beginPath();
            ctx.arc(-this.dim.w / 2, 0, this.dim.w / 2, 0, Math.PI / 2);
            ctx.stroke();

            ctx.beginPath();
            ctx.moveTo(this.dim.w / 2, 0);
            ctx.lineTo(this.dim.w / 2, this.dim.w / 2);
            ctx.stroke();

            ctx.beginPath();
            ctx.arc(this.dim.w / 2, 0, this.dim.w / 2, Math.PI / 2, Math.PI);
            ctx.stroke();
            break;
          }
        }

        const rotateSize = this.getRotateSize();

        if (settings.mode === Mode.Room) {
          ctx.beginPath();
          ctx.rect(-this.dim.w / 2, -this.dim.h, this.dim.w, this.dim.h);
          ctx.stroke();

          if (this.snap.edge === null) {
            ctx.beginPath();
            ctx.arc(
              -this.dim.w / 2 + rotateSize / 2,
              -this.dim.h + rotateSize / 2,
              rotateSize / 2,
              0,
              2 * Math.PI
            );
            ctx.stroke();
          }
        }

        if (this.translate || this.rotate) {
          setFontSize(rotateSize * 2);

          ctx.beginPath();
          drawDistance(0, -this.dim.h + rotateSize * 2, this.dim.w, null, "mm");
          ctx.stroke();

          if (this.snap.edge !== null && this.snap.pos !== null && this.snap.orientation !== null) {
            const node1 = graph.nodes[this.snap.edge.id1] as CornerNode;
            const node2 = graph.nodes[this.snap.edge.id2] as CornerNode;

            const dist: number = distance(node1.p, node2.p);
            const dist1: number = dist * this.snap.pos - this.dim.w / 2;
            const dist2: number = dist * (1 - this.snap.pos) - this.dim.w / 2;

            if (dist1 > 0) {
              ctx.textAlign = this.snap.orientation === 0 ? "right" : "left";
              ctx.beginPath();
              drawDistance((this.snap.orientation - 1 / 2) * this.dim.w, -this.dim.h + rotateSize * 2, dist1, 0, "mm");
              ctx.stroke();
            }

            if (dist2 > 0) {
              ctx.textAlign = this.snap.orientation === 1 ? "right" : "left";
              ctx.beginPath();
              drawDistance((-this.snap.orientation + 1 / 2) * this.dim.w, -this.dim.h + rotateSize * 2, dist2, 0, "mm");
              ctx.stroke();
            }
          }
        }

        ctx.restore();
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
        if (minDim.w / 2 <= settings.furnitureRotateSize || minDim.h / 2 <= settings.furnitureRotateSize) {
          return Math.min(minDim.w, minDim.h) / 2;
        }
        return settings.furnitureRotateSize;
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
        const textDim = ctx.measureText(this.name);
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
          if (!handleSnap(this, [360, 270, 180, 90], Math.abs((this.angle + a + 360) % 360), settings.furnitureSnapAngle)) {
            this.angle += a;

            this.delta.x = e.x;
            this.delta.y = e.y;
          }
        }

        return changed;
      }

      draw() {
        ctx.save();

        const c = this.center();
        const maxDim = this.getMaxDim();
        const minDim = this.getMinDim();

        ctx.translate(c.x, c.y);
        ctx.rotate(toRad(this.angle));

        this.setStyle(settings.mode === Mode.Room, true);

        if (this.dims.length > 0) {
          ctx.beginPath();

          let currX = -maxDim.w / 2;
          let currY = -maxDim.h / 2;

          let prevDim: Dim | null = null;
          for (const dim of this.dims) {
            if (prevDim !== null) {
              currY += dim.h - prevDim.h;
              ctx.lineTo(currX, currY);
              currX += dim.w;
              ctx.lineTo(currX, currY);
            } else {
              ctx.moveTo(currX, currY);
              currY += dim.h;
              ctx.lineTo(currX, currY);
              currX += dim.w;
              ctx.lineTo(currX, currY);
            }
            prevDim = dim;
          }

          currY = -maxDim.h / 2;
          ctx.lineTo(currX, currY);
          ctx.closePath();

          ctx.stroke();
        }

        ctx.beginPath();

        this.setFontSize();
        ctx.textBaseline = "middle";
        ctx.fillText(this.name, 0, - maxDim.h / 2 + minDim.h / 2, minDim.w);
        ctx.textBaseline = "alphabetic";

        const rotateSize = this.getRotateSize();

        if (settings.mode === Mode.Furniture) {
          ctx.beginPath();
          ctx.arc(
            -maxDim.w / 2 + rotateSize / 2,
            -maxDim.h / 2 + rotateSize / 2,
            rotateSize / 2,
            0,
            2 * Math.PI
          );
          ctx.stroke();
        }

        if (this.translate || this.rotate) {
          setFontSize(rotateSize);

          ctx.beginPath();

          ctx.moveTo(-maxDim.w / 2, -maxDim.h / 2 + rotateSize);
          ctx.lineTo(-maxDim.w / 2 + maxDim.w, -maxDim.h / 2 + rotateSize);
          drawDistance(0, -maxDim.h / 2 + rotateSize, maxDim.w, null, "mm");

          ctx.moveTo(-maxDim.w / 2 + rotateSize, -maxDim.h / 2);
          ctx.lineTo(-maxDim.w / 2 + rotateSize, -maxDim.h / 2 + maxDim.h);

          ctx.translate(-maxDim.w / 2 + rotateSize, 0);
          ctx.rotate(toRad(-90));
          drawDistance(0, 0, maxDim.h, null, "mm");

          ctx.stroke();
        }

        ctx.restore();

        this.drawWallDistances();
        restoreDefaultContext();
      }

      drawWallDistances() {
        if (this.translate || this.rotate) {
          ctx.save();

          this.setStyle(settings.mode === Mode.Room, true);
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

          ctx.restore();
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
        if (this.r <= settings.furnitureRotateSize) {
          return this.r;
        }
        return settings.furnitureRotateSize;
      }

      setFontSize() {
        setFontSize(1);
        const textDim = ctx.measureText(this.name);
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
        ctx.save();

        ctx.translate(this.c.x, this.c.y);

        this.setStyle(settings.mode === Mode.Room, true);

        ctx.beginPath();
        ctx.arc(0, 0, this.r, 0, 2 * Math.PI);
        ctx.stroke();

        ctx.beginPath();

        this.setFontSize();
        ctx.textBaseline = "middle";
        ctx.fillText(this.name, 0, 0, 2 * this.r);
        ctx.textBaseline = "alphabetic";

        const rotateSize = this.getDimSize();

        if (this.translate) {
          setFontSize(rotateSize);

          ctx.beginPath();

          ctx.moveTo(-this.r, -this.r);
          ctx.lineTo(this.r, -this.r);
          drawDistance(0, -this.r + rotateSize, 2 * this.r, null, "mm");
          ctx.stroke();
        }

        ctx.restore();

        this.drawWallDistances();
        restoreDefaultContext();
      }

      drawWallDistances() {
        if (this.translate || this.rotate) {
          ctx.save();

          this.setStyle(settings.mode === Mode.Room, true);
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

          ctx.restore();
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
        if (this.z <= settings.furnitureRotateSize) {
          return this.z;
        }
        return settings.furnitureRotateSize;
      }

      getDimSize(): number {
        if (this.rX <= settings.furnitureRotateSize || this.rY <= settings.furnitureRotateSize) {
          return Math.min(this.rX, this.rY);
        }
        return settings.furnitureRotateSize;
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
        const textDim = ctx.measureText(this.name);
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
          if (!handleSnap(this, [360, 270, 180, 90], Math.abs((this.angle + a + 360) % 360), settings.furnitureSnapAngle)) {
            this.angle += a;

            this.delta.x = e.x;
            this.delta.y = e.y;
          }
        }

        return changed;
      }

      draw() {
        ctx.save();

        ctx.translate(this.c.x, this.c.y);
        ctx.rotate(toRad(this.angle));

        this.setStyle(settings.mode === Mode.Room, true);

        ctx.beginPath();
        ctx.ellipse(0, 0, this.rX, this.rY, 0, 0, 2 * Math.PI);
        ctx.stroke();

        ctx.beginPath();

        this.setFontSize();
        ctx.textBaseline = "middle";
        ctx.fillText(this.name, 0, 0, 2 * this.rX);
        ctx.textBaseline = "alphabetic";

        const rotateSize = this.getRotateSize();

        if (settings.mode === Mode.Furniture && this.rX !== this.rY) {
          ctx.beginPath();
          const f = this.angleSnapPoint();
          ctx.arc(
            f.x - this.c.x,
            f.y - this.c.y,
            rotateSize / 2,
            0,
            2 * Math.PI
          );
          ctx.stroke();
        }

        const dimSize = this.getDimSize();

        if (this.translate || this.rotate) {
          setFontSize(dimSize);

          ctx.beginPath();

          ctx.moveTo(-this.rX, -this.rY);
          ctx.lineTo(this.rX, -this.rY);
          drawDistance(0, -this.rY + dimSize, 2 * this.rX, null, "mm");

          ctx.moveTo(-this.rX, -this.rY);
          ctx.lineTo(-this.rX, this.rY);

          ctx.translate(-this.rX + dimSize, 0);
          ctx.rotate(toRad(-90));
          drawDistance(0, 0, 2 * this.rY, null, "mm");

          ctx.stroke();
        }

        ctx.restore();

        this.drawWallDistances();
        restoreDefaultContext();
      }

      drawWallDistances() {
        if (this.translate || this.rotate) {
          ctx.save();

          this.setStyle(settings.mode === Mode.Room, true);
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

          ctx.restore();
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

  },

  template: `
    <div id="container">


        <div id="content">
        <canvas id="canvas">Your browser does not support the HTML 5 Canvas.</canvas>
          
        <div class="navBar">
          <button type="button" id="navZoomIn" class="navBarButton">⊕</button>
          <button type="button" id="navCenter" class="navBarButton">⊚</button>
          <button type="button" id="navZoomOut" class="navBarButton">⊖</button>
        </div>
          
        <div class="navBar translate">
          <button type="button" id="navUp" class="navBarButton">⮉</button>
          <div class="subBar">
            <button type="button" id="navLeft" class="navBarButton">⮈</button>
            <button type="button" id="navRight" class="navBarButton">⮊</button>
          </div>
          <button type="button" id="navDown" class="navBarButton">⮋</button>
        </div>
          
        <div id="sidebar">
          <div class="tab mode buttonRow">
            <button type="button" id="floorplanButton" class="tabLinks mode"></button>
            <button type="button" id="roomButton" class="tabLinks mode"></button>
            <button type="button" id="furnitureButton" class="tabLinks mode"></button>
            <button type="button" id="presentationButton" class="tabLinks mode"></button>
          </div>
          <div id="floorplanTab" class="tabContent mode">
            <table>
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
            </table>
          </div>
          <div id="roomTab" class="tabContent mode">
            <table>
              <tr>
                <th id="cornerHead" colspan="2"></th>
              </tr>
              <tr>
                <td><label id="nodeTransSliderLabel" for="nodeTransSlider"></label></td>
                <td class="inputTD">
                  <input type="range" id="nodeTransSlider" class="w100pc" min="5" max="750" value="50">
                </td>
              </tr>
              <tr>
                <td><label id="nodeExtendSliderLabel" for="nodeExtendSlider"></label></td>
                <td class="inputTD">
                  <input type="range" id="nodeExtendSlider" class="w100pc" min="5" max="750" value="150">
                </td>
              </tr>
              <tr>
                <th id="labelHead" colspan="2"></th>
              </tr>

              <tr>
                <td><label id="labelNameInputLabel" for="labelNameInput"></label></td>
                <td class="inputTD">
                  <input id="labelNameInput" value="Livingroom" class="w100pc">
                </td>
              </tr>
              <tr>
                <td><label id="labelHeightInputLabel" for="labelHeightInput"></label></td>
                <td class="inputTD">
                  <input type="number" id="labelHeightInput" class="w100pc" min="1" value="1000" required="">
                </td>
              </tr>
              <tr>
                <td colspan="2">
                  <button id="addLabelButton" class="addButton"></button>
                </td>
              </tr>

              <tr>
                <th id="openableHead" colspan="2"></th>
              </tr>

              <tr>
                <td><label id="openableWidthInputLabel" for="openableWidthInput"></label></td>
                <td class="inputTD">
                  <input type="number" id="openableWidthInput" class="w100pc" min="1" value="1000" required="">
                </td>
              </tr>
              <tr>
                <td><label id="openableTypeInputLabel" for="leftOpenableButton"></label></td>
                <td class="tab openableType buttonRow">
                  <button type="button" id="leftOpenableButton" class="tabLinks openableType">L</button>
                  <button type="button" id="rightOpenableButton" class="tabLinks openableType">R</button>
                  <button type="button" id="doubleOpenableButton" class="tabLinks openableType">D</button>
                </td>
              </tr>
              <tr>
                <td colspan="2">
                  <button id="addOpenableButton" class="addButton"></button>
                </td>
              </tr>

            </table>
          </div>
          <div id="furnitureTab" class="tabContent mode">
            <table>
              <tr>
                <td><label id="nameInputLabel" for="nameInput"></label></td>
                <td class="inputTD">
                  <input id="nameInput" class="w100pc" value="Couch">
                </td>
              </tr>
              <tr>
                <td><label id="typeInputLabel" for="circleButton"></label></td>
                <td class="tab furnitureType buttonRow">
                  <button type="button" id="circleButton" class="tabLinks furnitureType">○</button>
                  <button type="button" id="rectangleButton" class="tabLinks furnitureType">▭</button>
                  <button type="button" id="LButton" class="tabLinks furnitureType">╔</button>
                  <button type="button" id="UButton" class="tabLinks furnitureType">╔╗</button>
                </td>
              </tr>
              <tbody id="circleTab" class="tabContent furnitureType">
              <tr>
                <td><label id="circleWidthInputLabel" for="circleWidthInput"></label></td>
                <td class="inputTD">
                  <input type="number" id="circleWidthInput" class="w100pc" min="1" value="1000" required="">
                </td>
              </tr>
              <tr>
                <td><label id="circleHeightInputLabel" for="circleHeightInput"></label></td>
                <td class="inputTD">
                  <input type="number" id="circleHeightInput" class="w100pc" min="1" value="1000" required="">
                </td>
              </tr>
              </tbody>
              <tbody id="rectangleTab" class="tabContent furnitureType">
              <tr>
                <td><label id="widthInputLabel" for="widthInput"></label></td>
                <td class="inputTD">
                  <input type="number" id="widthInput" class="w100pc" min="1" value="2000" required="">
                </td>
              </tr>
              <tr>
                <td><label id="heightInputLabel" for="heightInput"></label></td>
                <td class="inputTD">
                  <input type="number" id="heightInput" class="w100pc" min="1" value="1000" required="">
                </td>
              </tr>
              </tbody>
              <tbody id="LTab" class="tabContent furnitureType">
              <tr>
                <td><label id="LWidthInputLabel" for="LWidthInput1"></label></td>
                <td class="inputTD">
                  <input type="number" id="LWidthInput1" class="w50pc" min="1" value="1000" required="">
                  <input type="number" id="LWidthInput2" class="w50pc" min="1" value="1000" required="">
                </td>
              </tr>
              <tr>
                <td><label id="LHeightInputLabel" for="LHeightInput1"></label></td>
                <td class="inputTD">
                  <input type="number" id="LHeightInput1" class="w50pc" min="1" value="2000" required="">
                  <input type="number" id="LHeightInput2" class="w50pc" min="1" value="1000" required="">
                </td>
              </tr>
              </tbody>
              <tbody id="UTab" class="tabContent furnitureType">
              <tr>
                <td><label id="UWidthInputLabel" for="UWidthInput1"></label></td>
                <td class="inputTD">
                  <input type="number" id="UWidthInput1" class="w33pc" min="1" value="1000" required="">
                  <input type="number" id="UWidthInput2" class="w33pc" min="1" value="1000" required="">
                  <input type="number" id="UWidthInput3" class="w33pc" min="1" value="1000" required="">
                </td>
              </tr>
              <tr>
                <td><label id="UHeightInputLabel" for="UHeightInput1"></label></td>
                <td class="inputTD">
                  <input type="number" id="UHeightInput1" class="w33pc" min="1" value="2000" required="">
                  <input type="number" id="UHeightInput2" class="w33pc" min="1" value="1000" required="">
                  <input type="number" id="UHeightInput3" class="w33pc" min="1" value="2000" required="">
                </td>
              </tr>
              </tbody>
              <tr>
                <td colspan="2">
                  <button id="addFurnitureButton" class="addButton"></button>
                </td>
              </tr>

            </table>
          </div>
          <div id="presentationTab" class="tabContent mode">
            <table>
              <tr>
                <th id="presentationOptionsHead" colspan="2"></th>
              </tr>
              <tr>
                <td><input type="checkbox" id="edgeLabelCheckbox" class="checkboxClass"></td>
                <td><label id="edgeLabelCheckboxLabel" for="edgeLabelCheckbox"></label></td>
              </tr>
              <tr>
                <td><input type="checkbox" id="roomSizeCheckbox" class="checkboxClass"></td>
                <td><label id="roomSizeCheckboxLabel" for="roomSizeCheckbox"></label></td>
              </tr>
            </table>
          </div>
          <div class="buttonRow bottomMenu">
            <button type="button" id="saveButton"></button>
            <label id="loadButton" class="loadInputClass" for="loadInput"></label>
            <input type="file" id="loadInput" class="loadFileClass">
            <button type="button" id="exportButton"></button>
            <button type="button" id="printButton"></button>
          </div>
          <div class="buttonRow bottomMenu">
            <button type="button" id="helpOpen"></button>
          </div>
        </div>
      </div>
      <dialog id="helpDialog">
        <div id="helpBox" class="w100pc h100pc">
          <div id="helpText" class="w100pc h100pc"></div>
          <div class="buttonRow bottomMenu">
            <button type="button" id="helpClose"></button>
          </div>
        </div>
      </dialog>
    </div>
  `}