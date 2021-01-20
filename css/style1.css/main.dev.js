"use strict";

var data = [];
var tableWrapper = document.getElementById("tableWrapper");
var rowHeight = 24;
var cellWidth = 70;
var canvasForTableInTableWrapper = tableWrapper.ownerDocument.createElement("div");
console.time("for");

for (var i = 0; i < 600; i++) {
  data[i] = new Array();

  for (var j = 0; j < 600; j++) {
    data[i][j] = " ".concat(i, ":").concat(j, " ");
  }
}

console.timeEnd("for");
canvasForTableInTableWrapper.className = "canvasForTableInTableWrapper";
canvasForTableInTableWrapper.style.height = rowHeight * data.length + "px";
canvasForTableInTableWrapper.style.width = cellWidth * data[0].length + "px";
tableWrapper.appendChild(canvasForTableInTableWrapper);
var x1,
    y1,
    x2,
    y2,
    x,
    y = 0;
var scrollModeOn = false;
canvasForTableInTableWrapper.addEventListener("mousedown", function (e) {
  scrollModeOn = true;
  var xInCell = e.offsetX;
  var yInCell = e.offsetY;
  var xInWrap = parseFloat(e.path[0].style.left);
  var yInWrap = parseFloat(e.path[1].style.top);
  x1 = xInCell + xInWrap;
  y1 = yInCell + yInWrap;
  console.log(x1);
  console.log(y1);
});
canvasForTableInTableWrapper.addEventListener("mouseup", function (e) {// debugger;
});
canvasForTableInTableWrapper.addEventListener("mousemove", function (e) {
  if (scrollModeOn) {
    var xInCell = e.offsetX;
    var yInCell = e.offsetY;
    var xInWrap = parseFloat(e.path[0].style.left);
    var yInWrap = parseFloat(e.path[1].style.top);
    x2 = xInCell + xInWrap;
    y2 = yInCell + yInWrap;
    console.log(x2 - x1);
    console.log(y2 - y1);
    tableWrapper.scrollTop = x1 - x2;
    tableWrapper.scrollLeft = y1 - y2;
  }

  scrollModeOn = false;
});

var refreshWindow = function refreshWindow() {
  console.log("refreshWindow");
  var firstRow = Math.floor(tableWrapper.scrollTop / rowHeight);
  var lastRow = firstRow + Math.ceil(tableWrapper.offsetHeight / rowHeight) + 1;
  var firstCell = Math.floor(tableWrapper.scrollLeft / cellWidth);
  var lastCell = firstCell + Math.ceil(tableWrapper.offsetHeight / cellWidth) + 1;

  if (data.length < lastRow) {
    lastRow = data.length;
  }

  if (data[0].length < lastCell) {
    lastCell = data[0].length;
  }

  canvasForTableInTableWrapper.innerHTML = "";
  var frag = document.createDocumentFragment();

  for (var _i = firstRow; _i < lastRow; _i++) {
    var row = void 0;
    row = tableWrapper.ownerDocument.createElement("div");
    row.className = "row";
    row.style.top = _i * rowHeight + "px";

    for (var _j = firstCell; _j < lastCell; _j++) {
      var cell = tableWrapper.ownerDocument.createElement("div");
      cell.className = "cell";
      cell.style.left = _j * cellWidth + "px";
      cell.innerHTML = data[_i][_j];
      row.appendChild(cell);
    }

    frag.appendChild(row);
  }

  canvasForTableInTableWrapper.appendChild(frag);
};

function throttle(func, ms) {
  var isThrottled = false,
      savedArgs,
      savedThis;

  function wrapper() {
    console.log("throttle");

    if (isThrottled) {
      // (2)
      savedArgs = arguments;
      savedThis = this;
      return;
    }

    func.apply(this, arguments); // (1)

    isThrottled = true;
    setTimeout(function () {
      isThrottled = false; // (3)

      if (savedArgs) {
        wrapper.apply(savedThis, savedArgs);
        savedArgs = savedThis = null;
      }
    }, ms);
  }

  return wrapper;
} // function delayingHandler() {
//   console.log("delayingHandler");
//   setTimeout(refreshWindow, 1000);
// }


var test = throttle(refreshWindow, 300);
tableWrapper.addEventListener("scroll", test, false);
refreshWindow();