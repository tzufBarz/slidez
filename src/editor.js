let dragging;
let dragX;
let dragY;

canvas.addEventListener("mousedown", (e) => {
    const rect = canvas.getBoundingClientRect()
    const x = (e.clientX - rect.left) * baseWidth / canvas.width;
    const y = (e.clientY - rect.top) * baseHeight / canvas.height;
    dragging = getElement(x, y);
    if (dragging) {
        dragX = dragging.x - x;
        dragY = dragging.y - y;
    }
});

canvas.addEventListener("mousemove", (e) => {
    if (dragging) {
        const rect = canvas.getBoundingClientRect();
        const x = (e.clientX - rect.left) * baseWidth / canvas.width;
        const y = (e.clientY - rect.top) * baseHeight / canvas.height;
        dragging.x = x + dragX;
        dragging.y = y + dragY;
        renderSlide();
    }
});

canvas.addEventListener("mouseup", (e) => {
    dragging = undefined;
});