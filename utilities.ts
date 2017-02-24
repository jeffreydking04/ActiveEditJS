class Utilities {
  constructor () {}

  static setAttributes (el, attrs): void {
    for (let key in attrs) {
      let value = attrs[key];
      if (value) {
        el.setAttribute(key, value)
      }
    }
  }

  static setStyles (el, styles): void {
    for (let key in styles) {
      let value = styles[key];
      el.style[key] = value + "px";
    }
  }

  static clearActiveCells (table): void {
    let redCells = table.redCells;
    let activeCells = table.activeCells;
    if (redCells.length > 0) {
      for (let redCell of redCells) {
        if (redCell) {
          redCell.makeInactive();
        }
      }
      table.redCells = [];
    }
    if (activeCells.length > 0) {
      for (let activeCell of activeCells) {
        if (activeCell) {
          activeCell.makeInactive();
          activeCell.hideControl();
        }
      }
      table.activeCells = [];
    }
    table.selectionStart = null;
    table.selectionEnd = null;
    table.contextMenu.hide()
    if (table.selectedCol) {
      table.selectedCol.makeInactive()
    }
  }

  static capitalize (string): string {
    var str = string.toLowerCase().replace(/\b./g, function(a) { return a.toUpperCase(); });
    return str;
  }
}
