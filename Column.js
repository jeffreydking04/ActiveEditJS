"use strict";
var Column = (function () {
    function Column(attrs, table) {
        this.attrs = attrs;
        this.table = table;
        this.element = document.createElement('th');
    }
    return Column;
}());
exports.Column = Column;
