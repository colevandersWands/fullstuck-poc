const assert = require('assert');

const report = [];



let whileResult = .5;
let x = 9;
while (x > 2) {
  whileResult *= x;
  x--;
};

// refactor the while loop into a for loop
// let forResult = null;
//

let forResult = .5;
for (let x = 9; x > 2; x--) {
  forResult *= x;
};


try {
  report.push(['both loops should have the same behavior']);
  assert.strictEqual(forResult, whileResult);
} catch (assertErr) { report.slice(-1)[0].push(assertErr) };


if (module.parent === null) {
  console.log(report);
} else {
  module.exports = report;
}
