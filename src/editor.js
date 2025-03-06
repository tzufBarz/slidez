let dragging;
let dragged = false;
let dragX;
let dragY;

let editing;

let page = 0;

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
        savePresentation()
    }

    if (e.key == "F5") {
        savePresentation().finally(() => {
            window.location.href = "viewer.html";
        });
    }
});

window.addEventListener("unload", savePresentation);

async function savePresentation() {
    if (editing) {
        editing.selected = undefined;
        editing = undefined;
    }
    if (dragging) {
        dragging.selected = undefined;
        dragging = undefined;
    }
    slides[slideN] = slide;
    const result = await window.electronAPI.saveFile(filePath, slides);
    if (result.success) {
        console.log('File saved successfully');
    } else {
        console.error('Error saving file:', result.error);
    }
}

document.querySelectorAll(".top-button").forEach((button, i) => {
    button.addEventListener("click", () => {
        console.log(page);
        document.querySelector(`.top-button:nth-child(${page + 1})`).classList.remove("active");
        page = i;
        document.querySelector(`.top-button:nth-child(${page + 1})`).classList.add("active");
    });
});