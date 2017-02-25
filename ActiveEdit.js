var ActiveEdit = (function () {
    function ActiveEdit(config) {
        this.config = config;
        this.element = document.querySelectorAll(this.config.element || '#activeedit')[0];
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
        this.contextMenu = new ContextMenu(['cut', 'copy', 'paste', 'undo', 'fill'], this);
        if (this.config.custom) {
            for (var key in this.config.custom) {
                var value = this.config.custom[key];
                this.set(key, value);
            }
            delete this.config.custom;
        }
        if (!this.config.doNotInitialize) {
            this.init();
        }
    }
    ActiveEdit.prototype.init = function () {
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
    ActiveEdit.prototype.build = function () {
        // Build Table Header
        var tr = document.createElement('tr');
        for (var _i = 0, _a = this.config.cols; _i < _a.length; _i++) {
            var colAttributes = _a[_i];
            var col = new Column(colAttributes, this);
            this.cols.push(col);
            tr.appendChild(col.element);
        }
        var thead = document.createElement('thead');
        thead.appendChild(tr);
        // Build Table Body
        var tbody = document.createElement('tbody');
        for (var _b = 0, _c = this.source; _b < _c.length; _b++) {
            var rowAttributes = _c[_b];
            var row = new Row(rowAttributes, this);
            this.rows.push(row);
            tbody.appendChild(row.element);
        }
        //Build Table
        var table = document.createElement('table');
        Utilities.setAttributes(table, { id: 'editable-grid', "class": this.config.tableClass });
        table.appendChild(thead);
        table.appendChild(tbody);
        this.tableEl = table;
    };
    ActiveEdit.prototype.events = function () {
        var table = this;
        var moveTo = table.moveTo;
        var edit = table.edit;
    };
    //  events: ->
    //    table = @
    //    moveTo = table.moveTo
    //    edit = table.edit
    ActiveEdit.prototype.render = function () {
        this.element.appendChild(this.tableEl);
    };
    ActiveEdit.prototype.set = function (key, value) {
        if (!this.config[key]) {
            this.config[key] = value;
        }
    };
    return ActiveEdit;
}());
var Column = (function () {
    function Column(attributes, table) {
        this.attributes = attributes;
        this.table = table;
        this.element = document.createElement('th');
    }
    return Column;
}());
var Row = (function () {
    function Row(attributes, table) {
        this.attributes = attributes;
        this.table = table;
        this.element = document.createElement('tr');
    }
    return Row;
}());
var ContextMenu = (function () {
    function ContextMenu(actions, table) {
        this.actions = actions;
        this.table = table;
    }
    return ContextMenu;
}());
var Utilities = (function () {
    function Utilities() {
    }
    Utilities.setAttributes = function (el, attrs) {
        for (var key in attrs) {
            var value = attrs[key];
            if (value) {
                el.setAttribute(key, value);
            }
        }
    };
    Utilities.setStyles = function (el, styles) {
        for (var key in styles) {
            var value = styles[key];
            el.style[key] = value + "px";
        }
    };
    Utilities.clearActiveCells = function (table) {
        var redCells = table.redCells;
        var activeCells = table.activeCells;
        if (redCells.length > 0) {
            for (var _i = 0, redCells_1 = redCells; _i < redCells_1.length; _i++) {
                var redCell = redCells_1[_i];
                if (redCell) {
                    redCell.makeInactive();
                }
            }
            table.redCells = [];
        }
        if (activeCells.length > 0) {
            for (var _a = 0, activeCells_1 = activeCells; _a < activeCells_1.length; _a++) {
                var activeCell = activeCells_1[_a];
                if (activeCell) {
                    activeCell.makeInactive();
                    activeCell.hideControl();
                }
            }
            table.activeCells = [];
        }
        table.selectionStart = null;
        table.selectionEnd = null;
        table.contextMenu.hide();
        if (table.selectedCol) {
            table.selectedCol.makeInactive();
        }
    };
    Utilities.capitalize = function (string) {
        var str = string.toLowerCase().replace(/\b./g, function (a) { return a.toUpperCase(); });
        return str;
    };
    return Utilities;
}());
