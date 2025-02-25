function renderSlide(ctx, slide) {
    slide.elements.forEach(renderElement.bind(ctx))
}

function renderElement(element) {
    switch (element.type) {
        case "text":
            font = "20px Arial";
            fillText(element.text, element.x, element.y);
    }
}