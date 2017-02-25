// Generated by CoffeeScript 1.12.4
(function() {
  var ActiveEdit,
    indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  ActiveEdit = (function() {
    function ActiveEdit(config) {
      var key, ref, value;
      this.config = config;
      this.element = document.querySelectorAll(this.config.element || '#activeedit')[0];
      this.headers = [];
      this.rows = [];
      this.cols = [];
      this.source = this.config.rows;
      this.redCells = [];
      this.activeCells = [];
      this.copiedCells = [];
      this.copiedValues = [];
      this.selectionStart = null;
      this.selectionEnd = null;
      this.selectedCol = null;
      this.openCell = null;
      this.state = "ready";
      this.mobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      this.topOffset = !this.config.topOffset ? 0 : this.config.topOffset;
      this.cellStyles = {
        activeColor: "#FFE16F",
        uneditableColor: "#FFBBB3"
      };
      if (this.config.custom) {
        ref = this.config.custom;
        for (key in ref) {
          value = ref[key];
          if (key in this.config.custom) {
            this.set(key, value);
          }
        }
        delete this.config.custom;
      }
      if (this.config.initialize) {
        this.init();
      }
      this.contextMenu = new ContextMenu(['cut', 'copy', 'paste', 'undo', 'fill'], this);
    }

    ActiveEdit.prototype.init = function() {
      if (this.config.beforeInit) {
        this.config.beforeInit();
      }
      this.build();
      this.events();
      this.render();
      if (this.config.afterInit) {
        this.config.afterInit();
      }
    };

    ActiveEdit.prototype.build = function() {
      var col, colAttributes, i, j, k, len, len1, ref, ref1, row, rowAttributes, table, tbody, thead, tr;
      tr = document.createElement('tr');
      ref = this.config.cols;
      for (i = j = 0, len = ref.length; j < len; i = ++j) {
        colAttributes = ref[i];
        col = new Column(colAttributes, this);
        this.cols.push(col);
        tr.appendChild(col.element);
      }
      thead = document.createElement('thead');
      thead.appendChild(tr);
      tbody = document.createElement('tbody');
      ref1 = this.source;
      for (i = k = 0, len1 = ref1.length; k < len1; i = ++k) {
        rowAttributes = ref1[i];
        row = new Row(rowAttributes, this);
        this.rows.push(row);
        tbody.appendChild(row.element);
      }
      table = document.createElement('table');
      Utilities.prototype.setAttributes(table, {
        id: 'editable-grid',
        "class": this.config.tableClass
      });
      table.appendChild(thead);
      table.appendChild(tbody);
      return this.tableEl = table;
    };

    ActiveEdit.prototype.events = function() {
      var edit, moveTo, table;
      table = this;
      moveTo = table.moveTo;
      edit = table.edit;
      document.onkeydown = function(e) {
        var cmd, ctrl, key, openCellAndPopulateInitialValue, shift, valueFromKey;
        if (table.activeCell()) {
          key = e.keyCode;
          shift = e.shiftKey;
          ctrl = e.ctrlKey;
          cmd = e.metaKey;
          valueFromKey = function(key, shift) {
            var char;
            char = String.fromCharCode(key);
            if (!shift) {
              return char.toLowerCase();
            } else {
              return char;
            }
          };
          openCellAndPopulateInitialValue = function() {
            if (!table.openCell) {
              return table.activeCell().showControl(valueFromKey(key, shift));
            }
          };
          switch (key) {
            case 39:
              if (!table.activeCell().isBeingEdited()) {
                return moveTo(table.nextCell());
              }
              break;
            case 9:
              if (shift) {
                return moveTo(table.previousCell());
              } else {
                return moveTo(table.nextCell());
              }
              break;
            case 37:
              return moveTo(table.previousCell());
            case 38:
              return moveTo(table.aboveCell());
            case 40:
              return moveTo(table.belowCell());
            case 32:
              if (!table.openCell) {
                return edit(table.activeCell());
              }
              break;
            case 67:
              if (cmd || ctrl) {
                return table.contextMenu.copy();
              } else {
                return openCellAndPopulateInitialValue();
              }
              break;
            case 86:
              if (cmd || ctrl) {
                return table.contextMenu.paste();
              } else {
                return openCellAndPopulateInitialValue();
              }
              break;
            case 88:
              if (cmd || ctrl) {
                return table.contextMenu.cut();
              } else {
                return openCellAndPopulateInitialValue();
              }
              break;
            case 90:
              if (cmd || ctrl) {
                return table.contextMenu.undo();
              } else {
                return openCellAndPopulateInitialValue();
              }
              break;
            case 13:
              break;
            case 16:
              break;
            case 17:
              break;
            case 91:
              break;
            case 8:
              if (!table.openCell) {
                e.preventDefault();
                return table["delete"]();
              }
              break;
            case 46:
              if (!table.openCell) {
                e.preventDefault();
                return table["delete"]();
              }
              break;
            default:
              if (indexOf.call([96, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111], key) >= 0) {
                key = key - 48;
              }
              return openCellAndPopulateInitialValue();
          }
        }
      };
      window.onresize = function() {
        if (table.openCell) {
          return Utilities.prototype.setStyles(table.openCell.control, table.openCell.position());
        }
      };
      window.onscroll = function() {
        if (table.openCell) {
          return table.openCell.reposition();
        }
      };
      this.tableEl.oncontextmenu = function(e) {
        return false;
      };
      return document.onclick = function(e) {
        var ref;
        if (!((table.isDescendant(e.target)) || (e.target === ((ref = table.activeCell()) != null ? ref.control : void 0)))) {
          return Utilities.prototype.clearActiveCells(table);
        }
      };
    };

    ActiveEdit.prototype.set = function(key, value) {
      if (key !== void 0) {
        return this.config[key] = value;
      }
    };

    return ActiveEdit;

  })();

}).call(this);
