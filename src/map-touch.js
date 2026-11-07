/** Cooperative touch navigation: two fingers control the map, one scrolls the page. */
export function pinchTransform(start, points) {
  const midpoint = [(points[0][0] + points[1][0]) / 2, (points[0][1] + points[1][1]) / 2];
  const distance = Math.hypot(points[1][0] - points[0][0], points[1][1] - points[0][1]);
  const k = Math.max(1, Math.min(450, start.k * distance / start.distance));
  return { k, x: midpoint[0] - start.anchor[0] * k, y: midpoint[1] - start.anchor[1] * k };
}

export function installMapPinch(element, { readTransform, applyTransform, onStart }) {
  let gesture = null, suppressClickUntil = 0;
  const point = touch => {
    const p = element.createSVGPoint(); p.x = touch.clientX; p.y = touch.clientY;
    const matrix = element.getScreenCTM();
    if (!matrix) return null;
    const local = p.matrixTransform(matrix.inverse());
    return [local.x, local.y];
  };
  element.addEventListener('touchstart', event => {
    if (event.touches.length < 2) return;
    event.preventDefault();
    const touches = [...event.touches].slice(0, 2), points = touches.map(point);
    if (points.some(p => !p)) return;
    onStart();
    const t = readTransform(), middle = [(points[0][0] + points[1][0]) / 2, (points[0][1] + points[1][1]) / 2];
    const distance = Math.hypot(points[1][0] - points[0][0], points[1][1] - points[0][1]);
    gesture = distance > 0 ? { ids: touches.map(t => t.identifier), distance, k: t.k, anchor: [(middle[0] - t.x) / t.k, (middle[1] - t.y) / t.k] } : null;
    suppressClickUntil = Date.now() + 500;
  }, { passive: false });
  element.addEventListener('touchmove', event => {
    if (!gesture || event.touches.length < 2) return;
    const touches = gesture.ids.map(id => [...event.touches].find(t => t.identifier === id));
    if (touches.some(t => !t)) return;
    event.preventDefault();
    const points = touches.map(point);
    if (points.every(Boolean)) applyTransform(pinchTransform(gesture, points));
    suppressClickUntil = Date.now() + 500;
  }, { passive: false });
  const finish = event => {
    if (!gesture) return;
    if (event.touches.length < 2) gesture = null;
    suppressClickUntil = Date.now() + 500;
  };
  element.addEventListener('touchend', finish, { passive: true });
  element.addEventListener('touchcancel', () => { gesture = null; suppressClickUntil = Date.now() + 500; }, { passive: true });
  element.addEventListener('click', event => {
    if (Date.now() < suppressClickUntil) { event.preventDefault(); event.stopImmediatePropagation(); }
  }, true);
}
