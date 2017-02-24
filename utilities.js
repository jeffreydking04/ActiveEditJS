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
