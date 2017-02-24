z = document.getElementById('an-div');
Utilities.setAttributes(z, {class: "there"});

y = document.getElementById('test-div');
w = {
  bottom: 26,
  height: 18,
  left: 80,
  right: 34,
  top: 59,
  width: 26
}

Utilities.setStyles(y, w);

class Cell {
  constructor (name) {this.name = name}
  makeInactive () { console.log ("make " + this.name + " inactive"); }
  hideControl () { console.log ("hide " + this.name + " control"); }
  hide () { console.log ("hide " + this.name ); }
}

a = new Cell("a");
b = new Cell("b");
c = new Cell("c");
d = new Cell("d");

var t = {
  redCells: [a,null,b],
  activeCells: [c,null,d],
  contextMenu: a,
  selectedCol: b
}

Utilities.clearActiveCells(t);

console.log(t);

m = Utilities.capitalize("jDk");

console.log(m);



