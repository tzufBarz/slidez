isEditor = false;

window.addEventListener("keydown", (e) => {
    if (e.key == "Escape") {
        window.location.href = "editor.html";
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