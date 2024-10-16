export const loc = {
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