const assert = require('assert');

const report = [];

let forResult = 0;
for (let i = 0, j = 10; i !== j; i++ , j--) {
  forResult = i;
}

// refactor the for loop into a while loop
let whileResult = 0;

try {
  report.push(['both loops should have the same behavior']);
  assert.strictEqual(forResult, whileResult);
} catch (assertErr) { report.slice(-1)[0].push(assertErr) };


if (module.parent === null) {
  console.log(report);
} else {
  module.exports = report;
}
