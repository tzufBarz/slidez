const navbar = document.getElementById("navbar");
const toolbar = document.getElementById("toolbar");

const textBar = document.getElementById("text-bar");
const fontSize = document.getElementById("fontsize");
const fontFamily = document.getElementById("fontfamily");

const thumbnailCanvas = document.createElement("canvas");
const thumbnailCtx = thumbnailCanvas.getContext("2d");

thumbnailCanvas.width = 200;
thumbnailCanvas.height = thumbnailCanvas.width * (baseHeight / baseWidth);
const thumbnailScale = thumbnailCanvas.width / baseWidth;
thumbnailCtx.scale(thumbnailScale, thumbnailScale);

let selected;
let dragged = false;
let dragging = false;
let dragX;
let dragY;

let toolbarPage = 0;

let clipboard;

let thumbnailPath = "./data";

const thumbnails = [];
const thumbnailContainer = document.getElementById("thumbnails");

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
    if (selected && selected.type == "text") {
        textBar.classList.add("show");
        fontSize.value = selected.fontSize;
        fontFamily.value = selected.fontFamily;
    }
    else textBar.classList.remove("show");
    adjustCanvasResolution();
    dragged = false;
    dragging = false;
    renderSlide();
});

fontSize.addEventListener("change", () => {
    if (selected && selected.type == "text") {
        selected.fontSize = parseInt(fontSize.value);
        textMeasure(selected);
        renderSlide();
    }
});

fontFamily.addEventListener("change", () => {
    if (selected && selected.type == "text") {
        selected.fontFamily = fontFamily.value;
        textMeasure(selected);
        renderSlide();
    }
});

window.addEventListener("keydown", (e) => {
    if (e.ctrlKey && e.key === 's') {
        savePresentation()
    }

    if (e.key == "F5") {
        savePresentation().finally(() => {
            window.location.href = "viewer.html";
        });
    }

    if (e.key == "Delete" && document.activeElement === thumbnailContainer && slides.length > 1) {
        deleteSlide(slideN);
    }

    if (document.activeElement !== canvas) return;

    if (selected && selected.type == "text") {
        if (e.key.length === 1 && !e.ctrlKey && !e.metaKey) {
            selected.text ??= "";
            selected.text += e.key;
        } else if (e.key === "Backspace") {
            selected.text = selected.text.slice(0, -1);
            if (selected.text == "") selected.text = undefined;
        }
        textMeasure(selected);
        renderSlide();
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
});

window.addEventListener("unload", savePresentation);

async function savePresentation() {
    generateThumbnail(slideN);
    for (let i = 0; i < slides.length; i++) {
        window.electronAPI.saveThumbnail(`${thumbnailPath}/${i}.png`, thumbnails[i]);
    }

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

function insertTextBox() {
    let textBox = {
        type: "text",
        x: baseWidth / 2,
        y: baseHeight / 2
    };
    initElement(textBox);
    slide.elements.push(textBox);
    renderSlide();
}

function generateThumbnail(n) {
    thumbnailCtx.fillStyle = "white";
    thumbnailCtx.globalAlpha = 1;
    thumbnailCtx.fillRect(0, 0, baseWidth, baseHeight);

    slides[n].elements.forEach((element) => renderElement(element, false, thumbnailCtx));

    thumbnails[n] = thumbnailCanvas.toDataURL("image/png");

    thumbnailContainer.children[n].src = thumbnails[n];
};

function addThumbnails() {
    for (let i = thumbnailContainer.children.length; i < slides.length; i++) {
        const thumbnail = document.createElement("img");
        thumbnail.src = `${thumbnailPath}/${i}.png`;
        thumbnail.width = 200;
        thumbnailContainer.append(thumbnail);
        thumbnail.addEventListener("click", () => {
            setSlide(i);
        })
    }
}

function insertSlide() {
    slides.push({elements: [], transition: "morph"});
    addThumbnails();
    generateThumbnail(slides.length - 1);
    window.electronAPI.saveThumbnail(`${thumbnailPath}/${slides.length - 1}.png`, thumbnails[slides.length - 1]);s
    setSlide(slides.length - 1);
}

function deleteSlide(n) {
    setSlide(n - 1);
    slides.splice(n, 1);
    thumbnailContainer.removeChild(thumbnailContainer.children[n]);
    thumbnails.splice(n, 1);        
    window.electronAPI.removeThumbnail(`${thumbnailPath}/${n}.png`);
}