import assert from 'node:assert/strict';
import { pinchTransform } from '../src/map-touch.js';
const start = {k: 2, distance: 100, anchor: [50, 50]};
assert.deepEqual(pinchTransform(start, [[0, 100], [200, 100]]), {k: 4, x: -100, y: -100});
assert.deepEqual(pinchTransform(start, [[75, 100], [125, 100]]), {k: 1, x: 50, y: 50});
assert.deepEqual(pinchTransform(start, [[20, 120], [120, 120]]), {k: 2, x: -30, y: 20});
assert.equal(pinchTransform(start, [[0, 0], [100000, 0]]).k, 450);
assert.equal(pinchTransform(start, [[0, 0], [1, 0]]).k, 1);
console.log('Pinch geometry passed: anchored expansion/contraction, midpoint panning and zoom limits.');
