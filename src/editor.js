const navbar = document.getElementById("navbar");
const toolbar = document.getElementById("toolbar");

let dragging;
let dragged = false;
let dragX;
let dragY;

let editing;

let toolbarPage = 0;

let clipboard;

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
            editing.text ??= "";
            editing.text += e.key;
        } else if (e.key === "Backspace") {
            editing.text = editing.text.slice(0, -1);
            if (editing.text == "") editing.text = undefined;
        }
        ctx.font = editing.font;
        editing.width = ctx.measureText(editing.text).width;
        renderSlide();
    }

    if (e.ctrlKey && e.key === 's') {
        savePresentation()
    }

    if (e.ctrlKey && e.key == 'c' && editing) {
        clipboard = structuredClone(editing);
        clipboard.selected = undefined;
    }

    if (e.ctrlKey && e.key == 'v' && clipboard) {
        slide.elements.push(structuredClone(clipboard));
        renderSlide();
    }

    if (e.key == "Delete" && editing) {
        slide.elements.splice(slide.elements.indexOf(editing), 1);
        renderSlide();
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

[...navbar.children].forEach((button, i) => {
    button.addEventListener("click", () => {
        navbar.children[toolbarPage].classList.remove("active");
        toolbar.children[toolbarPage].classList.remove("show");
        toolbarPage = i;
        navbar.children[toolbarPage].classList.add("active");
        toolbar.children[toolbarPage].classList.add("show");
        adjustCanvasResolution();
    });
});

function addTextBox() {
    let textBox = {
        type: "text",
        x: baseWidth / 2,
        y: baseHeight / 2
    };
    initElement(textBox);
    slide.elements.push(textBox);
    renderSlide();
}