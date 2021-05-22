// Проверка того, что наш браузер поддерживает Service Worker API.
if ("serviceWorker" in navigator) {
  // Весь код регистрации у нас асинхронный.

  navigator.serviceWorker
    .register("/js/sw.js")
    .then(function (registration) {
      console.log("Service Worker Registration", registration);
    })
    .catch(function (err) {
      console.log("Service Worker Failed to Register", err);
    });
}

class MyLib {
  constructor(options) {
    this.rowsTopAndBottom = options.rowsTopAndBottom;
    this.cellsLeftAndRight = options.cellsLeftAndRight;
    this.tableWrapper = options.elem;
    this.data = options.data || this.makeData();
    this.rowHeight = options.height;
    this.cellWidth = options.width;
    this.tableWrapperScrollTop;
    this.tableWrapperScrollLeft;
    this.x1 = 0;
    this.y1 = 0;
    this.x = 0;
    this.y = 0;
    this.isSlideModeOn = false;

    this.canvasForTableInTableWrapper = this.tableWrapper.ownerDocument.createElement(
      "div"
    );

    this.makingCanvasForTableInTableWrapper();

    this.canvasForTableInTableWrapper.addEventListener("mousedown", (e) => {
      this.isSlideModeOn = true;
      this.mouseDown(e);
    });
    this.canvasForTableInTableWrapper.addEventListener("mouseup", (e) => {
      this.isSlideModeOn = false;
      this.mouseUp(e);
    });
    this.canvasForTableInTableWrapper.addEventListener("mousemove", (e) => {
      this.mouseMove(e);
    });
    this.tableWrapper.addEventListener("scroll", this.test, false);

    this.refreshWindow();
  }

  makeData() {
    console.time("for");
    const data = [];
    for (let i = 0; i < 600; i++) {
      data[i] = new Array();
      for (let j = 0; j < 600; j++) {
        data[i][j] = ` ${i}:${j} `;
      }
    }
    console.timeEnd("for");
    return data;
  }

  makingCanvasForTableInTableWrapper() {
    this.canvasForTableInTableWrapper.className =
      "canvasForTableInTableWrapper";
    this.canvasForTableInTableWrapper.style.height =
      this.rowHeight * this.data.length + "px";
    this.canvasForTableInTableWrapper.style.width =
      this.cellWidth * this.data[0].length + "px";
    this.tableWrapper.appendChild(this.canvasForTableInTableWrapper);
  }

  mouseDown = (e) => {
    this.x = 0;
    this.y = 0;
    this.x1 = e.pageX;
    this.y1 = e.pageY;
    this.tableWrapperScrollTop = this.tableWrapper.scrollTop;
    this.tableWrapperScrollLeft = this.tableWrapper.scrollLeft;
    // console.log("x1", this.x1);
    // console.log("y1", this.y1);
  };

  mouseMove = (e) => {
    if (this.isSlideModeOn) {
      const x2 = e.pageX;
      const y2 = e.pageY;
      this.x = x2 - this.x1;
      this.y = y2 - this.y1;

      this.canvasForTableInTableWrapper.style.transform =
        "translate(" + this.x + "px, " + this.y + "px)";
    }
  };
  mouseUp = () => {
    this.canvasForTableInTableWrapper.style.transform = "translate(0px, 0px)";
    this.tableWrapper.scrollTop = this.tableWrapperScrollTop - this.y;
    this.tableWrapper.scrollLeft = this.tableWrapperScrollLeft - this.x;
    // this.refreshWindow;
  };

  refreshWindow = () => {
    if (this.isSlideModeOn) {
      return;
    }
    console.log("refreshwindow");
    let firstRow = Math.floor(
      this.tableWrapper.scrollTop / this.rowHeight - this.rowsTopAndBottom
    );
    let lastRow =
      firstRow +
      Math.ceil(this.tableWrapper.offsetHeight / this.rowHeight) +
      this.rowsTopAndBottom * 2;

    let firstCell = Math.floor(
      this.tableWrapper.scrollLeft / this.cellWidth - this.cellsLeftAndRight
    );
    let lastCell =
      firstCell +
      Math.ceil(this.tableWrapper.offsetHeight / this.cellWidth) +
      this.cellsLeftAndRight * 2;

    if (firstRow < 0) {
      firstRow = 0;
    }
    if (firstCell < 0) {
      firstCell = 0;
    }
    if (this.data.length < lastRow) {
      lastRow = this.data.length;
    }
    if (this.data[0].length < lastCell) {
      lastCell = this.data[0].length;
    }

    this.canvasForTableInTableWrapper.innerHTML = "";

    console.time("render table");
    // const frag = document.createDocumentFragment();
    let row,
      rows = "";
    for (let i = firstRow; i < lastRow; i++) {
      let cells = "";
      for (let j = firstCell; j < lastCell; j++) {
        let cell = `<div class="cell" style="left: ${j * this.cellWidth}px">${
          this.data[i][j]
        }</div>`;
        cells += cell;
      }
      row = `<div class="row" style="top: ${
        i * this.rowHeight
      }px">${cells}</div>`;
      rows += row;
    }

    // for (let i = firstRow; i < lastRow; i++) {
    //   let row;
    //   row = this.tableWrapper.ownerDocument.createElement("div");
    //   row.className = "row";
    //   row.style.top = i * this.rowHeight + "px";

    //   for (let j = firstCell; j < lastCell; j++) {
    //     let cell = this.tableWrapper.ownerDocument.createElement("div");
    //     cell.className = "cell";
    //     cell.style.left = j * this.cellWidth + "px";
    //     cell.innerHTML = this.data[i][j];

    //     row.appendChild(cell);
    //   }
    //   for (let j = firstCell; j < lastCell; j++) {
    //     let cell = this.tableWrapper.ownerDocument.createElement("div");
    //     cell.className = "cell";
    //     cell.style.left = j * this.cellWidth + "px";
    //     cell.innerHTML = this.data[i][j];

    //     row.appendChild(cell);
    //   }
    //   frag.appendChild(row);
    // }
    // this.canvasForTableInTableWrapper.appendChild(frag);
    this.canvasForTableInTableWrapper.innerHTML = rows;
    console.timeEnd("render table");
  };

  throttle(func, ms) {
    let isThrottled = false,
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
  }

  test = this.throttle(this.refreshWindow, 400).bind(this);
}

new MyLib({
  elem: document.getElementById("tableWrapper"),
  data: null,
  width: 70,
  height: 24,
  rowsTopAndBottom: 30,
  cellsLeftAndRight: 10,
});
