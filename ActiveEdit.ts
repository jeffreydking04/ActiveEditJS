class ActiveEdit {
  element = document.querySelectorAll(this.config.element || '#activeedit')[0];
  rows = [];
  cols = [];
  source = this.config.rows;
  redCells = [];
  activeCells = [];
  copiedCells = [];
  copiedValues = [];
  selectionStart = null;
  selectionEnd = null;
  selectedCol = null;
  openCell = null;
  state = "ready";
  mobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  topOffset = !this.config.topOffset ? 0 : this.config.topOffset;
  cellStyles = {
    activeColor: "#FFE16F",
    uneditableColor: "#FFBBB3"
  }
  contextMenu = new ContextMenu (['cut', 'copy', 'paste', 'undo', 'fill'], this);
  tableEl: any;

  constructor (public config) {
    if (this.config.custom) {
      for(let key in this.config.custom) {
        let value = this.config.custom[key];
        this.set(key, value);
      }
      delete this.config.custom;
    }

    if (!this.config.doNotInitialize){
      this.init();
    }  
  }

  init () {
    if (this.config.beforeInit) { this.config.beforeInit(); }
    this.build();
    this.events();
    this.render();
    if (this.config.afterInit) {this.config.afterInit(); }
  }

  build () {
    // Build Table Header
    var tr = document.createElement('tr');
    for (let colAttributes of this.config.cols) {
      let col = new Column(colAttributes, this);
      this.cols.push(col);
      tr.appendChild(col.element);
    }
    let thead = document.createElement('thead');
    thead.appendChild(tr);

    // Build Table Body
    let tbody = document.createElement ('tbody');
    for (let rowAttributes of this.source) {
      let row = new Row(rowAttributes, this);
      this.rows.push(row);
      tbody.appendChild(row.element);
    }

    //Build Table
    let table = document.createElement('table');
    Utilities.setAttributes(table, {id: 'editable-grid', class: this.config.tableClass});
    table.appendChild(thead);
    table.appendChild(tbody);
    this.tableEl = table;
  }

  events () {
    let table = this;
    let moveTo = table.moveTo;
    let edit = table.edit;
  }

//  events: ->
//    table = @
//    moveTo = table.moveTo
//    edit = table.edit

  render () {
    this.element.appendChild(this.tableEl);
  }

  set (key, value) {
    if (!this.config[key]) { 
      this.config[key] = value
    }
  }
}

class Column {
  element = document.createElement('th');

  constructor (public attributes, public table) {}
}

class Row {
  element = document.createElement('tr');

  constructor (public attributes, public table) {}
}

class ContextMenu {
  constructor (public actions, public table) {}
}

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