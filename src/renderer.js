const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const baseWidth = 2400;
const baseHeight = 1800;
let isEditor = true;

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

function renderSlide() {
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, baseWidth, baseHeight);

    slide.elements.forEach(renderElement);
}

function renderElement(element) {
    switch (element.type) {
        case "text":
            ctx.fillStyle = element.color;
            ctx.font = element.font;
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText(element.text, element.x, element.y);

            if (isEditor) {
                ctx.strokeStyle = element.selected ? "black" : "gray";
                ctx.beginPath();
                ctx.rect(element.x - element.width / 2, element.y - element.height / 2, element.width, element.height);
                ctx.stroke();
            }
            break;
    }
}