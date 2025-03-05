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

let transProp = ["x", "y", "width", "height", "fontSize", "alpha"];

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
        slide.elements.forEach((element) => {
            element.color ??= "black";
            element.fontSize ??= 64;
            element.fontFamily ??= "Arial";
            ctx.font = `${element.fontSize}px ${element.fontFamily}`;
            element.width = ctx.measureText(element.text).width;
            element.height = element.fontSize;
        });
    });
    setSlide(0);
}

function setSlide(n) {
    if (transProgress > 0 || n >= slides.length || n < 0) return;
    if (isEditor) slides[slideN] = slide;
    slideN = n;
    nextSlide = structuredClone(slides[slideN]);
    if (isEditor || !slide || !slide.transition) {
        slide = nextSlide;
        renderSlide();
    } else if (slide.transition == "morph") startTransition(1);
}

function startTransition(length) {
    generateTargets();
    lastUpdate = Date.now();
    transLength = length;
    transInterval = setInterval(updateTransition, 0);
}

function updateTransition() {
    var now = Date.now();
    var dt = now - lastUpdate;
    lastUpdate = now;
    transProgress += dt / (1000 * transLength);
    for (let element of slide.elements) {
        for (let prop of transProp) {
            if (element[`START_${prop}`] != undefined && element[`TARGET_${prop}`] != undefined) {
                element[prop] = interp(element[`START_${prop}`], element[`TARGET_${prop}`], transProgress);
            }
        }
    }
    if (transProgress >= 1) {
        slide = structuredClone(nextSlide);
        transProgress = 0;
        clearInterval(transInterval);
    }
    renderSlide();
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
        if (key != "x" && key != "y" &&
            key != "fontSize" && key != "height" && key != "width" &&
            key != "found" && e1[key] != e2[key]) return false;
    }
    return true;
}

function findFirstUnfound(e) {
    for (let element of nextSlide.elements) {
        if (!element.found && isSame(element, e)) {
            element.found = true;
            return element;
        }
    }
}

function generateTargets() {
    for (let element of slide.elements) {
        newE = findFirstUnfound(element);
        if (newE) {
            for (let prop of transProp) {
                if (element[prop]) {
                    element[`START_${prop}`] = element[prop];
                    element[`TARGET_${prop}`] = newE[prop];
                }
            }
        } else {
            element["START_alpha"] = 1;
            element["TARGET_alpha"] = 0;
        }
    }
}