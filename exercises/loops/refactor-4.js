const assert = require('assert');

const report = [];


let whileResult = true;
let x = -1;
while (x < 2) {
  whileResult = whileResult && Boolean(x);
  x++;
};

// refactor the while loop into a for loop
let forResult = null;

try {
  report.push(['both loops should have the same behavior']);
  assert.strictEqual(forResult, whileResult);
} catch (assertErr) { report.slice(-1)[0].push(assertErr) };


if (module.parent === null) {
  console.log(report);
} else {
  module.exports = report;
}
