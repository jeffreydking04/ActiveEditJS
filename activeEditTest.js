var empty = {
  cols: [ { label: 'test' } ],
  rows: [ { test: 'hi'} ]
};

ae = new ActiveEdit(empty);
console.log(ae.element);

var ActiveEditConfig = {
  element: '#test-div',
  custom: { jdk: 'jdk' },
  cols: [ { label: 'test' } ],
  rows: [ { test: 'hi'} ]
};

activeEdit = new ActiveEdit(ActiveEditConfig);

console.log(activeEdit.element);

// Shows that all variables are initialized, that #set is working, and config.custom is properly converted
console.log(activeEdit);

// This section tests that #set is not overwriting an existing config key
testSet = {
  jdk: "jdk",
  custom: { jdk: "clk" },
  cols: [ { label: 'test' } ],
  rows: [ { test: 'hi'} ]
}

ae = new ActiveEdit(testSet);

console.log(ae);

// Testing doNotInitialize

testDNI = {
  beforeInit: () => { console.log('beforeInit performed'); },
  afterInit: () => { console.log('afterInit performed'); },
  doNotInitialize: true
};
console.log("Instantiating: Callbacks should not be performed. ");
ae = new ActiveEdit(testDNI);
console.log("Instantiated");

// Testing beforeInit and afterInit
testCBs = {
  beforeInit: () => { console.log('beforeInit performed'); },
  afterInit: () => { console.log('afterInit performed'); },
  cols: [ { label: 'test' } ],
  rows: [ { test: 'hi'} ]
}

console.log('Instantiating: Callbacks should be performed');
ae = new ActiveEdit(testCBs);
console.log('Instantiated');

// test build (this assumes that the table has been rendered in the html)
// if the user does not specify cols or rows keys containing record attributes, initialization will throw an error in any case,
console.log('There should be a table element with id editable-grid.  It should have children thead and tbody.');
console.log('thead and tbody should each have a tr child.');
console.log('The tr in the thead should have a th child.')
elem = document.getElementsByTagName('table');
console.log(elem[0]);

