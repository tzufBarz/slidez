const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const baseWidth = 2400;
const baseHeight = 1800;

function adjustCanvasResolution() {
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight - (document.getElementById("topbar") ?? {offsetHeight: 0}).offsetHeight;

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
    ctx.globalAlpha = 1;
    ctx.fillRect(0, 0, baseWidth, baseHeight);

    slide.elements.forEach((element) => renderElement(element));
}

function renderElement(element, iE=isEditor, ct=ctx) {
    switch (element.type) {
        case "text":
            ct.fillStyle = `rgba(${element.r}, ${element.g}, ${element.b}, ${element.a})`;
            ct.font = `${element.fontSize}px '${element.fontFamily}'`;
            ct.textAlign = "center";
            ct.textBaseline = "middle";

            if (!element.text) {
                if (iE) {
                    ct.globalAlpha = 0.5;
                    ct.fillText("Insert Text", element.x, element.y);
                    ct.globalAlpha = 1;
                }
            } else {
                ct.fillText(element.text, element.x, element.y);
            }
            
            if (iE) {
                ct.strokeStyle = element == selected ? "black" : "gray";
                ct.beginPath();
                ct.rect(element.x - element.width / 2, element.y - element.height / 2, element.width, element.height);
                ct.stroke();
            }
            
            break; 
    }
}