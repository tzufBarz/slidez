let dragging;
let dragged = false;
let dragX;
let dragY;

let editing;

canvas.addEventListener("mousedown", (e) => {
    const rect = canvas.getBoundingClientRect()
    const x = (e.clientX - rect.left) * baseWidth / canvas.width;
    const y = (e.clientY - rect.top) * baseHeight / canvas.height;
    if (editing) editing.selected = false;
    dragging = getElement(x, y);
    if (dragging) {
        dragging.selected = true;
        dragX = dragging.x - x;
        dragY = dragging.y - y;
        renderSlide();
    }
});

canvas.addEventListener("mousemove", (e) => {
    if (dragging) {
        dragged = true;
        const rect = canvas.getBoundingClientRect();
        const x = (e.clientX - rect.left) * baseWidth / canvas.width;
        const y = (e.clientY - rect.top) * baseHeight / canvas.height;
        dragging.x = x + dragX;
        dragging.y = y + dragY;
        renderSlide();
    }
});

canvas.addEventListener("mouseup", (e) => {
    if (dragged) {
        dragged = false;
        dragging.selected = false;
    }
    else editing = dragging;
    dragging = undefined;
    renderSlide();
});

window.addEventListener("keydown", (e) => {
    if (editing) {
        if (e.key.length === 1 && !e.ctrlKey && !e.metaKey) {
            editing.text += e.key;
        } else if (e.key === "Backspace") {
            editing.text = editing.text.slice(0, -1);
        }
        ctx.font = editing.font;
        editing.width = ctx.measureText(editing.text).width;
        renderSlide();
    }

    if (e.ctrlKey && e.key === 's') {
        
    }

    if (e.key == "F5") {
        window.location.href = "viewer.html";
    }
});