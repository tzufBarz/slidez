const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
let slide;
const baseWidth = 2400;
const baseHeight = 1800;

function adjustCanvasResolution() {
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;

    const scaleFactorX = screenWidth / baseWidth;
    const scaleFactorY = screenHeight / baseHeight;

    const scaleFactor = Math.min(scaleFactorX, scaleFactorY);

    const canvasWidth = baseWidth * scaleFactor;
    const canvasHeight = baseHeight * scaleFactor;

    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    ctx.scale(scaleFactor, scaleFactor);

    if (slide) renderSlide();
}

window.addEventListener("resize", adjustCanvasResolution)

adjustCanvasResolution();

function setSlide(s) {
    slide = s;
    renderSlide();
}

function renderSlide() {
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, baseWidth, baseHeight);

    slide.elements.forEach(renderElement);
}

function renderElement(element) {
    switch (element.type) {
        case "text":
            ctx.fillStyle = element.color || "black";
            ctx.font = element.font || "24pt Arial";
            ctx.fillText(element.text, element.x, element.y);
            break;
    }
}