"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const test_1 = require("@playwright/test");
const utils_1 = require("../src/utils");
(0, test_1.test)('strips positive bounds attributes', () => {
    const xml = `<node text="ok" bounds="[0,0][1080,2160]" class="X"/>`;
    (0, test_1.expect)((0, utils_1.stripUiBounds)(xml)).toBe(`<node text="ok" class="X"/>`);
});
(0, test_1.test)('strips negative bounds for off-screen elements', () => {
    // UIAutomator reports negative coordinates for elements scrolled partially
    // off-screen; these must be stripped too.
    const xml = `<node bounds="[-5,-20][100,50]"/>`;
    (0, test_1.expect)((0, utils_1.stripUiBounds)(xml)).toBe(`<node/>`);
});
(0, test_1.test)('strips every bounds attribute in the dump', () => {
    const xml = `<a bounds="[0,0][10,10]"/><b bounds="[-1,-1][2,3]"/>`;
    (0, test_1.expect)((0, utils_1.stripUiBounds)(xml)).toBe(`<a/><b/>`);
});
(0, test_1.test)('leaves XML without bounds untouched', () => {
    const xml = `<node text="hi" class="android.widget.TextView"/>`;
    (0, test_1.expect)((0, utils_1.stripUiBounds)(xml)).toBe(xml);
});
(0, test_1.test)('preserves malformed bounds-like strings verbatim', () => {
    // Only well-formed `[x,y][x,y]` integer pairs are stripped; anything else
    // (extra coordinates, decimals, non-numeric) must pass through untouched.
    const threeCoords = `<node bounds="[0,0,0][10,10,10]"/>`;
    const decimal = `<node bounds="[0.5,0][10,10]"/>`;
    const nonNumeric = `<node bounds="abc"/>`;
    (0, test_1.expect)((0, utils_1.stripUiBounds)(threeCoords)).toBe(threeCoords);
    (0, test_1.expect)((0, utils_1.stripUiBounds)(decimal)).toBe(decimal);
    (0, test_1.expect)((0, utils_1.stripUiBounds)(nonNumeric)).toBe(nonNumeric);
});
//# sourceMappingURL=strip-ui-bounds.test.js.map