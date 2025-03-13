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

    if (isEditor) addThumbnails();

    setSlide(0);
}

function initElement(element) {
    element.r ??= 0;
    element.g ??= 0;
    element.b ??= 0;
    element.a ??= 1;
    if (element.type == "text") {
        element.fontSize ??= 64;
        element.fontFamily ??= "Arial";
        textMeasure(element);
    }
}

function textMeasure(element) {
    ctx.font = `${element.fontSize}px '${element.fontFamily}'`;
    element.width = ctx.measureText(element.text).width;
    element.height = element.fontSize;
}

function setSlide(n) {
    if (transProgress > 0 || n >= slides.length || n < 0) return;
    if (isEditor) {
        if (slide) {
            slides[slideN] = slide;
            generateThumbnail(slideN);
            thumbnailContainer.children[slideN].classList.remove("selected");
        }
        thumbnailContainer.children[n].classList.add("selected");
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

function getElement(x, y) {
    return slide.elements.find((elem) => 
        (x < elem.x + elem.width / 2 && x > elem.x - elem.width / 2) && (y < elem.y + elem.height / 2 && y > elem.y - elem.height / 2)
    );
}

function isSame(e1, e2) {
    for (key of Object.keys(e1)) {
        if (!transProp.includes(key) &&
            key != "found" && e1[key] != e2[key]) return false;
    }
    return true;
}