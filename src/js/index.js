class DrawingBoard {
  MODE = "NONE"; // NONE BRUSH EARASER
  isMouseDown = false;
  constructor() {
    this.assignElement();
    this.initContext();
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
  }

  initContext() {
    this.context = this.canvasEl.getContext("2d");
  }

  addEvent() {
    this.brushEl.addEventListener("click", this.onClickBrush.bind(this));
    this.canvasEl.addEventListener("mousedown", this.onMouseDown.bind(this));
    this.canvasEl.addEventListener("mousemove", this.onMouseMove.bind(this));
    this.canvasEl.addEventListener("mouseup", this.onMouseUp.bind(this));
    this.canvasEl.addEventListener("mouseout", this.onMouseOut.bind(this));
    this.brushSize.addEventListener("input", this.onChangeBrushSize.bind(this));
    this.colorPickerEl.addEventListener("input", this.onChangeColor.bind(this));
  }

  onMouseOut() {
    if (this.MODE === "NONE") return;
    this.isMouseDown = false;
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
    this.context.strokeStyle = this.colorPickerEl.value;
    this.context.lineWidth = this.brushSize.value;
    // this.context.lineTo(400, 400);
    // this.context.stroke();
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
    this.brushEl.classList.toggle("active");
  }
}

new DrawingBoard();
