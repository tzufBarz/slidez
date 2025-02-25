let slides;
let slideN;

fetch("/data/slides.json")
  .then(response => {
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return response.json();
  })
  .then(present)
  .catch(error => {
    console.error("There was an error while loading the slides:", error);
});

function present(s) {
    slides = s;
    slideN = 0;
    setSlide(slides[slideN]);
}

window.addEventListener("keyup", (event) => {
    switch (event.key) {
        case "ArrowRight":
            if (slideN < slides.length - 1) {
                slideN++;
                setSlide(slides[slideN]);
            }
            break;
        case "ArrowLeft":
            if (slideN > 0) {
                slideN--;
                setSlide(slides[slideN]);
            }
            break;
    }
})