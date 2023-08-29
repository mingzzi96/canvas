class DrawingBoard {
  MODE = "NONE"; // NONE BRUSH ERASER
  isMouseDown = false;
  eraserColor = "#FFFFFF";
  backgroundColor = "#FFFFFF";
  undoArray = [];

  constructor() {
    this.assignElement();
    this.initContext();
    this.initCanvasBackgroundColor();
    this.addEvent();
  }

  assignElement() {
    this.containerEl = document.getElementById("container");
    this.canvasEl = this.containerEl.querySelector("#canvas");
    this.toolbarEl = this.containerEl.querySelector("#toolbar");
    this.brushEl = this.toolbarEl.querySelector("#brush");
    this.colorPickerEl = this.toolbarEl.querySelector("#colorPicker");
    this.brushPannelEl = this.containerEl.querySelector("#brushpannel");
    this.brushSize = this.brushPannelEl.querySelector("#brushSize");
    this.brushSizePreviewEl =
      this.brushPannelEl.querySelector("#brushSizePreview");
    this.eraserEl = this.toolbarEl.querySelector("#eraser");
    this.navigatorEl = this.toolbarEl.querySelector("#navigator");
    this.navigatorImageContainerEl = this.containerEl.querySelector("#imgNav");
    this.navigatorImageEl =
      this.navigatorImageContainerEl.querySelector("#canvasImg");
    this.undoEl = this.toolbarEl.querySelector("#undo");
  }

  initContext() {
    this.context = this.canvasEl.getContext("2d");
  }

  initCanvasBackgroundColor() {
    this.context.fillStyle = this.backgroundColor;
    this.context.fillRect(0, 0, this.canvasEl.width, this.canvasEl.height);
  }

  addEvent() {
    this.brushEl.addEventListener("click", this.onClickBrush.bind(this));
    this.canvasEl.addEventListener("mousedown", this.onMouseDown.bind(this));
    this.canvasEl.addEventListener("mousemove", this.onMouseMove.bind(this));
    this.canvasEl.addEventListener("mouseup", this.onMouseUp.bind(this));
    this.canvasEl.addEventListener("mouseout", this.onMouseOut.bind(this));
    this.brushSize.addEventListener("input", this.onChangeBrushSize.bind(this));
    this.colorPickerEl.addEventListener("input", this.onChangeColor.bind(this));
    this.eraserEl.addEventListener("click", this.onClickEraser.bind(this));
    this.navigatorEl.addEventListener(
      "click",
      this.onClickNavigator.bind(this)
    );
    this.undoEl.addEventListener("click", this.onClickUndo.bind(this));
  }

  onClickUndo() {
    if (this.undoArray.length === 0) {
      alert("더이상 실행 취소 할 수 없습니다.");
      return;
    }
    let previousDataUrl = this.undoArray.pop();
    let previousImage = new Image();
    previousImage.onload = () => {
      this.context.clearRect(0, 0, this.canvasEl.width, this.canvasEl.height);
      this.context.drawImage(
        previousImage,
        0,
        0,
        this.canvasEl.width,
        this.canvasEl.height,
        0,
        0,
        this.canvasEl.width,
        this.canvasEl.height
      );
    };
    previousImage.src = previousDataUrl;
  }

  saveState() {
    if (this.undoArray.length > 4) {
      this.undoArray.shift(); // 제일 앞 값을 빼준다.
      this.undoArray.push(this.canvasEl.toDataURL());
    } else {
      this.undoArray.push(this.canvasEl.toDataURL());
    }
    console.log(this.undoArray.length);
  }

  onClickNavigator(event) {
    this.isNavigatorVisible = !event.currentTarget.classList.contains("active");
    event.currentTarget.classList.toggle("active");
    this.navigatorImageContainerEl.classList.toggle("hide");
    this.updateNavigator();
  }

  updateNavigator() {
    if (!this.isNavigatorVisible) return;
    this.navigatorImageEl.src = this.canvasEl.toDataURL();
  }

  onClickEraser(event) {
    const isActive = event.currentTarget.classList.contains("active");
    // brush div 안에 i 태그가 눌릴 수 있으니까 currentTarget으로 찾기.
    this.MODE = isActive ? "NONE" : "ERASER";
    this.canvasEl.style.cursor = isActive ? "default" : "crosshair";
    this.brushPannelEl.classList.add("hide");
    event.currentTarget.classList.toggle("active");
    this.brushEl.classList.remove("active");
  }

  onMouseOut() {
    if (this.MODE === "NONE") return;
    this.isMouseDown = false;
    this.updateNavigator();
  }

  onChangeColor(event) {
    this.brushSizePreviewEl.style.background = event.target.value;
  }

  onChangeBrushSize(event) {
    this.brushSizePreviewEl.style.width = `${event.target.value}px`;
    this.brushSizePreviewEl.style.height = `${event.target.value}px`;
  }

  onMouseDown(event) {
    if (this.MODE === "NONE") return;
    this.isMouseDown = true;
    const currentPosition = this.getMousePosition(event);
    this.context.beginPath();
    this.context.moveTo(currentPosition.x, currentPosition.y);
    this.context.lineCap = "round";
    if (this.MODE === "BRUSH") {
      this.context.strokeStyle = this.colorPickerEl.value;
      this.context.lineWidth = this.brushSize.value;
    } else if (this.MODE === "ERASER") {
      this.context.strokeStyle = this.eraserColor;
      this.context.lineWidth = 50;
    }
    this.saveState();
  }

  onMouseMove(event) {
    // 마우스가 다운된 상태가 아니라면 동작 멈춰.
    if (!this.isMouseDown) return;
    const currentPosition = this.getMousePosition(event);
    this.context.lineTo(currentPosition.x, currentPosition.y);
    this.context.stroke();
  }

  onMouseUp() {
    if (this.MODE === "NONE") return;
    this.isMouseDown = false;
    this.updateNavigator();
  }

  getMousePosition(event) {
    const boundaries = this.canvasEl.getBoundingClientRect();
    return {
      x: event.clientX - boundaries.left,
      y: event.clientY - boundaries.top,
    };
  }

  onClickBrush(event) {
    const isActive = event.currentTarget.classList.contains("active");
    // brush div 안에 i 태그가 눌릴 수 있으니까 currentTarget으로 찾기.
    this.MODE = isActive ? "NONE" : "BRUSH";
    this.canvasEl.style.cursor = isActive ? "default" : "crosshair";
    this.brushPannelEl.classList.toggle("hide");
    event.currentTarget.classList.toggle("active");
    this.eraserEl.classList.remove("active");
  }
}

new DrawingBoard();
