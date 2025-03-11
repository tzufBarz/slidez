const navbar = document.getElementById("navbar");
const toolbar = document.getElementById("toolbar");

let selected;
let dragged = false;
let dragging = false;
let dragX;
let dragY;

let toolbarPage = 0;

let clipboard;

canvas.addEventListener("mousedown", (e) => {
    const rect = canvas.getBoundingClientRect()
    const x = (e.clientX - rect.left) * baseWidth / canvas.width;
    const y = (e.clientY - rect.top) * baseHeight / canvas.height;
    selected = getElement(x, y);
    if (selected) {
        dragging = true;
        dragX = selected.x - x;
        dragY = selected.y - y;
        renderSlide();
    }
});

canvas.addEventListener("mousemove", (e) => {
    if (selected && dragging) {
        dragged = true;
        const rect = canvas.getBoundingClientRect();
        const x = (e.clientX - rect.left) * baseWidth / canvas.width;
        const y = (e.clientY - rect.top) * baseHeight / canvas.height;
        selected.x = x + dragX;
        selected.y = y + dragY;
        renderSlide();
    }
});

canvas.addEventListener("mouseup", (e) => {
    dragged = false;
    dragging = false;
    renderSlide();
});

window.addEventListener("keydown", (e) => {
    if (selected && selected.type == "text") {
        if (e.key.length === 1 && !e.ctrlKey && !e.metaKey) {
            selected.text ??= "";
            selected.text += e.key;
        } else if (e.key === "Backspace") {
            selected.text = selected.text.slice(0, -1);
            if (selected.text == "") selected.text = undefined;
        }
        ctx.font = selected.font;
        selected.width = ctx.measureText(selected.text).width;
        renderSlide();
    }

    if (e.ctrlKey && e.key === 's') {
        savePresentation()
    }

    if (e.ctrlKey && e.key == 'c' && selected) {
        clipboard = structuredClone(selected);
    }

    if (e.ctrlKey && e.key == 'v' && clipboard) {
        slide.elements.push(structuredClone(clipboard));
        renderSlide();
    }

    if (e.key == "Delete" && selected) {
        slide.elements.splice(slide.elements.indexOf(selected), 1);
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
    if (selected) {
        selected = undefined;
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