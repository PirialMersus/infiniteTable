class MyLib {
  constructor(options) {
    this.tableWrapper = options.elem;
    this.data = options.data || this.makeData();
    this.rowHeight = options.height;
    this.cellWidth = options.width;

    this.canvasForTableInTableWrapper = this.tableWrapper.ownerDocument.createElement(
      "div"
    );

    this.makingCanvasForTableInTableWrapper();

    this.canvasForTableInTableWrapper.addEventListener("mousedown", (e) => {
      this.mouseDown(e);
    });

    this.canvasForTableInTableWrapper.addEventListener("mouseup", (e) => {});
    this.canvasForTableInTableWrapper.addEventListener("mousemove", (e) => {
      this.mouseMove(e);
    });

    this.x1 = 0;
    this.y1 = 0;
    this.x2 = 0;
    this.y2 = 0;
    this.x = 0;
    this.y = 0;
    this.scrollModeOn = false;
    this.tableWrapper.addEventListener("scroll", this.test, false);
    this.refreshWindow();
    // debugger;
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
    this.scrollModeOn = true;
    const xInCell = e.offsetX;
    const yInCell = e.offsetY;

    const xInWrap = parseFloat(e.path[0].style.left);
    const yInWrap = parseFloat(e.path[1].style.top);

    this.x1 = xInCell + xInWrap;
    this.y1 = yInCell + yInWrap;
    console.log("x1", this.x1);
    console.log("y1", this.y1);
  };

  mouseMove = (e) => {
    if (this.scrollModeOn) {
      const xInCell = e.offsetX;
      const yInCell = e.offsetY;

      const xInWrap = parseFloat(e.path[0].style.left);
      const yInWrap = parseFloat(e.path[1].style.top);

      this.x2 = xInCell + xInWrap;
      this.y2 = yInCell + yInWrap;
      console.log("this.x2 - this.x1", this.x2 - this.x1);
      console.log("this.y2 - this.y1", this.y2 - this.y1);
      tableWrapper.scrollTop = this.x2 - this.x1;
      tableWrapper.scrollLeft = this.y2 - this.y1;
      this.refreshWindow();
    }
    this.scrollModeOn = false;
  };

  mouseMove = (e) => {
    if (this.scrollModeOn) {
      const xInCell = e.offsetX;
      const yInCell = e.offsetY;

      const xInWrap = parseFloat(e.path[0].style.left);
      const yInWrap = parseFloat(e.path[1].style.top);

      this.x2 = xInCell + xInWrap;
      this.y2 = yInCell + yInWrap;
      console.log(this.x2 - this.x1);
      console.log(this.y2 - this.y1);
      tableWrapper.scrollTop = this.x2 - this.x1;
      tableWrapper.scrollLeft = this.y2 - this.y1;
    }
    this.scrollModeOn = false;
  };

  refreshWindow = function () {
    console.log("refreshWindow");
    let firstRow = Math.floor(
      this.tableWrapper.scrollTop / this.rowHeight - 40
    );
    let lastRow =
      firstRow +
      Math.ceil(this.tableWrapper.offsetHeight / this.rowHeight) +
      80;

    let firstCell = Math.floor(
      this.tableWrapper.scrollLeft / this.cellWidth - 20
    );
    let lastCell =
      firstCell +
      Math.ceil(this.tableWrapper.offsetHeight / this.cellWidth) +
      40;
    // debugger;

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

    const frag = document.createDocumentFragment();

    for (let i = firstRow; i < lastRow; i++) {
      let row;
      row = this.tableWrapper.ownerDocument.createElement("div");
      row.className = "row";
      row.style.top = i * this.rowHeight + "px";

      for (let j = firstCell; j < lastCell; j++) {
        let cell = this.tableWrapper.ownerDocument.createElement("div");
        cell.className = "cell";
        cell.style.left = j * this.cellWidth + "px";
        // debugger;
        cell.innerHTML = this.data[i][j];

        row.appendChild(cell);
      }
      frag.appendChild(row);
    }
    this.canvasForTableInTableWrapper.appendChild(frag);
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

  test = this.throttle(this.refreshWindow, 150).bind(this);
}

new MyLib({
  elem: document.getElementById("tableWrapper"),
  data: null,
  width: 70,
  height: 24,
});
