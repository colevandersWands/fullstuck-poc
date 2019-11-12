const assert = require('assert');

const report = [];



let whileResult = 0;
let i = 0;
while (i !== 8) {
  whileResult += i;
  i += 2;
}

// fix the three pieces of this for loop to pass the assert
let forResult = 0;
// for (null; null; null) {
//   forResult += i;
// }

for (let i = 0; i !== 8; i += 2) {
  forResult += i;
}



try {
  report.push(['both loops should have the same behavior']);
  assert.strictEqual(forResult, whileResult);
} catch (assertErr) { report.slice(-1)[0].push(assertErr) };


if (module.parent === null) {
  console.log(report);
} else {
  module.exports = report;
}
