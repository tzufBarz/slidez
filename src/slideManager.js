let slides;
let slideN;
let slide;
let filePath = "./data/slides.json";

let isEditor = true;

let nextSlide;
let lastUpdate;
let transProgress = 0;
let transLength;
let transInterval;

let transProp = ["x", "y", "width", "height", "fontSize", "r", "g", "b", "a"];

fetch(filePath)
  .then(response => {
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return response.json();
  })
  .then(start)
  .catch(error => {
    console.error("There was an error while loading the slides:", error);
});

function start(s) {
    slides = s;
    slides.forEach((slide) => {
        slide.elements.forEach(initElement);
    });
    setSlide(0);
}

function initElement(element) {
    element.r ??= 0;
    element.g ??= 0;
    element.b ??= 0;
    element.a ??= 1;
    element.fontSize ??= 64;
    element.fontFamily ??= "Arial";
    ctx.font = `${element.fontSize}px ${element.fontFamily}`;
    element.width = ctx.measureText(element.text).width;
    element.height = element.fontSize;
}

function setSlide(n) {
    if (transProgress > 0 || n >= slides.length || n < 0) return;
    if (isEditor) {
        if (editing) {
            editing.selected = undefined;
            editing = undefined;
        }
        if (dragging) {
            dragging.selected = undefined;
            dragging = undefined;
        }
        slides[slideN] = slide;
    }
    slideN = n;
    nextSlide = structuredClone(slides[slideN]);
    if (isEditor || !slide || !slide.transition) {
        slide = nextSlide;
        renderSlide();
    } else if (slide.transition == "morph") startTransition(1);
}

window.addEventListener("keyup", (event) => {
    switch (event.key) { 
        case "ArrowRight":
        case "ArrowDown":
            setSlide(slideN + 1);
            break;
        case "ArrowLeft":
        case "ArrowUp":
            setSlide(slideN - 1);
            break;
    }
})