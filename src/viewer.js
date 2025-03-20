isEditor = false;

const fileInput = document.createElement('input');
fileInput.type = "file";
fileInput.accept = "application/json";

fileInput.addEventListener("change", (e) => {
    const file = e.target.files[0];

    const reader = new FileReader();

    reader.onload = () => {
        try {
          const jsonData = JSON.parse(reader.result); // Parse JSON data
          start(jsonData);
        } catch (error) {
          console.error("Error parsing JSON:", error);
        }
    }

    reader.readAsText(file);
});

window.addEventListener("keydown", (e) => {
    // if (e.key == "Escape") {
    //     window.location.href = "editor.html";
    // }
    
    if (e.ctrlKey && e.key === 'o') {
        fileInput.click();
    }
})

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
                if (element[prop] != undefined) {
                    element[`START_${prop}`] = element[prop];
                    element[`TARGET_${prop}`] = newE[prop];
                }
            }
        } else {
            element.START_a = element.a;
            element.TARGET_a = 0;
        }
    }
    for (let element of nextSlide.elements) {
        if (!element.found) {
            slide.elements.push(element);
            element.START_a = 0;
            element.TARGET_a = element.a;
        }
    }
}