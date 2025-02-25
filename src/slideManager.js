let slides;
let slideN;
let slide;

fetch("/data/slides.json")
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
    setSlide(0);
}

function setSlide(n) {
    if (n >= slides.length || n < 0) return;
    slideN = n;
    slide = slides[slideN];
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
    console.log(x,y)
    return slide.elements.find((elem) => 
        (x < elem.x + elem.width / 2 && x > elem.x - elem.width / 2) && (y < elem.y + elem.height / 2 && y > elem.y - elem.height / 2)
    );
}