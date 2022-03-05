let state = {
  // map of image positions under cursor on mouse down
  dragging: null,
  // current images position and dimension {x, y, width, height}
  images: [],
};

/**
 * Sets canvas height and width to 16:9 aspect ratio
 * @param {HTML Canvas} canvas
 */
function setCanvasDimensions(canvas) {
  let height = document.documentElement.clientHeight;
  let width = height * (16 / 9);
  // check width > available width
  if (width > document.documentElement.clientWidth) {
    width = document.documentElement.clientWidth;
    height = width * (9 / 16);
  }
  canvas.height = height;
  canvas.width = width;
}

/**
 * Draws images in canvas
 * @param {HTML Canvas} canvas
 */
function drawImages(canvas) {
  const ctx = canvas.getContext("2d");

  // clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  Array.from(document.getElementsByClassName("image")).forEach((image, i) =>
    ctx.drawImage(image, state.images[i].x, state.images[i].y)
  );

  // if dragging, draw green image border
  if (state.dragging) {
    Object.keys(state.dragging).forEach((i) => {
      ctx.beginPath();
      ctx.lineWidth = 2;
      ctx.strokeStyle = "green";
      ctx.rect(
        state.images[i].x,
        state.images[i].y,
        state.images[i].width,
        state.images[i].height
      );
      ctx.stroke();
    });
  }
}

/**
 * Handles mouse events to redraw images on drag and drop
 * @param {HTML Canvas} canvas
 */
function dragAndDropImages(canvas) {
  // drag start mouse position
  let startX, startY;

  // canvas offset (which should be 0,0)
  const rect = canvas.getBoundingClientRect();
  const offsetX = rect.left;
  const offsetY = rect.top;

  function mouseDown(event) {
    event.preventDefault();
    event.stopPropagation();

    // set the drag start mouse position
    startX = event.clientX - offsetX;
    startY = event.clientY - offsetY;

    // map of images under mouse position
    state.dragging = state.images.reduce(
      (acc, image, i) => ({
        ...acc,
        ...(startX > image.x &&
          startX < image.x + image.width &&
          startY > image.y &&
          startY < image.y + image.height && { [i]: image }),
      }),
      {}
    );
  }
  canvas.onmousedown = mouseDown;

  function mouseMove(event) {
    if (!state.dragging) return;

    event.preventDefault();
    event.stopPropagation();

    // current mouse position
    const mouseX = event.clientX - offsetX;
    const mouseY = event.clientY - offsetY;

    // change in position since drag start
    const dX = mouseX - startX;
    const dY = mouseY - startY;

    if (dX || dY) {
      // calculate new image positions
      const images = state.images.map((image, i) => ({
        ...image,
        ...(state.dragging &&
          state.dragging[i] && {
            x: state.dragging[i].x + dX,
            y: state.dragging[i].y + dY,
          }),
      }));

      const maxCanvasX = offsetX + canvas.width;
      const maxCanvasY = offsetY + canvas.height;

      // only update image positions if they would still be inside canvas
      // current limitation:
      //    if image ends up outside canvas boundary due to resize or size constraints,
      //    pulling it back in is jerky at best.
      const insideBoundaries = images.every(
        (image) =>
          image.x >= offsetX &&
          image.x + image.width <= maxCanvasX &&
          image.y >= offsetY &&
          image.y + image.height <= maxCanvasY
      );
      if (insideBoundaries) {
        state.images = images;
        drawImages(canvas);
      }
    }
  }
  canvas.onmousemove = mouseMove;

  function mouseUpOut(event) {
    if (!state.dragging) return;

    event.preventDefault();
    event.stopPropagation();

    state.dragging = null;
    drawImages(canvas);
  }
  canvas.onmouseup = mouseUpOut;
  canvas.onmouseout = mouseUpOut;
}

/**
 * Draws the canvas on changes
 * @param {HTML Canvas} c
 */
function drawCanvas() {
  const canvas = document.getElementById("screen");

  // 16:9 aspect ratio
  setCanvasDimensions(canvas);

  // draws images at positions in state
  drawImages(canvas);

  // drag and drop handling
  dragAndDropImages(canvas);
}

/**
 * Sets the initial image positions on load
 */
function setInitialState() {
  // current limitation: images are initially laid out horizontally without regard for fit inside canvas
  state.images = Array.from(document.getElementsByClassName("image")).map(
    ({ width, height }, i, images) => ({
      x: i > 0 ? images[i - 1].width : 0,
      y: 0,
      width,
      height,
    })
  );
}

/**
 * Run on window load to set up canvas and event listeners
 */
function onLoad() {
  setInitialState();

  // draw initial canvas
  drawCanvas();

  // redraw on resize to maintain aspect ratio
  window.addEventListener("resize", drawCanvas);
}
window.onload = onLoad;
