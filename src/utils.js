const Easing = {
    LINEAR: (t) => t,
    EASE_IN: (t) => t * t,
    EASE_OUT: (t) => t * (2 - t),
    EASE_IN_OUT: (t) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t
};

function interp(start, end, t, easing = Easing.EASE_IN_OUT) {
    return start + (end - start) * easing(t);
}